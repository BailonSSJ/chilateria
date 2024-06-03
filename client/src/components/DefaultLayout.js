import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from './Spinner';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={`logo ${collapsed ? 'collapsed' : ''}`}>
          <h1 className="text-center text-light font-weight-bold mt-4">Nomhar</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Punto de Venta</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Pedidos</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Productos</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Clientes</Link>
          </Menu.Item>
          <Menu.Item key="/logout" 
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/login");
          }}
          >
            Salir
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div className="cart-item d-flex justify-content-space-between flex-row" 
          onClick={() => navigate('/cart')}>
            <p>{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
