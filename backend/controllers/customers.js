import customer from "../models/customers.js";

//Función que registra clientes en la base de datos en caso de que no existan en ella
const registerCustomer = async (req, res) => {
  //Si el request con los datos no existen envia un error 400
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Imcomplete data");

  //Con findOne busca el primer campo, en este caso seria nombre y ver si existe
  const existingCustomer = await customer.findOne({ name: req.body.name });
  if (existingCustomer) return res.status(400).send("The customer already exist");

  //Creamos el Schema con nombre, email y password,
  const customerSchema = new customer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dbStatus: true,
    });

  //Va a la base de datos y guarda los campos de JSON
  const result = await customerSchema.save();
  if (!result) return res.status(400).send("Failed to register");

  return res.status(200).send({ result });
};

//Función que lista todos los libros
const listCustomer = async (req, res) =>{
  const customerSchema = await customer.find();
  //Que tenga algun esquema y que tenga items
  if(!customerSchema || customerSchema.length==0) return res.status(400).send("Empty customer list");
  //Se envia customerSchema con parentesis para que se muestre el JSON en formato texto
  return res.status(200).send({customerSchema})
}

//Función para editar un cliente
const updateCustomer = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password
  )
    return res.status(400).send("Incomplete data");

  const existingCustomer = await customer.findOne({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  if (existingCustomer) return res.status(400).send("The customer already exist");

  const customerUpdate = await customer.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  return !customerUpdate
    ? res.status(400).send("Error editing customer")
    : res.status(200).send({ customerUpdate });
};

//Función para eliminar un cliente
const deleteCustomer = async (req, res) => {
  const customerDelete = await customer.findOneAndDelete({ _id: req.params["_id"] });
  return !customerDelete
    ? res.status(400).send("Customer no found")
    : res.status(200).send("Customer deleted");
};



export default {registerCustomer, listCustomer, updateCustomer, deleteCustomer};