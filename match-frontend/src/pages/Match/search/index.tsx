import { TAG_IS_PARENT } from '@/constants/TagConstants';
import { ListItemDataType } from '@/pages/Match/search/articles/data';
import { queryFakeList } from '@/pages/Match/search/articles/service';
import useStyles from '@/pages/Match/search/articles/style.style';
import { listTagVoUsingPost } from '@/services/backend/tagController';
import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useMatch, useRequest } from '@umijs/max';
import { Button, Card, Col, Form, Input, List, Row, Select, Tag } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';

const FormItem = Form.Item;

const pageSize = 5;

type SearchProps = {
  children?: React.ReactNode;
};

const Search: FC<SearchProps> = () => {
  const location = useLocation();
  useMatch(location.pathname);
  const handleFormSubmit = (value: string) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  const [form] = Form.useForm();

  const { styles } = useStyles();

  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    () => {
      return queryFakeList({
        count: pageSize,
      });
    },
    {
      loadMore: true,
    },
  );

  const list = data?.list || [];

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

  const IconText: React.FC<{
    type: string;
    text: React.ReactNode;
  }> = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'like-o':
        return (
          <span>
            <LikeOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'message':
        return (
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      default:
        return null;
    }
  };

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const loadMoreDom = list.length > 0 && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loadingMore ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

  const ownerOptions = useMemo<DefaultOptionType[]>(
    () =>
      owners.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [owners],
  );

  const [tagNum, setTagNum] = useState<API.TagQueryRequest>({
    number: 5,
  });
  // 标签列表
  const [tagList, setTagList] = useState<API.TagVO[]>([]);
  // 标签的父标签列表
  const [tagParentList, setTagParentList] = useState<API.TagVO[]>([]);
  // 当前用户选择的父标签
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>([]);
  // 父标签所对应的子标签
  const [tagCurrentList, setTagCurrentList] = useState<API.TagVO[]>([]);

  const loadTagList = async () => {
    const res = await listTagVoUsingPost();
    if (res.data) {
      setTagList(res.data);
      const parentList = res.data.filter((tag) => tag.isParent === TAG_IS_PARENT);
      // console.log(parentList)
      setTagParentList(parentList);
    }
  };

  // 加载所有标签
  useEffect(() => {
    loadTagList();
  }, []);

  // 监听用户选择的父标签，筛选中对应的子标签
  useEffect(() => {
    // console.log(selectedTags);
    const tagCurrent = tagList.filter((tag) => selectedTags.includes(String(tag.parentId)));
    // console.log(tagCurrent);
    setTagCurrentList(tagCurrent)
  }, [selectedTags]);

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
            onValuesChange={reload}
          >
            <StandardFormRow title="标签类别" block style={{ paddingBottom: 11 }}>
              <FormItem name="category">
                <TagSelect expandable onChange={(value) => setSelectedTags(value)}>
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
                <TagSelect
                  expandable
                  onChange={(selectedValues) => setSelectedTags(selectedValues)}
                >
                  {tagCurrentList.map((tag) => (
                    <TagSelect.Option value={tag.id!} key={tag.id}>
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
          <List<ListItemDataType>
            size="large"
            loading={loading}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMoreDom}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText key="star" type="star-o" text={item.star} />,
                  <IconText key="like" type="like-o" text={item.like} />,
                  <IconText key="message" type="message" text={item.message} />,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.title}
                    </a>
                  }
                  description={
                    <span>
                      <Tag>Ant Design</Tag>
                      <Tag>设计语言</Tag>
                      <Tag>蚂蚁金服</Tag>
                    </span>
                  }
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </>
    </PageContainer>
  );
};

export default Search;
