const { default: mongoose } = require("mongoose")
const Mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/test1").then(() => {
    console.log("connection successfully....")
}).catch((err) => {
    console.log("connection fail" + err);
})