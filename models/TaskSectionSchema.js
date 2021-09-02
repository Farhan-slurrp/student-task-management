const mongoose = require("mongoose");

const taskSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
});

const TaskSection = mongoose.model(
  "TaskSection",
  taskSectionSchema,
  "TaskSection"
);
module.exports = TaskSection;
