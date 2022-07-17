require("dotenv");
const mongoose = require("mongoose");
const CONNECTIONSTRING = process.env.DATABASE_URL;

const connDB = async () => {
  try {
    await mongoose.connect(CONNECTIONSTRING, {
      useCreateIndex: true,
      useNewUrlParser: true, //useNewUrlParser: true, you must specify a port in your connection string
      useUnifiedTopology: true, //Set to true to opt in to using the MongoDB driver's new connection management engine
      useFindAndModify: false,
    });
    console.log("MongoDB connection Successful 🌟 ");
  } catch (error) {
    console.log("MongoDB connection Failed  🙆 ");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connDB;
