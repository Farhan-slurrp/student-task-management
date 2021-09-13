const mongoose = require("mongoose");

const personalTaskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: String, required: true },
  progress: { type: Number, required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
  dueDate: { type: Date, required: false },
  priority: { type: String, required: true },
  updatedAt: { type: Date, required: false },
});

const PersonalTask = mongoose.model(
  "PersonalTask",
  personalTaskSchema,
  "PersonalTask"
);
module.exports = PersonalTask;
