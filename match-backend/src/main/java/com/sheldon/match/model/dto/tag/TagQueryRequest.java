package com.sheldon.match.model.dto.tag;

import com.sheldon.match.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 标签查询请求
 *
 * @author <a href="https://github.com/sheldon-3601e">sheldon</a>
 * @from <a href="https://github.com/sheldon-3601e">sheldon</a>
 */
@Data
public class TagQueryRequest implements Serializable {

    /**
     * 标签数量
     */
    private Integer number;

    private static final long serialVersionUID = 1L;
}