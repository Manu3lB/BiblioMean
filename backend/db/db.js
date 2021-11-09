// Importar libreria mongoose que se encarga de todo lo de mongodb
//const mongose = requere("mongoose");

import mongoose from "mongoose";

//Función de conexión
const dbConnection = async () => {
  try {
    //process.env es para hacer los archivos ocultos en este caso la URL
    //useNewUrlParser hace una conversión para que no aparezca la url en ningún lado o en consola
    //useUnifiedTopology el texto no saque tantos logs o basura, que saque lo necesario
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection with MongoDB: OK");
  } catch (e) {
      console.log("Error connecting to MongoDB: \n" + e);
  }
};

//Exportar por defecto la función dbConnection
export default { dbConnection };
