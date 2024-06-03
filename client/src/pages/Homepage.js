import React,{useState,useEffect} from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios"
import { Row, Col } from "antd";
import {useDispatch}from "react-redux";
import ItemList from "./../components/ItemList";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState('drinks')
  const categoroies = [
    {
      name:'Bebidas',
      imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chilate.jpg/1200px-Chilate.jpg'
    },
    {
      name:'Preparación',
      imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYJfcCJFZZIaHtx3bqKncFXw0RDQq4ToF4ow&usqp=CAU'
    }
  ]

  const dispatch = useDispatch();
  //useEffect
  useEffect(() =>{
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        dispatch({type: "HIDE_LOADING"});
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  },[dispatch]);
  return (
    <DefaultLayout >
      <div className="d-flex">
      {categoroies.map((category) => (
        <div 
        key={category.name} 
        className={`d-flex category ${
          selecedCategory === category.name && "category-active"
        }`}
        onClick={() => setSelecedCategory(category.name)}
        >
          <h4>{category.name}</h4>
          <img
          src={category.imageUrl}
          alt={category.name}
          height="40"
          width="60"
          />
        </div>                                                
        ))}
    </div>
      <Row>
        {itemsData.filter(i => i.category === selecedCategory).map((item) => (
          <Col xs={24} lg={6} md={12} sm={6}>
          <ItemList key={item.id} item={item}/>
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
