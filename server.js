require("dotenv").config();
const express = require("express");
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
const morgan = require("morgan"); //HTTP request logger middleware for node.js
let cookieParser = require("cookie-parser");
const connDB = require("./config/db");
const ErrorHandler = require("./middleware/ErrorHandler");
const path = require("path");
connDB();
const app = express(); //initialise the express app
const PORT = process.env.PORT;

// Informational responses (100–199)
// Successful responses (200–299)
// Redirection messages (300–399)
// Client error responses (400–499)
// Server error responses (500–599)

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());
// app.use(express.static("public"));
app.use(express.json({ limit: "50mb" })); // recognize the incoming Request Object as a JSON Object
app.use(express.urlencoded({ limit: "50mb", extended: true })); //recognize the incoming Request Object as strings or arrays
// express.urlencoded() is required when you are
// submitting a form with post method ( default content-type = application/ x-www-form-urlencoded )
//  and you need to acess that form data using req.body , if you don't use it req.body would be undefined.
// app.use('/static');
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/school", require("./routes/SchoolRoutes/SchoolRoute"));
app.use("/school/staff", require("./routes/SchoolRoutes/StaffRoute"));

app.use(ErrorHandler);

app.listen(PORT, () => console.log(`Server Running on Port Number ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  app.close(() => process.exit(1));
});
