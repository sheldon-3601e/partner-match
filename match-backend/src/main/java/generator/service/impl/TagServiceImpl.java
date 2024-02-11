package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Tag;
import generator.service.TagService;
import generator.mapper.TagMapper;
import org.springframework.stereotype.Service;

/**
* @author 26483
* @description 针对表【tag(标签)】的数据库操作Service实现
* @createDate 2024-02-11 00:54:19
*/
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag>
    implements TagService{

}




