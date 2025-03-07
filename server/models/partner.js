import mongoose from "mongoose";

const PartnersSchema = new mongoose.Schema(
    {
        admin:{type :mongoose.Schema.Types.ObjectId, ref: "Admin", required:true},
        shopName: { type: String, required: true },
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        photos: [{ type: String }],
        status: { type: String, default: "Status" },
        color: { type: String, default: "red" },
        products: [
            {
                product: {type:String}, 
                price:{type :Number},
                quantity:{type :Number},
                paid:{type :Number},
                size:{type :String},
                date: { type: Date, default: Date.now() },
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Partner", PartnersSchema);
