import {addTeamUsingPost} from '@/services/backend/teamController';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import '@umijs/max';
import {message} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import MargBotton16 from '@/components/margBotton16';
import { useNavigate } from "react-router-dom";

const CreateModal: React.FC = () => {

  const navigate = useNavigate()

  /**
   * 添加节点
   * @param value
   */
  const handleAdd = async (value: API.TeamAddRequest) => {
    const hide = message.loading('正在添加');
    console.log(value);
    try {
      const result = await addTeamUsingPost(value);
      hide();
      if (result.data) {
        message.success('创建成功');
        // 跳转页面
        navigate('/match/team')
      }
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
    }
  };

  return (
    <PageContainer title={'创建队伍'}>
      <ProCard>
        <ProForm<API.TeamAddRequest>
          style={{padding: '10px'}}
          layout={'horizontal'}
          onFinish={async (values) => handleAdd(values)}
          autoFocusFirstInput
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="teamName"
              label="队伍名称"
              placeholder="请输入队伍名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm.Group>
          <MargBotton16 />
          <ProFormTextArea
            name="description"
            label="队伍描述"
            allowClear
            width={'lg'}
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <MargBotton16 />
          <ProForm.Group>
            <ProFormDigit
              label="最大人数"
              name="maxNum"
              max={10}
              min={3}
              initialValue={5}
              width={'md'}
            />
          </ProForm.Group>
          <ProFormDatePicker
            label={'过期时间'}
            name="expireTime"
            width={'md'}
            transform={(value) => {
              return {
                expireTime: dayjs(value).toDate(),
              };
            }}
            rules={[
                {
                  validator: (_, value) =>{
                    console.log(value)
                    return value > dayjs(new Date()).add(1) ? Promise.resolve() : Promise.reject(new Error('过期时间应当大于当前时间'))
                  }
                    // value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
          />
          <MargBotton16 />
          <ProForm.Group>
            <ProFormSelect
              name="status"
              label="队伍类别"
              valueEnum={{
                0: '公开',
                1: '私有',
                2: '加密',
              }}
              initialValue={0}
              placeholder="请选择队伍类别"
              rules={[{ required: true, message: '请选择队伍类别!' }]}
            />
            {/*TODO 当队伍为公开时，不需要填写密码*/}
            <ProFormText.Password label="队伍密码" name="password" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
export default CreateModal;
