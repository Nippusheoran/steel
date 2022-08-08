const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: { type: String },
  role: {
    type: String,
    default: "Admin",
    required: true,
  },
})
const User = Mongoose.model("user", UserSchema)

 const clientSchema = new Mongoose.Schema({
   name: String,

   station: {
     type: String,
     required: true,
   },
   delivery: {
    type: String,
    required: true,
  },
   rate: {
    type: Number,
    required: true,
  },
   pipes: {
    type: String,
    required: true,
  },
   referral: {
    type: String,
  },
   role: {
    type: String,
    default: "Client",
    required: true,
  },
 })
   const Client = Mongoose.model("Client", clientSchema);

   const orderSchema = new Mongoose.Schema({
      oid : String,
     name: {
      type: String,
      required: true,
    },
     date: {
       type: Object 
     },
     size: [{
      type:String,
      require:true,
     }],
    quantity: [{
      type: Number,
      required: true,
    }],
    stamp: [{
      type: String,
      required: true,
    }],
    length:[{
      type: String,
    }],
    patta: [{
      type: String,
      required: true,
    }],
   })
   const Order = Mongoose.model("Order", orderSchema);

  module.exports ={ User,Client,Order }; 
