import book from "../models/book.js";

//Función que registra libros en la base de datos en caso de que no existan en ella
const registerBook = async (req, res) => {
  //Si el request con los datos no existen envia un error 400
  if (
    !req.body.name ||
    !req.body.author ||
    !req.body.yearPublication ||
    !req.body.page ||
    !req.body.gender ||
    !req.body.price
  )
    return res.status(400).send("Imcomplete data");

  //Con findOne busca el primer campo, en este caso seria nombre y ver si existe
  const existingBook = await book.findOne({ name: req.body.name });
  if (existingBook) return res.status(400).send("The book already exist");

  //Creamos el Schema con nombre, autor, fecha de publicación, páginas, género y precio.
  const bookSchema = new book({
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    page: req.body.page,
    gender: req.body.gender,
    price: req.body.price,
  });

  console.log(req);

  //Va a la base de datos y guarda los campos de JSON
  const result = await bookSchema.save();
  if (!result) return res.status(400).send("Failed to register");

  return res.status(200).send({ result });
};

//Función que lista todos los libros
const listBook = async (req, res) => {
  const bookSchema = await book.find();
  //Que tenga algun esquema y que tenga items
  if (!bookSchema || bookSchema.length == 0)
    return res.status(400).send("Empty book list");
  //Se envia bookSchema con parentesis para que se muestre el JSON en formato texto
  return res.status(200).send({ bookSchema });
};

//Función para editar un libro
const updateBook = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.author ||
    !req.body.yearPublication ||
    !req.body.page ||
    !req.body.gender ||
    !req.body.price
  )
    return res.status(400).send("Incomplete data");

  const existingBook = await book.findOne({
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    page: req.body.page,
    gender: req.body.gender,
    price: req.body.price,
  });

  if (existingBook) return res.status(400).send("The book already exist");

  const bookUpdate = await book.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    author: req.body.author,
    yearPublication: req.body.yearPublication,
    page: req.body.page,
    gender: req.body.gender,
    price: req.body.price,
  });

  return !bookUpdate
    ? res.status(400).send("Error editing book")
    : res.status(200).send({ bookUpdate });
};

//Función para eliminar un libro
const deleteBook = async (req, res) => {
  const bookDelete = await book.findOneAndDelete({ _id: req.params["_id"] });
  return !bookDelete
    ? res.status(400).send("Book no found")
    : res.status(200).send("Book deleted");
};

//Función para buscar por ID del libro
const findBook = async (req, res) => {
  const bookId = await book.findById({ _id: req.params["_id"] });
  return !bookId
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ bookId });
};

export default { registerBook, listBook, updateBook, deleteBook, findBook };
