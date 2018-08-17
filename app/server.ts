import express from "express";

const app = express();

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.get("/ping", function(req, res) {
  res.json({ message: "OK" });
});

app.listen(3000);
