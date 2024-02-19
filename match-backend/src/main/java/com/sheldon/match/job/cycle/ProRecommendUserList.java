package com.sheldon.match.job.cycle;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sheldon.match.model.vo.UserVO;
import com.sheldon.match.service.UserService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName ProRecommendUserList
 * @Author 26483
 * @Date 2024/2/19 15:54
 * @Version 1.0
 * @Description 预热推荐用户列表
 */
@Component
public class ProRecommendUserList {

    @Resource
    private RedisTemplate redisTemplate;

    @Resource
    private UserService userService;

    @Scheduled(cron = "0 0 0 1/1 * ? ")
    public void proRecommendUserList() {
        // 1. 获取推荐用户
        List<UserVO> recommendUserList = userService.getRecommendUserList();
        // 3. 将推荐列表存入缓存
        String key = "match:user:recommend:list:userList";
        redisTemplate.opsForValue().set(key, recommendUserList);
    }

}
