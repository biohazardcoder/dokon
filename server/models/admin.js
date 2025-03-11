import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  phoneNumber: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partner" }], 
  products:[{
    productId : {type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    product: {type: String},
    price:{type:String},
    size: {type:String},
    stock: {type:Number},
    date : {type:Date, default: Date.now}
  }],
  history: [{
    date:{type:Date, default:Date.now},
    total:{type:Number},
    paid:{type:Number}
  }],
  creadit:{type:Number, default:0}
});

export default mongoose.model("Admin", AdminSchema); 
