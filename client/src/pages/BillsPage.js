import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { Modal, Button, Table, Select } from 'antd';
import { useReactToPrint } from 'react-to-print';

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBills();
    // eslint-disable-next-line
  }, []);

   // Imprimir factura
   const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre del Cliente', dataIndex: 'customerName' },
    { title: 'N. Contacto', dataIndex: 'customerNumber' },
    { title: 'Total', dataIndex: 'totalAmount' },
    {
      title: 'Acciones', dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EyeOutlined style={{ cursor: 'pointer' }} 
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];
  console.log(selectedBill);
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Lista de Pedidos</h1>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />
      {popupModal && selectedBill && (
        <Modal 
          title="Detalles de Factura"
          open={popupModal} 
          onCancel={() => setPopupModal(false)} 
          footer={false}
        >
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="logo" />
              <div className="info">
                <h2>Factura</h2>
                <p> Teléfono : 744 310 3997 | Chilate Nomhar</p>
              </div>
            </center>
            <div id="mid">
              <div className="mt-2">
                <p>
                  Usuario : <b>{selectedBill.customerName}</b>
                  <br />
                  Número de Contacto : <b>{selectedBill.customerNumber}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }}/>
              </div>
              <div id="bot">
                <div id="table">
                  <table>
                    <tbody>
                      <tr className="tabletitle">
                        <td className="item">Artículo</td>
                        <td className="Hours">Cantidad</td>
                        <td className="Rate">Precio</td>
                        <td className="subtotal">Total</td>
                      </tr>
                      {selectedBill.cartItems.map((item) => (
                        <tr className="service" key={item._id}>
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity * item.price}</p>
                          </td>
                        </tr>
                      ))}
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate">
                          <h2>Total</h2>
                        </td>
                        <td className="payment">
                          <h2>
                            <b>${selectedBill.totalAmount}</b>
                          </h2>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Gracias</strong>  por tu compra; tu preferencia nos ayuda a mejorar. Somos chilate NOMHAR, sabor y calidad nos distingue. <b>WhatsApp 7443103997</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button type="primary" onClick={handlePrint}>Imprimir</Button>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
