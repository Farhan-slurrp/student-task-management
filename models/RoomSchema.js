const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  members: { type: Array, required: false },
});

const Room = mongoose.model("Room", roomSchema, "Room");
module.exports = Room;
