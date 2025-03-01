import React, { useEffect, useState } from "react";
import { Section } from "../../Components/Section/Section";
import Axios from "../../Axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAdminsError, getAdminsPending, getAdminsSuccess } from "../../Toolkit/AdminsSlicer";
import {FaTrash} from "react-icons/fa"
export const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    stock: "",
    size: "",
    admins: [],
  });

  const adminData = useSelector((state) => state.admins);
  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllAdmins = async () => {
      dispatch(getAdminsPending());
      try {
        const response = await Axios.get("admin");
        dispatch(getAdminsSuccess(response.data?.data || []));
      } catch (error) {
        dispatch(getAdminsError(error.response?.data?.message || "Noma'lum xato"));
      }
    };
    getAllAdmins();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdminChange = (index, field, value) => {
    const updatedAdmins = [...productData.admins];
    updatedAdmins[index][field] = value;
    setProductData((prevData) => ({ ...prevData, admins: updatedAdmins }));
  };

  const addAdminField = () => {
    setProductData((prevData) => ({
      ...prevData,
      admins: [...prevData.admins, { admin: "", stock: "" }],
    }));
  };

  const removeAdminField = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      admins: prevData.admins.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/product/create", productData);
      toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
      setTimeout(() => navigate("/products"), 1000);
    } catch (error) {
      toast.error("Mahsulotni qo'shishda xato!");
    }
  };

  return (
    <Section className="bg-dashboardBg flex h-screen p-4 pb-10">
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className="md:w-3/4 w-full m-auto bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-4">Yangi Mahsulot Qo'shish</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="title" className="border border-gray-300 rounded-md p-2 w-full mt-2" value={productData.title} onChange={handleInputChange} placeholder="Sarlavha" required />
          <input type="number" name="price" className="border border-gray-300 rounded-md p-2 w-full mt-2" value={productData.price} onChange={handleInputChange} placeholder="Narxi" required />
          <input type="number" name="stock" className="border border-gray-300 rounded-md p-2 w-full mt-2" value={productData.stock} onChange={handleInputChange} placeholder="Zaxira" required />
          <input type="text" name="size" className="border border-gray-300 rounded-md p-2 w-full mt-2" value={productData.size} onChange={handleInputChange} placeholder="O'lcham" />
        </div>

        {productData.admins.map((admin, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <select className="border border-gray-300 rounded-md p-2 w-full" value={admin.admin} onChange={(e) => handleAdminChange(index, "admin", e.target.value)}>
              <option value="">Sotuvchini tanlang</option>
              {adminData.data.filter((a) => a._id !== data._id).map((a) => (
                <option key={a._id} value={a._id}>{a.firstName}</option>
              ))}
            </select>
            <input type="number" className="border border-gray-300 rounded-md p-2 w-full" placeholder="Zaxira" value={admin.stock} onChange={(e) => handleAdminChange(index, "stock", e.target.value)} />
            <button type="button" onClick={() => removeAdminField(index)} className="bg-red-500 text-white py-3 px-3 rounded"><FaTrash className="text-sm"/></button>
          </div>
        ))}

        <button type="button" onClick={addAdminField} className="bg-blue-500 text-white px-3 py-2 rounded mt-2">Sotuvchi qo'shish</button>

        <button type="submit" className="bg-slate-800 w-full text-xl py-2 rounded-md text-white mt-4">Yuborish</button>
        <button type="button" onClick={() => navigate("/products")} className="bg-red-500 w-full text-xl py-2 rounded-md text-white mt-2">Orqaga qaytish</button>
      </form>
    </Section>
  );
};
