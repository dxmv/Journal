// Libraries
require("dotenv").config();
import errorHandler from "./utils/errorHandler";
import userExtractor from "./utils/userExtractor";
const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");
const app=express();
const bodyParser=require("body-parser");

const DeleteToken=require("./models/DeleteToken");
const ResetPassword=require("./models/ResetPassword");

// Routes
const userRoute=require("./routes/userRoute");
const entryRoute=require("./routes/entryRoute");
const loginRoute=require("./routes/loginRoute");
const tagRoute=require("./routes/tagRoute");

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Configuring CORS
app.use(cors({
  origin:"*"
}));

// Parsing the request
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(userExtractor);

// Setting up routes
app.use("/api/users/",userRoute);
app.use("/api/entries/",entryRoute);
app.use("/api/login/",loginRoute);
app.use("/api/tags/",tagRoute);
app.use(errorHandler);

// Listening on port
app.listen(process.env.PORT,()=>{
  console.log(`Listening on Port: ${process.env.PORT}`);
});