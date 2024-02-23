import MargBotton16 from '@/components/margBotton16';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDigit, ProFormField,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef } from 'react';

interface EditTeamProps {
  teamUserVO: API.TeamUserVO; // 当前 TeamUserVO 对象
  onFinish: (values: any) => void; // 提交表单成功的回调方法
  visible: boolean; // 控制是否显示表单的布尔值
  setVisible: (value: boolean) => void;
}

const EditTeam: React.FC<EditTeamProps> = ({ teamUserVO, onFinish, visible, setVisible }) => {
  const formRef = useRef<ProFormInstance>();
  console.log('model:',teamUserVO)
  return (
    <ModalForm<API.TeamUserVO>
      title="修改队伍信息"
      formRef={formRef}
      open={visible}
      onOpenChange={setVisible}
      initialValues={teamUserVO}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="extra-reset"
              onClick={() => {
                props.reset();
              }}
            >
              重置
            </Button>,
          ];
        },
      }}
      onFinish={async (values) => {
        console.log(values);
        onFinish(values);
        message.success('提交成功');
        return true;
      }}
    >
      <ProFormField
        name='id'
        hidden/>
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
            validator: (_, value) => {
              console.log(value);
              console.log(dayjs(new Date()).add(1).toDate())
              return value > dayjs(new Date()).add(1)
                ? Promise.resolve()
                : Promise.reject(new Error('过期时间应当大于当前时间'));
            },
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
          placeholder="请选择队伍类别"
          rules={[{ required: true, message: '请选择队伍类别!' }]}
        />
        {/*TODO 当队伍为公开时，不需要填写密码*/}
        <ProFormText.Password label="队伍密码" name="password" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default EditTeam;
