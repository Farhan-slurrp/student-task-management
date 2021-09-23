const mongoose = require("mongoose");

const roomNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  createdBy: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
  updatedAt: { type: Date, required: false },
  updatedBy: { type: String, required: false },
});

const RoomNote = mongoose.model("RoomNote", roomNoteSchema, "RoomNote");
module.exports = RoomNote;
