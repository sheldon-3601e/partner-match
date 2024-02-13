import React, { useLayoutEffect, useRef, useState } from 'react'; // 引入 React 相关的库
import { GridContent } from '@ant-design/pro-components'; // 引入 GridContent 组件
import { Menu } from 'antd'; // 引入 Menu 组件
import BaseView from './components/base'; // 引入名为 BaseView 的组件
import BindingView from './components/binding'; // 引入名为 BindingView 的组件
import NotificationView from './components/notification'; // 引入名为 NotificationView 的组件
import SecurityView from './components/security'; // 引入名为 SecurityView 的组件
import useStyles from './style.style'; // 引入样式

// 定义 SettingsStateKeys 类型，用于限制 selectKey 的可能取值
type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';

// 定义 SettingsState 类型，表示组件的状态
type SettingsState = {
  mode: 'inline' | 'horizontal'; // mode 属性只能取 'inline' 或 'horizontal'
  selectKey: SettingsStateKeys; // selectKey 属性只能取 SettingsStateKeys 类型的值
};

// 定义 Settings 组件
const Settings: React.FC = () => {
  const { styles } = useStyles(); // 使用 useStyles 自定义样式
  const menuMap: Record<string, React.ReactNode> = { // 定义菜单项的名称映射
    base: '基本设置',
    security: '安全设置',
    binding: '账号绑定',
    notification: '新消息通知',
  };

  // 初始化状态
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline', // 初始 mode 为 'inline'
    selectKey: 'base', // 初始 selectKey 为 'base'
  });

  const dom = useRef<HTMLDivElement>(); // 创建一个 ref，用于获取 DOM 元素的引用

  // 处理窗口大小变化事件的回调函数
  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      // 更新状态
      setInitConfig({
        ...initConfig,
        mode: mode as SettingsState['mode'],
      });
    });
  };

  // 在组件挂载或更新后执行的副作用
  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize); // 监听窗口大小变化事件
      resize(); // 调用 resize 处理初始大小
    }
    // 清除副作用
    return () => {
      window.removeEventListener('resize', resize); // 移除事件监听器
    };
  }, [dom.current]); // 依赖于 dom.current 的变化

  // 获取菜单项数据
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => ({ key: item, label: menuMap[item] }));
  };

  // 根据选择的菜单项渲染对应的子组件
  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        return null;
    }
  };

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref; // 将 DOM 元素的引用赋值给 dom.current
          }
        }}
      >
        <div className={styles.leftMenu}>
          {/* 左侧菜单 */}
          <Menu
            mode={initConfig.mode} // 设置菜单的模式
            selectedKeys={[initConfig.selectKey]} // 设置选中的菜单项
            onClick={({ key }) => {
              // 点击菜单项时更新 selectKey
              setInitConfig({
                ...initConfig,
                selectKey: key as SettingsStateKeys,
              });
            }}
            items={getMenu()} // 设置菜单项
          />
        </div>
        <div className={styles.right}>
          {/* 右侧内容区域 */}
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()} {/* 渲染选中菜单项对应的子组件 */}
        </div>
      </div>
    </GridContent>
  );
};

export default Settings; // 导出 Settings 组件
