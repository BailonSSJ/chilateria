import React, { useState, useEffect } from 'react';
import DefaultLayout from './../components/DefaultLayout';
import { useSelector, useDispatch } from "react-redux";
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Table, Button, Modal, message, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [billPopup, setBillPopup] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems); // Cambiar state.rootReducer por state.cart
    const navigate = useNavigate();

    // Manejar incremento
    const handleIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: { ...record, quantity: record.quantity + 1 },
        });
    };

    // Manejar decremento
    const handleDecrement = (record) => {
        if (record.quantity !== 1) {
            dispatch({
                type: "UPDATE_CART",
                payload: { ...record, quantity: record.quantity - 1 },
            });
        }
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'name' },
        {
            title: 'Imagen', dataIndex: 'image',
            render: (image, record) => <img src={image} alt={record.name} height="60" width="60" />
        },
        { title: 'Precio', dataIndex: 'price' },
        {
            title: 'Cantidad', dataIndex: '_id', render: (id, record) =>
                <div>
                    <PlusCircleOutlined
                        className="mx-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleIncrement(record)}
                    />
                    <b>{record.quantity}</b>
                    <MinusCircleOutlined
                        className="mx-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDecrement(record)}
                    />
                </div>
        },
        {
            title: 'Acciones', dataIndex: '_id',
            render: (id, record) => (
                <DeleteOutlined
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                        dispatch({
                            type: "DELETE_FROM_CART",
                            payload: record,
                        })
                    }
                />
            ),
        }
    ];

    useEffect(() => {
        let temp = 0;
        cartItems.forEach((item) => { temp = temp + item.price * item.quantity; });
        setSubTotal(temp);
    }, [cartItems]);

    // Manejar la creación de la factura
    const handleSubmit = async (value) => {
        try {
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                totalAmount: Number(subTotal),
                userId: JSON.parse(localStorage.getItem("auth"))._id,
            };
            //console.log(newObject);
            await axios.post("/api/bills/add-bills", newObject)
            message.success("Factura generada correctamente!")
            navigate("/bills");
        } catch (error) {
            message.error("Algo salió mal!");
            console.error(error);
        }
    };

    return (
        <DefaultLayout>
            <h1>Carrito</h1>
            <Table columns={columns} dataSource={cartItems} bordered />
            <div className="d-flex flex-column align-items-end">
                <hr />
                <h3>
                    Subtotal: $ <b>{subTotal}</b> /-{" "}
                </h3>
                <Button type="primary" onClick={() => setBillPopup(true)}>
                    Crear Factura
                </Button>
            </div>
            <Modal
                title="Crear Factura"
                visible={billPopup}
                onCancel={() => setBillPopup(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="customerName"
                        label="Nombre del Cliente"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="customerNumber"
                        label="Número de Contacto"
                        rules={[{ required: true, message: 'Please enter the price' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="paymentMode"
                        label="Método de Pago"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select>
                            <Select.Option value="efectivo">Efectivo</Select.Option>
                            <Select.Option value="transferencia">Transferencia</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className="bill-it">
                        <h5 style={{ fontSize: "1.2rem" }}>
                            Total : <b>{subTotal}</b>
                        </h5>

                    </div>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit">
                            Generar Factura
                        </Button>
                    </div>
                </Form>
            </Modal>
        </DefaultLayout>
    );
};

export default CartPage;
