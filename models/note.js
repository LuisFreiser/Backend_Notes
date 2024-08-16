const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI; //!Iniciando la variable de entorno.

console.log("connecting to", url);
//!Conectamos con la base de datos.
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
//!Definiendo el esquema de la base de datos.
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true, //!Definiendo que el campo 'content' es obligatorio.
  },
  important: Boolean,
});

//!Transformamos el esquema de datos de la base de datos a JSON con el método toJSON.
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); //!Transformamos el ID de la base de datos a String.
    delete returnedObject._id; //!Ocultamos el ID de la base de datos.
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema); //!Exportamos el modelo de datos.
