const mongoose = require("mongoose");

const noteSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
});

const NoteSection = mongoose.model(
  "NoteSection",
  noteSectionSchema,
  "NoteSection"
);
module.exports = NoteSection;
