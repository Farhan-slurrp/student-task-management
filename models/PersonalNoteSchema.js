const mongoose = require("mongoose");

const personalNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const PersonalNote = mongoose.model(
  "PersonalNote",
  personalNoteSchema,
  "PersonalNote"
);
module.exports = PersonalNote;
