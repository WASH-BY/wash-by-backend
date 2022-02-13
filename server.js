require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const connDB = require("./config/db");
const ErrorHandler = require("./middleware/ErrorHandler");
const path = require("path");
connDB();
const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());
// app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use('/static');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//Routes
app.use("/api/bootcamp", require("./routes/BootcampRoute"));
app.use("/user", require("./routes/UserRouter"));
app.use("/recipes", require("./routes/RecipeRouter"));
app.use("/car", require("./routes/CarModelRouter"));
app.use("/subscription", require("./routes/CarSubscriptionRouter"));
app.use("/wash", require("./routes/CarWashRouter"));
app.use(
  "/washersTodaysWashes",
  require("./routes/CarWashersTodaysWashesRouter")
);
app.use(ErrorHandler);

app.listen(PORT, () => console.log(`Server Running on Port Number ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  app.close(() => process.exit(1));
});
