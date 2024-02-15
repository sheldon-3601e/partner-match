import {useModel} from '@@/plugin-model';
import {UploadOutlined} from '@ant-design/icons'; // 引入上传图标
import {ProForm, ProFormFieldSet, ProFormSelect, ProFormText, ProFormTextArea,} from '@ant-design/pro-components'; // 引入 ProForm 相关组件
import {Button, Input, message, Upload} from 'antd'; // 引入 antd 组件
import React, {useState} from 'react'; // 引入 React 库
import useStyles from './index.style';
import {updateMyUserUsingPost} from "@/services/backend/userController";

// 自定义电话号码验证器
const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 将标签列表转为枚举类
// 定义 BaseView 组件

const handleTagList = (tagList: API.TagVO[]) => {
  const result = tagList
    .filter((item) => item.isParent !== 1) // 过滤掉 isParent 为 1 的对象
    .reduce((acc, item) => {
      // @ts-ignore
      acc[item.tagName.toLowerCase()] = item.tagName;
      return acc;
    }, {});
  console.log(result);
  return result;
};

const BaseView: React.FC = () => {
  const { styles } = useStyles(); // 使用 useStyles 自定义样式
  const { initialState } = useModel('@@initialState');
  console.log(initialState);

  const [currentUser] = useState(initialState?.currentUser);
  const [tagList] = useState(handleTagList(initialState?.tagList ?? []));


  // TODO 上传头像
  // AvatarView 组件，用于显示头像
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );

  // 获取用户头像 URL
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.userAvatar) {
        return currentUser.userAvatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  // 处理表单提交事件
  const handleFinish = async (value: API.UserUpdateMyRequest) => {
    console.log(value)
    const res = await updateMyUserUsingPost(value)
    if (res.data) {
      message.success('更新基本信息成功');
    } else {
      message.error('更新失败，请您重试');
    }
  };

  return (
    <div className={styles.baseView}>
      <>
        <div className={styles.left}>
          {/* 表单 */}
          <ProForm
            layout="vertical"
            onFinish={(value) => handleFinish(value)}
            submitter={{
              searchConfig: {
                submitText: '更新基本信息',
              },
            }}
            initialValues={{
              ...currentUser,
              phone: currentUser?.userPhone?.split('-'),
            }}
            hideRequiredMark
          >
            {/* 输入昵称 */}
            <ProFormText
              width="md"
              name="userName"
              label="昵称"
              rules={[
                {
                  required: true,
                  message: '请输入您的昵称!',
                },
              ]}
            />
            {/* 选择性别 */}
            <ProFormSelect
              width="sm"
              name="userGender"
              label="性别"
              rules={[
                {
                  required: true,
                  message: '请选择性别',
                },
              ]}
              options={[
                {
                  label: '男',
                  value: '1',
                },
                {
                  label: '女',
                  value: '0',
                },
              ]}
            />
            {/*TODO 标签展示列表应该与用户已经选择的标签互斥*/}
            <ProFormSelect
              name="tags"
              label="标签"
              valueEnum={tagList}
              fieldProps={{
                mode: 'multiple',
              }}
              placeholder="Please select favorite colors"
              rules={[
                {
                  required: true,
                  message: 'Please select your favorite colors!',
                  type: 'array',
                },
              ]}
            />

            {/* 输入个人简介 */}
            <ProFormTextArea
              name="userProfile"
              label="个人简介"
              rules={[
                {
                  required: true,
                  message: '请输入个人简介!',
                },
              ]}
              placeholder="个人简介"
            />
            {/* 输入联系电话 */}
            <ProFormFieldSet
              name="userPhone"
              label="联系电话"
              rules={[
                {
                  required: true,
                  message: '请输入您的联系电话!',
                },
                {
                  validator: validatorPhone,
                },
              ]}
            >
              <Input className={styles.area_code} />
              <Input className={styles.phone_number} />
            </ProFormFieldSet>
            {/* 输入邮箱 */}
            <ProFormText
              width="md"
              name="userEmail"
              label="邮箱"
              rules={[
                {
                  required: true,
                  message: '请输入您的邮箱!',
                },
              ]}
            />
          </ProForm>
        </div>
        <div className={styles.right}>
          {/* 显示头像 */}
          <AvatarView avatar={getAvatarURL()} />
        </div>
      </>
    </div>
  );
};

export default BaseView; // 导出 BaseView 组件