//MongoDB connection logic

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://127.0.0.1:27017/TaskManager", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log("Error", e);
  });

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.set("useFindAndModify", false);

module.exports = {
  mongoose,
};
