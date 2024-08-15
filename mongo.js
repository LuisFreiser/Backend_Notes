const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

// const url = `mongodb+srv://luisfreiser:${password}@clusterfullstackopen.eowyp.mongodb.net/NoteApp?retryWrites=true&w=majority&appName=ClusterFullStackOpen`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "GET and POST are the most methods of HTTP",
  important: true,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});

// Note.find({ important: true }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
