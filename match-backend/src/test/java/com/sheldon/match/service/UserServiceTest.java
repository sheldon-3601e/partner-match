package com.sheldon.match.service;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import com.sheldon.match.model.vo.UserVO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;


/**
 * 用户服务测试
 *
 * @author <a href="https://github.com/sheldon-3601e">sheldon</a>
 * @from <a href="https://github.com/sheldon-3601e">sheldon</a>
 */
@SpringBootTest
public class UserServiceTest {

    @Resource
    private UserService userService;

    @Test
    void userRegister() {
        String userAccount = "yupi";
        String userPassword = "";
        String checkPassword = "123456";
        try {
            long result = userService.userRegister(userAccount, userPassword, checkPassword);
            Assertions.assertEquals(-1, result);
            userAccount = "yu";
            result = userService.userRegister(userAccount, userPassword, checkPassword);
            Assertions.assertEquals(-1, result);
        } catch (Exception e) {

        }
    }

    @Test
    void userLogin() {
    }

    @Test
    void userLoginByMpOpen() {
    }

    @Test
    void getLoginUser() {
    }

    @Test
    void getLoginUserPermitNull() {
    }

    @Test
    void isAdmin() {
    }

    @Test
    void testIsAdmin() {
    }

    @Test
    void userLogout() {
    }

    @Test
    void getLoginUserVO() {
    }

    @Test
    void getUserVO() {
    }

    @Test
    void testGetUserVO() {
    }

    @Test
    void getQueryWrapper() {
    }

    @Test
    void searchUserByTagsUseSQL() {
        List<String> tagNameList = Arrays.asList("java", "python");
        List<UserVO> userVOList = userService.searchUserByTagsUseSQL(tagNameList);
        Assert.notEmpty(userVOList);
    }

    @Test
    void searchUserByTagsUseMemory() {
        List<String> tagNameList = Arrays.asList("java", "python");
        List<UserVO> userVOList = userService.searchUserByTagsUseMemory(tagNameList);
        Assert.notEmpty(userVOList);
    }
}
