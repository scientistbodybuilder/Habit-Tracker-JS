const app = require('./app').app;

app.listen(3000, function (err) {
  if (err) {
    console.log("Error: " + err);
  }
});