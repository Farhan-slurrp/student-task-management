const mongoose = require("mongoose");

const roomTaskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: String, required: true },
  progress: { type: Number, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
  createdBy: { type: String, required: true },
  workingOn: { type: Array, required: false },
  completedBy: { type: String, required: false },
  dueDate: { type: Date, required: false },
  priority: { type: String, required: true },
  updatedAt: { type: Date, required: false },
});

const RoomTask = mongoose.model("RoomTask", roomTaskSchema, "RoomTask");
module.exports = RoomTask;
