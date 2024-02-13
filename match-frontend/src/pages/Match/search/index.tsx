import { TAG_IS_PARENT } from '@/constants/TagConstants';
import useStyles from '@/pages/Match/search/articles/style.style';
import { listTagVoUsingPost } from '@/services/backend/tagController';
import { listUserVoByTagAndPageUsingPost } from '@/services/backend/userController';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useMatch } from '@umijs/max';
import { Card, Col, Form, Input, List, Row, Select, Tag } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import ArticleListContent from '@/pages/Match/search/components/ArticleListContent';

const FormItem = Form.Item;

type SearchProps = {
  children?: React.ReactNode;
};

const Search: FC<SearchProps> = () => {
  const location = useLocation();
  useMatch(location.pathname);

  const [form] = Form.useForm();

  const { styles } = useStyles();

  const setOwner = () => {
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  const owners = [
    {
      id: 'wzj',
      name: '我自己',
    },
    {
      id: 'wjh',
      name: '吴家豪',
    },
    {
      id: 'zxx',
      name: '周星星',
    },
    {
      id: 'zly',
      name: '赵丽颖',
    },
    {
      id: 'ym',
      name: '姚明',
    },
  ];
  // 响应式大小
  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const ownerOptions = useMemo<DefaultOptionType[]>(
    () =>
      owners.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [owners],
  );

  // 标签列表
  const [tagList, setTagList] = useState<API.TagVO[]>([]);
  // 标签的父标签列表
  const [tagParentList, setTagParentList] = useState<API.TagVO[]>([]);
  // 父标签所对应的子标签
  const [tagCurrentList, setTagCurrentList] = useState<API.TagVO[]>([]);
  // 当前用户选择的标签
  const [tagParentSelectedList, setTagParentSelectedList] = useState<(string | number)[]>([]);

  // 用户列表
  const [userList, setUserList] = useState<API.UserVO[]>([])

  const loadTagList = async () => {
    const res = await listTagVoUsingPost();
    if (res.data) {
      setTagList(res.data);
      const parentList = res.data.filter((tag) => tag.isParent === TAG_IS_PARENT);
      // console.log(parentList)
      setTagParentList(parentList);
    }
  };

  // 搜索用户
  const handleFormSubmit = async (value: string) => {
    // 过滤掉数字类型的元素，保留字符串类型的元素
    const tagNameList: string[] = tagParentSelectedList
      .map((item) => String(item));
    const res = await listUserVoByTagAndPageUsingPost({
      userInput: value,
      tagNameList,
    });
    if (res.data) {
      setUserList(res.data);
    }
  };

  // 初始数据
  useEffect(() => {
    loadTagList();
    handleFormSubmit("")
  }, []);

  // 监听用户选择的父标签，筛选中对应的子标签
  useEffect(() => {
    // console.log(tagParentSelectedList);
    const tagCurrent = tagList.filter((tag) =>
      tagParentSelectedList.includes(String(tag.parentId)),
    );
    // console.log(tagCurrent);
    setTagCurrentList(tagCurrent);
  }, [tagParentSelectedList]);

  return (
    <PageContainer
      content={
        <div style={{ textAlign: 'center' }}>
          <Input.Search
            placeholder="请输入"
            enterButton="搜索"
            size="large"
            onSearch={handleFormSubmit}
            style={{ maxWidth: 522, width: '100%' }}
          />
        </div>
      }
    >
      <>
        <Card bordered={false}>
          <Form
            layout="inline"
            form={form}
            initialValues={{
              owner: ['wjh', 'zxx'],
            }}
          >
            <StandardFormRow title="标签类别" block style={{ paddingBottom: 11 }}>
              <FormItem name="category">
                <TagSelect expandable onChange={(value) => setTagParentSelectedList(value)}>
                  {tagParentList.map((tag) => (
                    <TagSelect.Option value={tag.id!} key={tag.id}>
                      {tag.tagName}
                    </TagSelect.Option>
                  ))}
                </TagSelect>
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="标签选择" block style={{ paddingBottom: 11 }}>
              <FormItem name="category">
                <TagSelect expandable onChange={(value) => setTagParentSelectedList(value)}>
                  {tagCurrentList.map((tag) => (
                    <TagSelect.Option value={tag.tagName!} key={tag.id}>
                      {tag.tagName}
                    </TagSelect.Option>
                  ))}
                </TagSelect>
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="owner" grid>
              <FormItem name="owner" noStyle>
                <Select
                  mode="multiple"
                  placeholder="选择 owner"
                  style={{ minWidth: '6rem' }}
                  options={ownerOptions}
                />
              </FormItem>
              <a className={styles.selfTrigger} onClick={setOwner}>
                只看自己的
              </a>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="活跃用户" name="user">
                    <Select
                      placeholder="不限"
                      style={{ maxWidth: 200, width: '100%' }}
                      options={[
                        {
                          label: '李三',
                          value: 'lisa',
                        },
                      ]}
                    />
                  </FormItem>
                </Col>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="好评度" name="rate">
                    <Select
                      placeholder="不限"
                      style={{ maxWidth: 200, width: '100%' }}
                      options={[
                        {
                          label: '优秀',
                          value: 'good',
                        },
                      ]}
                    />
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List<API.UserVO>
            size="large"
            rowKey="id"
            itemLayout="vertical"
            dataSource={userList}
            renderItem={(item) => (
              <List.Item key={item.id} extra={<div className={styles.listItemExtra} />}>
                <List.Item.Meta
                  title={
                    <a
                      className={styles.listItemMetaTitle}
                      href={'http://www.github.com/sheldon-3601e'}
                    >
                      {item.userName}
                    </a>
                  }
                  description={
                    <span>
                      {JSON.parse(item.tags!).map((tag: string) => {
                        return <Tag key={tag}>{tag}</Tag>;
                      })}
                    </span>
                  }
                />
                <ArticleListContent userVo={item} />
              </List.Item>
            )}
          />
        </Card>
      </>
    </PageContainer>
  );
};

export default Search;
