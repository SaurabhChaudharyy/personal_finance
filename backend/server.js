const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
dotenv.config();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Personal Finance API"
  })
})


app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);



app.listen(PORT, console.log(`Listening to ${PORT} PORT`));
