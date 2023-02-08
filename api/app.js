const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

const { List, Task } = require("./db/models");

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.get("/lists", (req, res) => {
  // res.send("Hello world");
  // array of all the lists
  List.find({}).then((lists) => {
    res.send(lists);
  });
});

app.post("/lists", (req, res) => {
  //create the list
  let title = req.body.title;

  let newList = new List({
    title,
  });
  newList.save().then((listDoc) => {
    res.send(listDoc);
  });
});

app.patch("/lists/:id", (req, res) => {
  //update list
  List.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then(() => {
    res.sendStatus(200);
  });
});

app.delete("/lists/:id", (req, res) => {
  //delete list
  List.findOneAndRemove({ _id: req.params.id }).then((removedListDoc) => {
    res.send(removedListDoc);
  });
});

app.get("/lists/:listId/tasks", (req, res) => {
  //return all tasks that belong to a specifig list
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.find({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((task) => {
    res.send(task);
  });
});

app.post("/lists/:listId/tasks", (req, res) => {
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc);
  });
});

app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send(req.body);
  });
});

app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((removedTaskDoc) => {
    res.send(removedTaskDoc);
  });
});

app.delete("/lists/:listId/tasks", (req, res) => {
  Task.deleteMany({
    _listId: req.params.listId,
  }).then((removedTaskDoc) => {
    res.send([]);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
