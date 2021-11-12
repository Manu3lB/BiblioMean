import customer from "../models/customers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

//Función que registra clientes en la base de datos en caso de que no existan en ella
const registerCustomer = async (req, res) => {
  //Si el request con los datos no existen envia un error 400
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Imcomplete data");

  //Con findOne busca el primer campo, en este caso seria nombre y ver si existe
  const existingCustomer = await customer.findOne({
    name: req.body.name,
    email: req.body.email,
  });
  if (existingCustomer)
    return res.status(400).send("The customer already registered");

  //Encripción de contraseña desde el registro
  const hash = await bcrypt.hash(req.body.password, 10);

  //Creamos el Schema con nombre, email y password que tendra el hs,
  const customerSchema = new customer({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    dbStatus: true,
  });

  //Va a la base de datos y guarda los campos de JSON
  const result = await customerSchema.save();
  return !result
    ? res.status(400).send({ message: "Failed to register customer" })
    : res.status(200).send({ result });
};

//Función que lista todos los clientes
const listCustomer = async (req, res) => {
  const customerList = await customer.find();
  //Se comprueba que tenga algun esquema y que tenga items
  //Se envia customerSchema con parentesis para que se muestre el JSON en formato texto
  return customerList.length === 0
    ? res.status(400).send({ message: "Empty custumers list " })
    : res.status(200).send({ customerList });
};

//Función para editar un cliente
const updateCustomer = async (req, res) => {
  if (!req.body.name || !req.body.email)
    return res.status(400).send({ message: "Incomplete data" });

  let pass;

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const customerFind = await customer.findOne({ email: req.body.email });
    pass = customerFind.password;
  }

  //Validamos el correo del cliente
  const existingEmail = await customer.findOne({ email: req.body.email });
  if (!existingEmail) {
    return res.status(400).send({ message: "Email cannot be changed" });
  } else {
    if (existingEmail._id != req.body._id)
      return res
        .status(400)
        .send({ message: "The email already belongs to another customer" });
  }

  const existingCustomer = await customer.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
  });

  if (existingCustomer)
    return res.status(400).send({ message: "The customer already exist" });

  const customerUpdate = await customer.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
  });

  return !customerUpdate
    ? res.status(400).send({ message: "Error editing customer" })
    : res.status(200).send({ message: "Customer Updated" });
};

//Función para eliminar un cliente
const deleteCustomer = async (req, res) => {
  const customerDelete = await customer.findOneAndDelete({
    _id: req.params["_id"],
  });
  return !customerDelete
    ? res.status(400).send("Customer no found")
    : res.status(200).send("Customer deleted");
};

const findCustomer = async (req, res) => {
  const customerFind = await customer.findById({ _id: req.params["_id"] });
  return !customerFind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ customerFind });
};

const login = async (req, res) => {
  //Validar si vienen los datos de email y password, si no saldra un mensaje
  if(!req.body.email || req.body.password)
  return res.status(400).send({ message: "Incomplete data"});
  //Validar si el correo existe
  const customerLogin = await customer.findOne({ email: req.body.email });
  if(!customerLogin)
    return res.status(400).send({ message: "Wrong email or password"});

  //Compara la contraseña del body con el hash que genero
  const hash = await bcrypt.compare(req.body.password, customerLogin.password);
  if(!hash)
    //Validar si el password es correcto
    //If customerLogin.password !== req.body.password)
    return res.status(400).send({ message: "Wrong email or password"});

    try {
      return res.status(200).json({
        token: jwt.sign(
          {
            _id: customerLogin._id,
            name: customerLogin.name,
            iat: moment().unix(),
          },
          process.env.SKE_JWT
        ),
      });
    } catch (e) {
     return res.status(400).send({ message: "Login error"}, e);
    }
};

export default {
  registerCustomer,
  listCustomer,
  updateCustomer,
  deleteCustomer,
  findCustomer,
  login
};
