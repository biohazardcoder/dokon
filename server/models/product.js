import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  size: { type: String, required: true },
  admins:[
    {
      admin:{type:mongoose.Schema.Types.ObjectId, ref:"Admin"},
      stock:{type:Number}
    }
  ]
},{timestamps:true});

ProductSchema.virtual("total").get(function () {
  return this.price * this.stock;
});

ProductSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Product", ProductSchema);
