package com.sheldon.match.service.impl;

import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sheldon.match.common.ErrorCode;
import com.sheldon.match.exception.BusinessException;
import com.sheldon.match.exception.ThrowUtils;
import com.sheldon.match.mapper.TeamMapper;
import com.sheldon.match.model.entity.Team;
import com.sheldon.match.model.entity.User;
import com.sheldon.match.model.entity.UserTeam;
import com.sheldon.match.model.enums.TeamStatusEnum;
import com.sheldon.match.service.TeamService;
import com.sheldon.match.service.UserTeamService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.Optional;

/**
 * @author 26483
 * @description 针对表【team(队伍)】的数据库操作Service实现
 * @createDate 2024-02-20 16:26:45
 */
@Service
public class TeamServiceImpl extends ServiceImpl<TeamMapper, Team>
        implements TeamService {

    /**
     * 盐值，混淆密码
     */
    public static final String SALT = "sheldon-match-2024-02-20-16-26-45";

    @Resource
    private UserTeamService userTeamService;

    @Override
    @Transactional
    public Long addTeam(Team team, User loginUser) {
        // 校验参数是否正确
        // 1. 队伍名称不能为空且长度小于等于20
        String teamName = team.getTeamName();
        if (StringUtils.isEmpty(teamName) || teamName.length() > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 队伍描述不能为空且长度小于等于200
        String description = team.getDescription();
        if (StringUtils.isEmpty(description) || description.length() > 200) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 最大人数大于零且小于等于10
        int maxNum = Optional.ofNullable(team.getMaxNum()).orElse(5);
        if (maxNum <= 0 || maxNum > 10) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 过期时间要大于当前时间
        Date expireTime = team.getExpireTime();
        if (expireTime == null || expireTime.before(new Date())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 队伍状态只能是0, 1, 2
        // 如果是加密状态，密码不能为空
        int status = Optional.ofNullable(team.getStatus()).orElse(0);
        TeamStatusEnum enumValue = TeamStatusEnum.getEnumByValue(status);
        if (enumValue == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (TeamStatusEnum.SECRET.equals(enumValue)) {
            String password = team.getPassword();
            if (StringUtils.isBlank(password) || password.length() > 32) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
            } else {
                // 对密码进行加密
                String newPassword = password + SALT;
                String md5Hex1 = DigestUtil.md5Hex(newPassword);
                team.setPassword(md5Hex1);
            }
        }

        Long userId = loginUser.getId();
        team.setUserId(userId);

        // 校验用户最多只能创建五个队伍
        // TODO 用户可能一瞬间创建多个队伍，需要加锁
        // 思路：在用户表中加入一个字段，记录用户创建队伍的时间，如果在一分钟内创建多个队伍，就加锁
        QueryWrapper<Team> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userId", userId);
        long count = this.count(queryWrapper);
        if (count >= 5) {
            throw new BusinessException(ErrorCode.MAX_TEAM_NUM_ERROR);
        }

        // 插入信息到队伍表
        boolean save = this.save(team);
        ThrowUtils.throwIf(!save, ErrorCode.SYSTEM_ERROR);
        // 插入信息到用户队伍关系表
        Long teamId = team.getId();
        UserTeam userTeam = new UserTeam();
        userTeam.setUserId(userId);
        userTeam.setTeamId(teamId);
        userTeam.setJoinTime(new Date());
        save = userTeamService.save(userTeam);
        ThrowUtils.throwIf(!save, ErrorCode.SYSTEM_ERROR);
        return teamId;

    }
}




