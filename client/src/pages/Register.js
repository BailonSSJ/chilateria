import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/users/register", values);
      message.success("Registro exitoso!");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Error al registrar al usuario");
      console.error(error);
    }
  };

  return (
    <div className="register">
      <div className="register-form">
        <h1>Chilate Nomhar</h1>
        <h3>Registro</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="ID de Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <p>
              Ya registrado
              <Link to="/login"> Inicia Sesión aquí!</Link>
            </p>
            <Button type="primary" htmlType="submit">
              Registrarse
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
