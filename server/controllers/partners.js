import Partner from "../models/partner.js";
import Product from "../models/product.js";
import Admin from "../models/admin.js";
import mongoose from 'mongoose';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

export const CreateNewPartner = async (req, res) => {
    try {
        const newPartner = new Partner(req.body);
        await newPartner.save();

        const user = await Admin.findById(req.body.admin);
        if (!user) {
            return res.status(404).json({ message: "Admin topilmadi!" });
        }

        user.partners.push(newPartner._id); 
        await user.save(); 

        return res
            .status(201)
            .json({ message: "Hamkor muvaffaqiyatli yaratildi", partner: newPartner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hamkor yaratishda xatolik", error: error.message });
    }
};



export const GetAllPartners = async (_, res) => {
    try {
        const Partners = (await Partner.find().populate("admin"));
        if (Partners.length === 0) {
            return sendErrorResponse(res, 404, "Hamkor topilmadi");
        }
        return res.status(200).json({ data: Partners });
    } catch (error) {
        return sendErrorResponse(res, 500, "Hamkorlarni olishda xatolik");
    }
};

export const DeletePartner = async (req, res) => {
    const { id } = req.params;

    try {
        const partner = await Partner.findById(id);
        if (!partner) {
            return sendErrorResponse(res, 404, "Hamkor topilmadi");
        }
        const deletedPartner = await Partner.findByIdAndDelete(id);
        if (!deletedPartner) {
            return sendErrorResponse(res, 404, "Hamkor topilmadi");
        }

        return res.status(200).json({ message: "Hamkor muvaffaqiyatli o'chirildi" });
    } catch (error) {
        return sendErrorResponse(res, 500, "Hamkorni oʻchirishda xatolik :", error);
    }
};


export const UpdatePartner = async (req, res) => {
    const PartnerId = req.params.id;
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return sendErrorResponse(res, 400, "Yangilanish uchun maʼlumotlar taqdim etilmaydi.");
        }

        let updatedPartner;
        if (req.body.products) {
            const partner = await Partner.findById(PartnerId);
            if (!partner) {
                return sendErrorResponse(res, 404, "Hamkor topilmadi");
            }

            const updatedProducts = req.body.products;
            updatedProducts.forEach(async (prod) => {
                const product = await Product.findById(prod.productId);
                if (!product) {
                    return sendErrorResponse(res, 400, `${prod.productId} identifikatorli mahsulot mavjud emas.`);
                }

                if (product.stock < prod.quantity) {
                    return sendErrorResponse(res, 400, `${product.title} mahsuloti uchun zaxira yetarli emas`);
                }
                product.stock -= prod.quantity;
                await product.save();

                const existingProduct = partner.products.find(
                    (p) => p.productId.toString() === prod.productId
                );

                if (existingProduct) {
                    existingProduct.purchasedQuantity += prod.quantity;
                } else {
                    partner.products.push({
                        productId: prod.productId,
                        purchasedQuantity: prod.quantity,
                    });
                }
            });

            updatedPartner = await partner.save();
        } else {
            updatedPartner = await Partner.findByIdAndUpdate(PartnerId, req.body, {
                new: true,
            });
        }

        if (!updatedPartner) {
            return sendErrorResponse(res, 409, "Hamkor topilmadi");
        }

        return res.status(200).json({
            message: "Hamkor muvaffaqiyatli yangilandi",
            data: updatedPartner,
        });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, "Hamkorni yangilashda xatolik", error);
    }
};

export const GetOnePartner = async (req, res) => {
    const PartnerId = req.params.id;
    try {
        const onePartner = await Partner.findById(PartnerId)

        if (!onePartner) {
            return sendErrorResponse(res, 404, "Hamkor topilmadi");
        }

        return res.status(200).json({
            data: onePartner
        });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, "Hamkorni topishda xatolik");
    }
};



export const AddProductToPartner = async (req, res) => { 
    const { id: partnerId } = req.params;
    const { product, price, size, _id, admin, quantity } = req.body;
    console.log(_id);
    
    try {
        const partner = await Partner.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ message: "Hamkor topilmadi" });
        }

        const user = await Admin.findById(admin);
        if (!user) {
            return res.status(404).json({ message: "Admin topilmadi" });
        }


        const UserProduct = user.products.find(p => p._id.toString() === new mongoose.Types.ObjectId(_id).toString());
        
        
        if (!UserProduct) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }

        if (UserProduct.stock < quantity) {
            return res.status(400).json({ message: "Yetarli mahsulot yo'q" });
        }

        UserProduct.stock -= quantity;

        partner.products.push({
            product: product,
            price: price,
            quantity: quantity,
            size: size
        });

        await user.save();
        await partner.save();

        return res.status(200).json({ message: "Mahsulotlar hamkorga muvaffaqiyatli qo'shildi", partner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Mahsulot qo'shishda xatolik", error });
    }
};



export const EditProductInPartner = async (req, res) => {
    const { partnerId, productId } = req.params;
    const { newQuantity } = req.body;
    console.log(partnerId, productId, newQuantity);

    try {
        const partner = await Partner.findById(partnerId);
        if (!partner) return sendErrorResponse(res, 404, "Hamkor topilmadi");

        const existingProduct = partner.products.find(product => product.productId.toString() === productId);
        if (!existingProduct) {
            return sendErrorResponse(res, 404, "Hamkor mahsulotlarida ushbu mahsulot topilmadi.");
        }

        const product = await Product.findById(productId);
        if (!product) return sendErrorResponse(res, 404, "Mahsulot topilmadi");

        const quantityDifference = newQuantity - existingProduct.purchasedQuantity;

        if (quantityDifference > 0 && product.stock < quantityDifference) {
            return sendErrorResponse(res, 400, "Mahsulot omborida yetarlicha zaxira mavjud emas.");
        }

        existingProduct.purchasedQuantity = newQuantity;
        product.stock -= quantityDifference;

        await product.save();
        await partner.save();

        return res.status(200).json({ message: "Mahsulot miqdori muvaffaqiyatli yangilandi." });

    } catch (error) {
        return sendErrorResponse(res, 500, "Tahrirlashda xatolik");
    }
};


export const DeleteProductFromPartner = async (req, res) => { 
    const { partnerId  } = req.params;
    const { admin, productId} = req.body; 

    try {
        const partner = await Partner.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ message: "Hamkor topilmadi" });
        }

        const user = await Admin.findById(admin);
        if (!user) {
            return res.status(404).json({ message: "Admin topilmadi" });
        }

        const productIndex = partner.products.findIndex(p => p._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }

        const removedProduct = partner.products[productIndex];

        partner.products.splice(productIndex, 1);

        const adminProduct = user.products.find(p => p.product.toString() === removedProduct.product.toString());
        
        if (adminProduct) {
            adminProduct.stock += removedProduct.quantity; 
        } else {
            return res.status(404).json({ message: "Admin mahsuloti topilmadi" });
        }
        
        await partner.save();
        await user.save();

        return res.status(200).json({ 
            message: "Mahsulot hamkordan o‘chirildi va admin zaxirasiga qaytarildi", 
            removedProduct 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Mahsulot o‘chirishda xatolik", error });
    }
};


export const CreatedAtChanger = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await Partner.findByIdAndUpdate(
            id,
            { createdAt: new Date() },
            { new: true }
        );

        if (!partner) {
            return res.status(404).json({ message: "Partner topilmadi" });
        }

        return res.status(200).json({ message: "Kunni muvaffaqiyatli o'zgartirildi", partner });
    } catch (error) {
        return res.status(500).json({ message: "Kunni o'zgartirishda hatolik", error });
    }
};

