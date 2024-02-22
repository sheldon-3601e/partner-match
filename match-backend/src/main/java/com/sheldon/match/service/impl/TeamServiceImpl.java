package com.sheldon.match.service.impl;

import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sheldon.match.common.DeleteRequest;
import com.sheldon.match.common.ErrorCode;
import com.sheldon.match.exception.BusinessException;
import com.sheldon.match.exception.ThrowUtils;
import com.sheldon.match.mapper.TeamMapper;
import com.sheldon.match.model.dto.team.TeamJoinRequest;
import com.sheldon.match.model.dto.team.TeamQueryRequest;
import com.sheldon.match.model.entity.Team;
import com.sheldon.match.model.entity.User;
import com.sheldon.match.model.entity.UserTeam;
import com.sheldon.match.model.enums.TeamStatusEnum;
import com.sheldon.match.model.enums.UserRoleEnum;
import com.sheldon.match.model.vo.TeamUserVO;
import com.sheldon.match.model.vo.UserVO;
import com.sheldon.match.service.TeamService;
import com.sheldon.match.service.UserService;
import com.sheldon.match.service.UserTeamService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Resource
    private UserService userService;

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
        // TODO 提取公共的方法
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
        // 如果是公开状态，密码置空
        if (TeamStatusEnum.PUBLIC.equals(enumValue)) {
            team.setPassword(null);
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

    @Override
    @Transactional
    public boolean deleteTeam(DeleteRequest deleteRequest, User loginUser) {

        Long teamId = deleteRequest.getId();
        // 只有管理员和创建者可以删除队伍
        isAdminOrCreator(teamId, loginUser);
        // 删除队伍
        boolean remove = this.removeById(teamId);
        ThrowUtils.throwIf(!remove, ErrorCode.SYSTEM_ERROR);
        // 删除用户队关系表
        QueryWrapper<UserTeam> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("teamId", teamId);
        remove = userTeamService.remove(queryWrapper);
        ThrowUtils.throwIf(!remove, ErrorCode.SYSTEM_ERROR);
        return true;
    }

    @Override
    public boolean updateTeam(Team team, User loginUser) {
        // 判断是否有权限
        Long teamId = team.getId();
        isAdminOrCreator(teamId, loginUser);

        // 判断参数是否正确
        // 1. 队伍名称不能为空且长度小于等于20
        String teamName = team.getTeamName();
        if (!StringUtils.isEmpty(teamName)) {
            ThrowUtils.throwIf(teamName.length() > 20, ErrorCode.PARAMS_ERROR);
        }
        // 队伍描述不能为空且长度小于等于200
        String description = team.getDescription();
        if (!StringUtils.isEmpty(description)) {
            ThrowUtils.throwIf(description.length() > 200, ErrorCode.PARAMS_ERROR);
        }
        // 过期时间要大于当前时间
        Date expireTime = team.getExpireTime();
        if (expireTime != null) {
            ThrowUtils.throwIf(expireTime.before(new Date()), ErrorCode.PARAMS_ERROR);
        }
        // 队伍状态只能是0, 1, 2
        Integer status = team.getStatus();
        if (status != null) {
            TeamStatusEnum enumValue = TeamStatusEnum.getEnumByValue(status);
            if (enumValue == null) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
            }
            // 如果是加密状态，密码不能为空
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
            // 如果是公开状态，密码置空
            if (TeamStatusEnum.PUBLIC.equals(enumValue)) {
                team.setPassword(null);
            }
        }

        // 更新队伍
        boolean update = this.updateById(team);
        ThrowUtils.throwIf(!update, ErrorCode.SYSTEM_ERROR);
        return update;
    }

    @Override
    public boolean isAdminOrCreator(Long teamId, User loginUser) {
        // 如果是管理员，直接返回true
        if (UserRoleEnum.ADMIN.equals(loginUser.getUserRole())) {
            return true;
        }
        // 判断是否为创建者
        Team team = this.getById(teamId);
        if (team == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        if (team.getUserId().equals(loginUser.getId())) {
            return true;
        }
        throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
    }

    @Override
    public Page<TeamUserVO> listTeamUserVOByPage(TeamQueryRequest teamQueryRequest, User loginUser) {
        Long id = teamQueryRequest.getId();
        String searchKey = teamQueryRequest.getSearchKey();
        String teamName = teamQueryRequest.getTeamName();
        String description = teamQueryRequest.getDescription();
        Integer maxNum = teamQueryRequest.getMaxNum();
        Long userId = teamQueryRequest.getUserId();
        Integer status = teamQueryRequest.getStatus();
        int current = teamQueryRequest.getCurrent();
        int pageSize = teamQueryRequest.getPageSize();
        // 组装查询条件
        QueryWrapper<Team> queryWrapper = new QueryWrapper<>();
        if (id != null) {
            queryWrapper.eq("id", id);
        }
        if (StringUtils.isNotBlank(searchKey)) {
            queryWrapper.like("teamName", searchKey)
                    .or().like("description", searchKey);
        }
        if (StringUtils.isNotBlank(teamName)) {
            queryWrapper.like("teamName", teamName);
        }
        if (StringUtils.isNotBlank(description)) {
            queryWrapper.like("description", description);
        }
        if (maxNum != null) {
            queryWrapper.eq("maxNum", maxNum);
        }
        // 查询不存在过期时间或者过期时间大于当前时间
        queryWrapper.isNull("expireTime").or().ge("expireTime", new Date());
        if (userId != null) {
            queryWrapper.eq("userId", userId);
        }
        // 普通用户只允许查询公开和加密的队伍
        // 管理员允许查询所有队伍
        if (status == null) {
            queryWrapper.in("status", TeamStatusEnum.PUBLIC.getValue(), TeamStatusEnum.SECRET.getValue());
        } else {
            TeamStatusEnum enumByValue = TeamStatusEnum.getEnumByValue(status);
            if (enumByValue != null) {
                if (!UserRoleEnum.ADMIN.equals(loginUser.getUserRole()) && (TeamStatusEnum.PRIVATE.equals(enumByValue))) {
                    throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
                }
                queryWrapper.eq("status", status);
            }
        }

        // 分页查询队伍列表
        Page<Team> teamPage = this.page(new Page<>(current, pageSize), queryWrapper);

        // 取出队伍列表，根据创建者id取出创建者信息
        List<Team> teamList = teamPage.getRecords();
        List<TeamUserVO> teamUserVOList = teamList.stream().map(team -> {
            // 将队伍列表和创建者信息封装成TeamUserVO
            TeamUserVO teamUserVO = new TeamUserVO();
            BeanUtils.copyProperties(team, teamUserVO);
            User user = userService.getById(teamUserVO.getUserId());
            UserVO userVO = userService.getUserVO(user);
            teamUserVO.setCreateUse(userVO);
            return teamUserVO;
        }).collect(Collectors.toList());

        // 封装成Page返回
        Page<TeamUserVO> teamUserVOPage = new Page<>();
        teamUserVOPage.setTotal(teamPage.getTotal());
        teamUserVOPage.setCurrent(teamPage.getCurrent());
        teamUserVOPage.setSize(teamPage.getSize());
        teamUserVOPage.setRecords(teamUserVOList);
        return teamUserVOPage;
    }

    @Override
    public boolean joinTeam(TeamJoinRequest teamJoinRequest, User loginUser) {
        // TODO 应对并发问题，加锁
        if (teamJoinRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long userId = loginUser.getId();
        Long teamId = teamJoinRequest.getTeamId();
        if (teamId == null || teamId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Team team = this.getById(teamId);
        if (team == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        Date expireTime = team.getExpireTime();
        Integer status = team.getStatus();
        String password = team.getPassword();
        Integer maxNum = team.getMaxNum();
        if (expireTime != null && expireTime.before(new Date())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "房间已过期");
        }
        // 不能加入私密房间
        TeamStatusEnum teamStatusEnum = TeamStatusEnum.getEnumByValue(status);
        if (TeamStatusEnum.PRIVATE.equals(teamStatusEnum)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "不能加入私密房间");
        }
        // 如果加入加密房间，必须密码匹配
        String joinPassword = teamJoinRequest.getPassword();
        if (TeamStatusEnum.SECRET.equals(teamStatusEnum)) {
            if (StringUtils.isBlank(joinPassword)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码不能为空");
            }
            String newPassword = joinPassword + SALT;
            String md5Hex1 = DigestUtil.md5Hex(newPassword);
            if (!md5Hex1.equals(password)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "房间密码错误");
            }
        }
        // 只能加入未满、未过期
        QueryWrapper<UserTeam> searchHasJoin = new QueryWrapper<>();
        searchHasJoin.eq("teamId", teamId);
        long hasJoinTeamNum = userTeamService.count(searchHasJoin);
        if (hasJoinTeamNum >= maxNum) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "房间已满");
        }

        // 用户最多加入五个队伍
        QueryWrapper<UserTeam> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userId", userId);
        long userHasJoinTeamNum = userTeamService.count(queryWrapper);
        if (userHasJoinTeamNum >= 5) {
            throw new BusinessException(ErrorCode.MAX_TEAM_NUM_ERROR);
        }
        // 不能重复加入
        queryWrapper.eq("teamId", teamId);
        long isHasJoin = userTeamService.count(queryWrapper);
        if (isHasJoin > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "不能重复加入");
        }
        // 新增队伍和用户的关联信息
        UserTeam userTeam = new UserTeam();
        userTeam.setUserId(userId);
        userTeam.setTeamId(teamId);
        userTeam.setJoinTime(new Date());
        return userTeamService.save(userTeam);
    }

}




