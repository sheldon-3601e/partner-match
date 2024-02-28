<!-- PROJECT LOGO -->

<div align="center">
    <img src="https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202402280916147.svg" alt="Logo" width="100" height="100">
    <h3 align="center">缘聚匹配平台</h3>
    <p align="center">
        基于 SpringBoot + React 的全栈匹配平台，实现标签匹配相似用户、组队管理、缓存预热等功能。
    </p>
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#关于项目">关于项目</a>
      <ul>
        <li><a href="#核心功能">项目架构图</a></li>
        <li><a href="#技术栈">技术栈</a></li>
          <li><a href="#网站截图">网站截图</a></li>
      </ul>
    </li>
    <li><a href="#快速开始">快速开始</a>
      <ul>
        <li><a href="#先决条件">先决条件</a></li>
        <li><a href="#安装">安装</a></li>
      </ul>
      </li>
      <li>
          <a href="TODO">TODO</a>
      </li>
    <li><a href="#联系方式">联系方式</a></li>
  </ol>
</details>



## 关于项目

### 核心功能

1. 用户注册和登录：用户可以通过注册账号并登录使用该网站，并填写个人信息。
2. 标签匹配：系统根据用户标签，个性化的匹配其合适的队友。
3. 组队功能：用户可以搜索和创建队伍，便于寻找到适合自己的队伍。
4. 用户管理：管理员可以对用户进行管理，包括审核用户信息和处理用户投诉等。


### 技术栈

#### 后端

- Spring Boot 框架
- MySQL 数据库
- Mybatis-Plus 及 mybatis X 自动生成
- Redis 分布式登录及缓存 
- Redisson 分布式锁和限流机制
- 相似匹配度算法
- Easy Excel处理工具
- Swagger + Knife4j 接口文档
- Hutool、Apache Common Utils 等工具库

#### 前端

- React 18
- Ant Design Pro 5.x 脚手架
- Umi 4前端框架
- Ant Design 组件库
- OpenAPI 前端代码生成




### 网站截图

![image-20240228093306141](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202402280942015.png)

![image-20240228093332922](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202402280942913.png)

![image-20240228093357603](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202402280942854.png)

![image-20240228093350510](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202402280933592.png)



## 快速开始

这是一个示例，说明如何在本地设置项目的说明。若要启动并运行本地副本，请按照以下简单示例步骤操作。

### 先决条件

- npm@16.20.2
- MySQL@8.1.0
- Redis@3.2.1

### 安装

下面是一个示例，说明如何安装和设置应用。

1. 克隆项目到本地

   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```

2. 安装依赖s

   ```sh
   npm install
   ```

3. 在后端项目中，修改 MySQL 和 Redis 的配置

4. 启动 Redis 服务

5. 启动后端项目

6. 启动前端项目

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## TODO

- 队伍群聊功能

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## 联系方式

Your Name - Sheldon - email@Sheldon_kkk@126.com

Personal homepage: [https://github.com/sheldon-3601e](https://github.com/sheldon-3601e)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

