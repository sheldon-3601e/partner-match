export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎' },

  {
    icon: 'bankOutlined',
    path: '/match/home',
    access: 'canLogin',
    component: './Match/Home',
    name: '主页',
  },
  {
    icon: 'searchOutlined',
    path: '/match/search',
    access: 'canLogin',
    component: './Match/search',
    name: '搜索',
  },
  {
    icon: 'barsOutlined',
    path: '/match/team',
    name: '队伍',
    access: 'canLogin',
    routes: [
      {
        path: '/match/team',
        redirect: '/match/team/show',
      },
      {
        path: '/match/team/show',
        component: './Match/Team',
        name: '展示队伍',
      },
      {
        path: '/match/team/add',
        component: './Match/Team/AddTeam',
        name: '添加队伍',
      },
    ],
  },
  {
    icon: 'userOutlined',
    path: '/match/account',
    name: '个人',
    access: 'canLogin',
    routes: [
      {
        path: '/match/account/center',
        icon: 'smile',
        component: './Match/Person',
        name: '个人中心',
      },
      {
        path: '/match/account/settings',
        icon: 'smile',
        component: './Account/Settings',
        name: '个人设置',
      },
    ],
  },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
