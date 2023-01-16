// const mongoose =require ('mongoose')

// const connectDB = async ()=>{
//     const conn= await mongoose.connect(process.env.MONGO_URL)
//     console.log(`MONGODB CONNECT : ${conn.connection.host}`)

// }

// module.exports = connectDB

/**
 * Database connection
 * @author Joshua Lazar
 */
const mongoose = require("mongoose");
const db_url = process.env.MONGO_URL;

// Setting
mongoose.set("debug", true);

// Connection
mongoose
  .connect("mongodb+srv://devcamper:devcamper@cluster0.sfhtqyb.mongodb.net/test", {
    // Some common settings (You don't need to understand these)
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    ignoreUndefined: true,
  })
  .then(() => console.log("We are connected with database :)")) //Success
  .catch((err) => {
    console.log("DB Connection Error :( -------> ", err); //Failed
  });