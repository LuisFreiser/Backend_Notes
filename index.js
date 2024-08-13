//!Ultilizamos Express para crear el servidor.
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json()); //!El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body de la solicitud.
app.use(cors());
app.use(express.static("dist"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
//!Ruta para obtener todas las notas.
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

//!Generamos un ID para la nueva nota.
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

//!Ruta para crear una nueva nota.
app.post("/api/notes", (request, response) => {
  const note = request.body;
  if (!note.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const newNote = {
    id: generateId(),
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false, //!Definiendo por defecto el valor de 'important' como 'false'.
  };
  notes = notes.concat(newNote);

  response.json(note);
});

//!Ruta para buscar una nota.
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

//!Ruta para eliminar una nota.
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end(); //!204 = La solicitud HTTP ha sido completada.
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
