export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },

  { path: '/match', redirect: '/match/home' },
  { icon: 'table', path: '/match/home', component: './Match/Home', name: '主页' },
  {
    icon: 'table',
    path: '/match/search',
    component: './Match/search',
    name: '搜索',
  },
  {
    icon: 'table',
    path: '/match/team',
    name: '队伍',
    routes: [
      {
        icon: 'table',
        path: '/match/team',
        redirect: '/match/team/show',
      },
      {
        icon: 'table',
        path: '/match/team/show',
        component: './Match/Team',
        name: '展示队伍',
      },
      {
        icon: 'table',
        path: '/match/team/add',
        component: './Match/Team/AddTeam',
        name: '添加队伍',
      },
    ],
  },
  {
    icon: 'table',
    path: '/match/person',
    name: '个人',
    routes: [
      { path: '/match/person/home', icon: 'smile', component: './Match/Person', name: '个人主页' },
      {
        path: '/match/person/settings',
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
