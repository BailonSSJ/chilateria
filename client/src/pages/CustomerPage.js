import React,{useState,useEffect} from 'react'
import DefaultLayout from './../components/DefaultLayout';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {Table} from 'antd';

const CustomerPage = () => {
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();

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
  
  const columns = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre del Cliente', dataIndex: 'customerName' },
    { title: 'N. Contacto', dataIndex: 'customerNumber' },

  ];

  return (
    <DefaultLayout>
        <h1>Clientes</h1>
        <Table columns={columns} dataSource={billsData} bordered pagination = {false}/>
    </DefaultLayout>
  )

}

export default CustomerPage
