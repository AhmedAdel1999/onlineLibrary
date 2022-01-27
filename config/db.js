const mongoose = require("mongoose");
const config = require("config");

const connectdb = async () => {
  try {
    await mongoose.connect("mongodb+srv://bookLibrary:bookLibrary123@cluster0.w6g52.mongodb.net/bookLibrary?retryWrites=true&w=majority", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //useCreateIndex:true,
      //useFindAndModify:false
    });
    console.log("db connected ...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

};
module.exports = connectdb;