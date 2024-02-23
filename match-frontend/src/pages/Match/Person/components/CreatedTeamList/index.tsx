import EditTeam from '@/pages/Match/Team/components/EditTeam';
import { listCreatedTeamUsingPost, updateTeamUsingPost } from '@/services/backend/teamController';
import { DownloadOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Avatar, Card, List, message, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import useStyles from './index.style';

const CreatedTeamList: React.FC = () => {
  const { styles: stylesApplications } = useStyles();

  const [createdTeamList, setCreatedTeamList] = useState<API.TeamUserVO[]>([]);
  const [curTeamUserVO, setCurTeamUserVO] = useState<API.TeamUserVO>({});
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  // 获取tab列表数据
  const loadData = async () => {
    const result = await listCreatedTeamUsingPost();
    if (result.data) {
      console.log(result.data);
      setCreatedTeamList(result.data);
    } else {
      message.error('获取数据失败，请你重试！');
    }
  };

  const editTeam = async (value: API.TeamUserVO) => {
    console.log('page', value);
    const result = await updateTeamUsingPost({
      ...value,
    });
    if (result.data) {
      message.success('修改信息成功');
    } else {
      message.error('修改信息失败，请您重试！');
    }
  };

  useEffect(() => {
    loadData();
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
    <ProCard>
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
                  <EditOutlined
                    onClick={() => {
                      setModelVisible(true);
                      setCurTeamUserVO(item);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="分享" key="share">
                  <ShareAltOutlined />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar size="small" src={item.createUser?.userAvatar} />}
                title={item.teamName}
              />
              <div>
                <CardInfo hasUser={item.hasNum ?? 1} maxUser={item.maxNum ?? 5} />
              </div>
            </Card>
          </List.Item>
        )}
      />
      <EditTeam
        teamUserVO={curTeamUserVO}
        onFinish={editTeam}
        visible={modelVisible}
        setVisible={setModelVisible}
      />
    </ProCard>
  );
};
export default CreatedTeamList;
