require("dotenv").config();
const express = require("express");
var cookieParser = require("cookie-parser");
const connDB = require("./config/db");
const ErrorHandler = require("./middleware/ErrorHandler");

connDB();
const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/bootcamp", require("./routes/BootcampRoute"));
app.use("/user", require("./routes/UserRouter"));
app.use("/recipes", require("./routes/RecipeRouter"));
app.use("/car", require("./routes/CarModelRouter"));
app.use("/subscription", require("./routes/CarSubscriptionRouter"));
app.use("/wash",require("./routes/CarWashRouter"))
app.use(ErrorHandler);

app.listen(PORT, () => console.log(`Server Running on Port Number ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  app.close(() => process.exit(1));
});
