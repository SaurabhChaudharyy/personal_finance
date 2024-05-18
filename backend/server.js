const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { connectionCheck } = require("./config/db");
const cors = require("cors");
dotenv.config();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT;

connectionCheck();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Personal Finance API",
  });
});

app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Listening to ${PORT} PORT`));
