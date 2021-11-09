import vendor from "../models/vendors.js";

//Función que registra proveedores en la base de datos en caso de que no existan en ella
const registerVendor = async (req, res) => {
  //Si el request con los datos no existen envia un error 400
  if (!req.body.name || !req.body.address)
    return res.status(400).send("Imcomplete data");

  //Con findOne busca el primer campo, en este caso seria nombre y ver si existe
  const existingVendor = await vendor.findOne({ name: req.body.name });
  if (existingVendor) return res.status(400).send("The vendor already exist");

  //Creamos el Schema con nombre, address,
  const vendorSchema = new vendor({
    name: req.body.name,
    address: req.body.address,
    });

  //Va a la base de datos y guarda los campos de JSON
  const result = await vendorSchema.save();
  if (!result) return res.status(400).send("Failed to register");

  return res.status(200).send({ result });
};

//Función que lista todos los proveedores
const listVendor = async (req, res) =>{
  const vendorSchema = await vendor.find();
  //Que tenga algun esquema y que tenga items
  if(!vendorSchema || vendorSchema.length==0) return res.status(400).send("Empty vendor list");
  //Se envia vendorSchema con parentesis para que se muestre el JSON en formato texto
  return res.status(200).send({vendorSchema})
}




//Función para editar un proveedor
const updateVendor = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.address
  )
    return res.status(400).send("Incomplete data");

  const existingVendor = await vendor.findOne({
    name: req.body.name,
    address: req.body.address,
  });

  if (existingVendor) return res.status(400).send("The vendor already exist");

  const vendorUpdate = await vendor.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    address: req.body.address,
  });

  return !vendorUpdate
    ? res.status(400).send("Error editing vendor")
    : res.status(200).send({ vendorUpdate });
};

//Función para eliminar un proveedor
const deleteVendor = async (req, res) => {
  const vendorDelete = await vendor.findOneAndDelete({ _id: req.params["_id"] });
  return !vendorDelete
    ? res.status(400).send("Vendor no found")
    : res.status(200).send("Vendor deleted");
};

export default {registerVendor, listVendor, updateVendor, deleteVendor};