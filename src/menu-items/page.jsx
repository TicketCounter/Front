// assets
import { LoginOutlined, ProfileOutlined, ProductOutlined, TeamOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  ProductOutlined,
  TeamOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'register',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    }
  ]
};

const pages2 = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'events',
      title: 'Events',
      type: 'item',
      url: '/events',
      icon: icons.ProductOutlined,
      target: true
    },
    {
      id: 'participants',
      title: 'Participants',
      type: 'item',
      url: '/participants',
      icon: icons.TeamOutlined,
      target: true
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.LoginOutlined,
      target: true
    }
  ]
}

const user = localStorage.getItem('token');
const menuItems = user ? pages2 : pages;

export default menuItems;

