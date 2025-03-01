import Product from "../models/product.js";
import admin from "../models/admin.js";


const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

 
export const CreateNewProduct = async (req, res) => {
  try {
    const { title, price, size, admins,stock} = req.body;

    const newProduct = new Product({
      title,
      price,
      size,
      stock,
      admins: admins.map(item => ({
        admin: item.admin,
        stock: item.stock
      }))
    });

    await newProduct.save();


    await Promise.all(
      admins.map(async (item) => {
        const adminDoc = await admin.findById(item.admin);
        if (adminDoc) {
          adminDoc.products.push({
            productId: newProduct._id,
            product: title,
            price,
            size,
            stock: item.stock
          });
          await adminDoc.save();
        }
      })
    );

    return res.status(201).json({
      message: "Mahsulot muvaffaqiyatli yaratildi",
      product: newProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ichki server xatosi." });
  }
};


export const GetAllProducts = async (req, res) => {
  try {
    const { title, pageNum, pageSize } = req.query;
    const titleRegExp = new RegExp(title, "i");

    const total = await Product.countDocuments({
      title: titleRegExp,
    });

    const products = await Product.find({
      title: titleRegExp,
    })
      .populate({
        path: "admins.admin", 
      })
      .skip((pageNum - 1) * pageSize)
      .limit(parseInt(pageSize));

    return res.status(200).json({ data: products, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ichki server xatosi." });
  }
};


export const DeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(res, 404, "Mahsulot topilmadi.");
    }

    await admin.updateMany(
      { "products.productId": id },
      { $pull: { products: { productId: id } } }
    );

    const deletedProduct = await Product.findByIdAndDelete(id);
    
    
    return res.status(201).json({
      message: "Mahsulot muvaffaqiyatli o'chirildi.",
      deletedProduct,
    });
  } catch (error) {
    console.error("Mahsulotni o'chirishda xato:", error);
    return sendErrorResponse(res, 500, "Ichki server xatosi.");
  }
};


export const UpdateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    if (!product) {
      return sendErrorResponse(res, 409, "Mahsulot topilmadi.");
    }
    return res.status(201).json({ data: product });
  } catch (error) {
    return sendErrorResponse(res, 500, "Ichki server xatosi.");
  }
};

export const GetOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const oneProduct = await Product.findById(productId);
    if (!oneProduct) {
      return sendErrorResponse(res, 409, "Mahsulot topilmadi.");
    }
    return res.status(201).json({ data: oneProduct });
  } catch (error) {
    return sendErrorResponse(res, 500, "Ichki server xatosi.");
  }
};

export const GetProductsByIds = async (req, res) => {
  const productIds = req.body.ids;
  try {
    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (!products || products.length === 0) {
      return sendErrorResponse(res, 404, "Mahsulotlar topilmadi.");
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return sendErrorResponse(res, 500, "Ichki server xatosi.");
  }
};
