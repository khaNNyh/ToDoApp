const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
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
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const List = new mongoose.model("List", ListSchema);

module.exports = { List };
