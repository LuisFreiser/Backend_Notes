//!Cargamos las variables de entorno .env.
require("dotenv").config();

//!Ultilizamos Express para crear el servidor.
const express = require("express");
const Note = require("./models/note"); //!Importamos el modelo de datos de la base de datos.
const cors = require("cors");
const morgan = require("morgan");
const app = express();

//!Middlewares.
app.use(express.json()); //!El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body de la solicitud.
app.use(cors());
app.use(morgan("tiny")); //!Para ver las peticiones HTTP en la consola con configuración tiny.
app.use(express.static("dist")); //!Para servir el archivo index.html.

//!Ruta para obtener todas las notas de la base de datos.
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

//!Ruta para crear una nueva nota en la base de datos.
app.post("/api/notes", (request, response, next) => {
  const body = request.body; //!Obtenemos el body con los datos del objeto JSON de la solicitud.
  if (body.content === undefined) {
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
    })
    .catch((error) => next(error));
});

//!Ruta para buscar una nota por su ID en la base de datos.
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

//!Ruta para actualizar una nota por su ID de la base de datos.
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

//!Ruta para eliminar una nota por su ID de la base de datos.
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//!Middleware controlador de errores.
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler); //!Para manejar los errores llamado siempre despues de las rutas.

//!Iniciamos el servidor.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
