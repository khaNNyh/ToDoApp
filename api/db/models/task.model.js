const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  note: {
    type: String,
    required: false,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Task = new mongoose.model("Task", TaskSchema);

module.exports = { Task };
