import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from 'antd';

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  //Uso de useEffect para cargar los items
  useEffect(() => {
    getAllItems();
    //eslint-disable-next-line
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete("/api/items/delete-item", {
        data: { itemId: record._id }
      });
      message.success("Eliminado correctamente!");
      getAllItems();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Algo salió mal!");
      console.error(error);
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
      title: 'Acciones', dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EditOutlined 
            style={{ cursor: 'pointer' }} 
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined 
            style={{ cursor: 'pointer' }} 
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (value) => {
    if (editItem !== null) {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Editado correctamente!");
        getAllItems();
        setPopupModal(false);
        setEditItem(null);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Algo salió mal!");
        console.error(error);
      }
    } else {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.post("/api/items/add-item", value);
        message.success("Añadido correctamente!");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Algo salió mal!");
        console.error(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Productos</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Añadir
        </Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered rowKey="_id" />
      {
        popupModal && (
          <Modal 
            title={editItem !== null ? "Editar" : "Añadir"} 
            visible={popupModal} 
            onCancel={() => {
              setEditItem(null);
              setPopupModal(false);
            }} 
            footer={false}
          >
            <Form layout="vertical" initialValues={editItem} onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: 'Porfavor introduce el Nombre' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="price"
                label="Precio"
                rules={[{ required: true, message: 'Porfavor introduce el Precio' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="image"
                label="Imagen URI"
                rules={[{ required: true, message: 'Porfavor introduce el la imagen URI' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Categoría"
                rules={[{ required: true, message: 'Porfavor selecciona la categoría' }]}
              >
                <Select>
                  <Select.Option value="Bebidas">Bebidas</Select.Option>
                  <Select.Option value="Preparación">Preparación</Select.Option>
                </Select>
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </div>
            </Form>
          </Modal>
        )
      }
    </DefaultLayout>
  );
};

export default ItemPage;
