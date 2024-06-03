// userController.js
const User = require("../models/userModel");

//Inicio de sesión
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId, password, verified: true});
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("Credenciales incorrectas");
    }
  } catch (error) {
    res.status(500).send("Error en el servidor");
    console.log(error);
  }
};

//Registro de usuario
const registerController = async (req, res) => {
  try {
    const newUser = new User({...req.body, verified: true});
    await newUser.save();
    res.status(201).send("Usuario registrado correctamente");
  } catch (error) {
    res.status(400).send("Error al registrar al usuario");
    console.log(error);
  }
};

module.exports = { loginController, registerController };
