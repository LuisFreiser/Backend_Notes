require("dotenv").config(); //!Cargamos las variables de entorno .env.
//!Ultilizamos Express para crear el servidor.
const express = require("express");
const Note = require("./models/note"); //!Importamos el modelo de datos de la base de datos.
const cors = require("cors");
const app = express();

app.use(express.json()); //!El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body de la solicitud.
app.use(cors());
app.use(express.static("dist"));

//!Ruta para obtener todas las notas de la base de datos.
// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// //!Generamos un ID para la nueva nota.
// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

//!Ruta para crear una nueva nota en la base de datos.
app.post("/api/notes", (request, response) => {
  const body = request.body; //!Obtenemos el body con los datos del objeto JSON de la solicitud.
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }
  //!Creamos una nueva nota y le pasamos los datos del objeto body.
  const newNote = new Note({
    content: body.content,
    important: typeof body.important !== "undefined" ? body.important : false, //!Definiendo por defecto el valor de 'important' como 'false'.
  });
  newNote
    .save() //!Guardamos la nueva nota en la base de datos.
    .then((savedNote) => {
      response.json(savedNote); //!Retornamos la nueva nota si se realizo correctamente.
    });
});

//!Ruta para buscar una nota.
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

//!Ruta para eliminar una nota.
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end(); //!204 = La solicitud HTTP ha sido completada.
});

//!Iniciamos el servidor.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
