const billsModel = require("../models/billsModel");

// Add bills
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();
    res.status(201).send("Factura creada exitosamente");
  } catch (error) {
    res.status(500).send("Algo salió mal");
    console.log(error);
  }
};

//Obtener datos de facturas
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { 
  addBillsController,
  getBillsController
};
