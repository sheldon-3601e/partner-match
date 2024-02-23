import MargBottom16 from '@/components/margBottom16';
import { TeamStatusEnum } from '@/constants/TeamStatus';
import {
  joinTeamUsingPost,
  listTeamUserVoByPageUsingPost,
} from '@/services/backend/teamController';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Avatar, Button, Input, message, Modal, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import CreateModal from './components/CreateModal';

/**
 * 伙伴匹配 组队页
 *
 * @constructor
 */
const MatchTeam: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [teamId, setTeamId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passWord, setPassWord] = useState('');

  /**
   * 加入队伍
   * @param teamId
   */
  const joinTeam = async (teamId: string) => {
    const result = await joinTeamUsingPost({
      teamId: teamId,
      password: passWord,
    });
    if (result.data) {
      message.success('加入队伍成功');
    }
  };

  const showModal = (teamId: string) => {
    setIsModalOpen(true);
    setTeamId(teamId);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    joinTeam(teamId);
  };

  const handleCancel = () => {
    setPassWord('');
    setIsModalOpen(false);
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.TeamUserVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
      valueType: 'text',
    },
    {
      title: '队伍描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      valueType: 'text',
      render: (_, record) => (
        <div>
          <Avatar
            src={record.createUser?.userAvatar}
            size={'small'}
            style={{ marginRight: '8px' }}
          />
          {record.createUser?.userName}
        </div>
      ),
    },
    {
      title: '队伍属性',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '公开',
        },
        2: {
          text: '加密',
        },
      },
    },
    {
      title: '过期时间',
      sorter: true,
      dataIndex: 'expireTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          {record.status === TeamStatusEnum.PUBLIC ? (
            <Popconfirm
              placement="left"
              title={'确认'}
              description={'你确定加入该队伍？'}
              okText="Yes"
              cancelText="No"
              onConfirm={() => joinTeam(record.id ?? '')}
            >
              <Button type="primary">加入</Button>
            </Popconfirm>
          ) : (
            <Button type="primary" onClick={() => showModal(record.id ?? '')}>
              申请
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.TeamUserVO>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listTeamUserVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />

      <Modal title="输入队伍密码" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <MargBottom16 />
        <Input
          placeholder="请输入密码"
          allowClear
          onChange={(e) => {
            setPassWord(e.target.value);
          }}
        />
      </Modal>

      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default MatchTeam;
