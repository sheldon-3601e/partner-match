import { DownloadOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Avatar, Card, List, message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import useStyles from './index.style';
import { listCreatedTeamUsingPost } from '@/services/backend/teamController';
const CreatedTeamList: React.FC = () => {
  const { styles: stylesApplications } = useStyles();

  const [createdTeamList, setCreatedTeamList] = useState<API.TeamUserVO[]>([])

  // 获取tab列表数据
  const loadData = async () => {
    const result = await listCreatedTeamUsingPost()
    if (result.data) {
      console.log(result.data)
      setCreatedTeamList(result.data)
    } else {
      message.error('获取数据失败，请你重试！')
    }
  }

  useEffect(() => {
    loadData()
  }, []);

  const CardInfo: React.FC<{
    hasUser: number;
    maxUser: number;
  }> = ({ hasUser, maxUser }) => (
    <div className={stylesApplications.cardInfo}>
      <div>
        <p>已有用户数</p>
        <p>{hasUser}</p>
      </div>
      <div>
        <p>最大用户数</p>
        <p>{maxUser}</p>
      </div>
    </div>
  );

  return (
    <List<API.TeamUserVO>
      rowKey="id"
      className={stylesApplications.filterCardList}
      grid={{
        gutter: 24,
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={createdTeamList}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            hoverable
            bodyStyle={{
              paddingBottom: 20,
            }}
            actions={[
              <Tooltip key="download" title="下载">
                <DownloadOutlined />
              </Tooltip>,
              <Tooltip title="编辑" key="edit">
                <EditOutlined />
              </Tooltip>,
              <Tooltip title="分享" key="share">
                <ShareAltOutlined />
              </Tooltip>,
            ]}
          >
            <Card.Meta avatar={<Avatar size="small" src={item.createUser?.userAvatar} />} title={item.teamName} />
            <div>
              <CardInfo
                hasUser={item.hasNum ?? 1}
                maxUser={item.maxNum ?? 5}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};
export default CreatedTeamList;
