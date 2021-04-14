const mongoose=require("mongoose");
const env=require("../env");

mongoose.connect(env.dbserver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  var db = mongoose.connection;
  
  db.on("error", console.error.bind(console, "connection error:"));