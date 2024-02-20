# 数据库初始化
# @author <a href="https://github.com/sheldon-3601e">sheldon</a>
# @from <a href="https://github.com/sheldon-3601e">sheldon</a>

-- 创建库
create database if not exists my_match;

-- 切换库
use my_match;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    userName     varchar(256)                           null comment '用户昵称',
    userGender   varchar(256)                           null comment '用户性别',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    tags         varchar(1024)                          null comment '标签列表',
    userPhone    varchar(256)                           null comment '电话',
    userEmail    varchar(256)                           null comment '邮箱',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除'
) comment '用户' collate = utf8mb4_unicode_ci;

-- 标签表
create table if not exists tag
(
    id         bigint auto_increment comment 'id'
        primary key,
    tagName    varchar(256)                       not null comment '标签内容',
    userId     bigint                             null comment '标签作者 id',
    parentId   bigint                             null comment '父标签 id',
    isParent   tinyint                            null comment '0 - 不是， 1 - 是 父标签',
    count      int      default 0                 not null comment '标签被使用次数',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    constraint idx_tagName
        unique (tagName)
) comment '标签' collate = utf8mb4_unicode_ci;

-- 队伍表
create table team
(
    id          bigint auto_increment comment 'id'
        primary key,
    teamName        varchar(256)                       not null comment '队伍名称',
    description varchar(1024)                      null comment '描述',
    maxNum      int      default 1                 not null comment '最大人数',
    expireTime  datetime                           null comment '过期时间',
    userId      bigint comment '用户id',
    status      int      default 0                 not null comment '0 - 公开，1 - 私有，2 - 加密',
    password    varchar(512)                       null comment '密码',
    createTime  datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete    tinyint  default 0                 not null comment '是否删除'
)
    comment '队伍';

create table user_team
(
    id         bigint auto_increment comment 'id'
        primary key,
    userId     bigint comment '用户id',
    teamId     bigint comment '队伍id',
    joinTime   datetime                           null comment '加入时间',
    createTime datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete   tinyint  default 0                 not null comment '是否删除'
)
    comment '用户队伍关系';


-- 帖子表
create table if not exists post
(
    id         bigint auto_increment comment 'id' primary key,
    title      varchar(512)                       null comment '标题',
    content    text                               null comment '内容',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    thumbNum   int      default 0                 not null comment '点赞数',
    favourNum  int      default 0                 not null comment '收藏数',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '帖子' collate = utf8mb4_unicode_ci;

-- 帖子点赞表（硬删除）
create table if not exists post_thumb
(
    id         bigint auto_increment comment 'id' primary key,
    postId     bigint                             not null comment '帖子 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    index idx_postId (postId),
    index idx_userId (userId)
) comment '帖子点赞';

-- 帖子收藏表（硬删除）
create table if not exists post_favour
(
    id         bigint auto_increment comment 'id' primary key,
    postId     bigint                             not null comment '帖子 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    index idx_postId (postId),
    index idx_userId (userId)
) comment '帖子收藏';
