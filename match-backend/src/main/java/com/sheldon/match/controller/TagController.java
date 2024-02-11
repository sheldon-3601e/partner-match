package com.sheldon.match.controller;

import com.sheldon.match.common.BaseResponse;
import com.sheldon.match.common.ErrorCode;
import com.sheldon.match.common.ResultUtils;
import com.sheldon.match.exception.BusinessException;
import com.sheldon.match.exception.ThrowUtils;
import com.sheldon.match.model.dto.tag.TagQueryRequest;
import com.sheldon.match.model.entity.Tag;
import com.sheldon.match.model.vo.TagVO;
import com.sheldon.match.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 用户接口
 *
 * @author <a href="https://github.com/sheldon-3601e">sheldon</a>
 * @from <a href="https://github.com/sheldon-3601e">sheldon</a>
 */
@RestController
@RequestMapping("/tag")
@Slf4j
public class TagController {

    @Resource
    private TagService tagService;
//
//    // region 增删改查
//
//    /**
//     * 创建标签
//     *
//     * @param tagAddRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/add")
//    @AuthCheck(mustRole = TagConstant.ADMIN_ROLE)
//    public BaseResponse<Long> addTag(@RequestBody TagAddRequest tagAddRequest, HttpServletRequest request) {
//        if (tagAddRequest == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        Tag tag = new Tag();
//        BeanUtils.copyProperties(tagAddRequest, tag);
//        // 默认密码 12345678
//        String defaultPassword = "12345678";
//        String encryptPassword = DigestUtils.md5DigestAsHex((TagServiceImpl.SALT + defaultPassword).getBytes());
//        tag.setTagPassword(encryptPassword);
//        boolean result = tagService.save(tag);
//        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
//        return ResultUtils.success(tag.getId());
//    }
//
//    /**
//     * 删除用户
//     *
//     * @param deleteRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/delete")
//    @AuthCheck(mustRole = TagConstant.ADMIN_ROLE)
//    public BaseResponse<Boolean> deleteTag(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
//        if (deleteRequest == null || deleteRequest.getId() <= 0) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        boolean b = tagService.removeById(deleteRequest.getId());
//        return ResultUtils.success(b);
//    }
//
//    /**
//     * 更新用户
//     *
//     * @param tagUpdateRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/update")
//    @AuthCheck(mustRole = TagConstant.ADMIN_ROLE)
//    public BaseResponse<Boolean> updateTag(@RequestBody TagUpdateRequest tagUpdateRequest,
//            HttpServletRequest request) {
//        if (tagUpdateRequest == null || tagUpdateRequest.getId() == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        Tag tag = new Tag();
//        BeanUtils.copyProperties(tagUpdateRequest, tag);
//        boolean result = tagService.updateById(tag);
//        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
//        return ResultUtils.success(true);
//    }
//
//    /**
//     * 根据 id 获取用户（仅管理员）
//     *
//     * @param id
//     * @param request
//     * @return
//     */
//    @GetMapping("/get")
//    @AuthCheck(mustRole = TagConstant.ADMIN_ROLE)
//    public BaseResponse<Tag> getTagById(long id, HttpServletRequest request) {
//        if (id <= 0) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        Tag tag = tagService.getById(id);
//        ThrowUtils.throwIf(tag == null, ErrorCode.NOT_FOUND_ERROR);
//        return ResultUtils.success(tag);
//    }
//
//    /**
//     * 根据 id 获取包装类
//     *
//     * @param id
//     * @param request
//     * @return
//     */
//    @GetMapping("/get/vo")
//    public BaseResponse<TagVO> getTagVOById(long id, HttpServletRequest request) {
//        BaseResponse<Tag> response = getTagById(id, request);
//        Tag tag = response.getData();
//        return ResultUtils.success(tagService.getTagVO(tag));
//    }
//
//    /**
//     * 分页获取用户列表（仅管理员）
//     *
//     * @param tagQueryRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/list/page")
//    @AuthCheck(mustRole = TagConstant.ADMIN_ROLE)
//    public BaseResponse<Page<Tag>> listTagByPage(@RequestBody TagQueryRequest tagQueryRequest,
//            HttpServletRequest request) {
//        long current = tagQueryRequest.getCurrent();
//        long size = tagQueryRequest.getPageSize();
//        Page<Tag> tagPage = tagService.page(new Page<>(current, size),
//                tagService.getQueryWrapper(tagQueryRequest));
//        return ResultUtils.success(tagPage);
//    }
//
//    /**
//     * 分页获取用户封装列表
//     *
//     * @param tagPageQueryRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/list/page/vo")
//    public BaseResponse<Page<TagVO>> listTagVOByPage(@RequestBody TagPageQueryRequest tagPageQueryRequest,
//            HttpServletRequest request) {
//        if (tagPageQueryRequest == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        long current = tagPageQueryRequest.getCurrent();
//        long size = tagPageQueryRequest.getPageSize();
//        // 限制爬虫
//        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
//        Page<Tag> tagPage = tagService.page(new Page<>(current, size),
//                tagService.getQueryWrapper(tagPageQueryRequest));
//        Page<TagVO> tagVOPage = new Page<>(current, size, tagPage.getTotal());
//        List<TagVO> tagVO = tagService.getTagVO(tagPage.getRecords());
//        tagVOPage.setRecords(tagVO);
//        return ResultUtils.success(tagVOPage);
//    }

    /**
     * 获取查询次数最多的标签
     *
     * @param request
     * @return
     */
    @PostMapping("/list/vo")
    public BaseResponse<List<TagVO>> listTagVO(
            HttpServletRequest request) {
        List<Tag> tagList = tagService.list();
        List<TagVO> tagVOList = tagService.getTagVO(tagList);
        return ResultUtils.success(tagVOList);
    }

    /**
     * 获取查询次数最多的标签
     *
     * @param tagQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/top/vo")
    public BaseResponse<List<TagVO>> listTagVOByTop(@RequestBody TagQueryRequest tagQueryRequest,
                                                    HttpServletRequest request) {
        if (tagQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Integer number = tagQueryRequest.getNumber();
        // 限制爬虫
        ThrowUtils.throwIf(number > 20, ErrorCode.PARAMS_ERROR);
        List<TagVO> tagVO = tagService.listTopTagVO(number);
        return ResultUtils.success(tagVO);
    }
//
//    // endregion
//
//    /**
//     * 更新个人信息
//     *
//     * @param tagUpdateMyRequest
//     * @param request
//     * @return
//     */
//    @PostMapping("/update/my")
//    public BaseResponse<Boolean> updateMyTag(@RequestBody TagUpdateMyRequest tagUpdateMyRequest,
//            HttpServletRequest request) {
//        if (tagUpdateMyRequest == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        Tag loginTag = tagService.getLoginTag(request);
//        Tag tag = new Tag();
//        BeanUtils.copyProperties(tagUpdateMyRequest, tag);
//        tag.setId(loginTag.getId());
//        boolean result = tagService.updateById(tag);
//        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
//        return ResultUtils.success(true);
//    }
}
