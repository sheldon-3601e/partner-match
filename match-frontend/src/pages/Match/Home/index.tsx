import MarginBottom16 from '@/components/margBottom16';
import { listRecommendUserVoByPageUsingPost } from '@/services/backend/userController';
import { RedoOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import '@umijs/max';
import { Avatar, Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 伙伴匹配 主页
 *
 * @constructor
 */
const MatchHome: React.FC = () => {
  // 初始化查询参数
  const initQueryParams = {
    current: 1,
    pageSize: 8,
  };
  const [queryParams, setQueryParams] = useState(initQueryParams);
  const [recommendUserList, setRecommendUserList] = useState<API.UserVO[]>([]);

  // 获取推荐用户
  const loadData = async () => {
    const res = await listRecommendUserVoByPageUsingPost(queryParams);
    if (res.data) {
      setRecommendUserList(res.data.records ?? []);
    }
  };

  // 刷新页面数据
  const refreshData = () => {
    if (queryParams.current === 4) {
      setQueryParams(initQueryParams);
    } else {
      setQueryParams({
        ...queryParams,
        current: queryParams.current + 1,
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [queryParams]);

  return (
    <PageContainer title={'主页'}>
      <ProCard
        style={{ marginBlockStart: 8 }}
        title="推荐用户"
        extra={
          <div>
            <Button type="primary" size={"large"} shape="round" icon={<RedoOutlined />} onClick={refreshData}>
              换一批
            </Button>
          </div>
        }
        wrap
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
      >
        {recommendUserList.map((item, index) => (
          <ProCard
            key={index}
            colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }}
            headerBordered
            hoverable
            bordered
            title={
              <div>
                <Avatar src={item.userAvatar} style={{ marginRight: '16px' }} />
                {item.userName}
              </div>
            }
            extra={
              <div>
                <Button key={item.id} type={'primary'}>
                  关注
                </Button>
              </div>
            }
          >
            {item.tags?.map((tag) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
            <MarginBottom16 />
            {item.userProfile}
          </ProCard>
        ))}
      </ProCard>
    </PageContainer>
  );
};
export default MatchHome;
