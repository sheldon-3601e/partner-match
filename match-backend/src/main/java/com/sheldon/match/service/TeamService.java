package com.sheldon.match.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sheldon.match.model.entity.Team;
import com.sheldon.match.model.entity.User;

/**
* @author 26483
* @description 针对表【team(队伍)】的数据库操作Service
* @createDate 2024-02-20 16:26:45
*/
public interface TeamService extends IService<Team> {

    /**
     * 创建队伍
     * @param team
     * @param loginUser
     * @return
     */
    Long addTeam(Team team, User loginUser);
}
