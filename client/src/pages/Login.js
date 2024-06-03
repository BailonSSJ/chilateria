import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const res = await axios.post("/api/users/login", values);
      dispatch({ type: "HIDE_LOADING" });
      message.success("Inicio de sesión exitoso!");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Credenciales incorrectas");
      console.error(error);
    }
  };

  //Usuario actualmente logeado
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register">
      <div className="register-form">
        <h1>Chilate Nomhar</h1>
        <h3>Iniciar Sesión</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="userId" label="ID de Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <p>
              No es usuario
              <Link to="/register"> Regístrate aquí!</Link>
            </p>
            <Button type="primary" htmlType="submit">
              Iniciar Sesión
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
