import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import {
  getProductError,
  getProductPending,
  getProductSuccess,
} from "../../Toolkit/ProductsSlicer";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FaPen, FaTrash } from "react-icons/fa";
import { getAdminsError, getAdminsPending, getAdminsSuccess } from "../../Toolkit/AdminsSlicer";

export const Products = () => {
  const dispatch = useDispatch();
  const { data, isPending, isError } = useSelector((state) => state.products);
  const User = useSelector((state) => state.user);
  const adminData = useSelector((state) => state.admins);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(""); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [isStockDifference, setStockDifference] = useState(0)
  const admins = adminData.data.filter(admin => admin._id !== User.data._id);
  const [startDate, setStartDate] = useState("");  
  const [endDate, setEndDate] = useState("");  
  const filteredProducts = data
  .filter((product) =>
    selectedAdmin
      ? product.admins.some((admin) => admin.admin.firstName === selectedAdmin)
      : true
  )
  .filter((product) => {
    const productDate = new Date(product.createdAt).toISOString().split("T")[0]; 
    return (!startDate || productDate >= startDate) && (!endDate || productDate <= endDate);
  });
    
  useEffect(() => {
    const total = filteredProducts.reduce((acc, product) => acc + product.total, 0);
    const stock = filteredProducts.reduce((acc, product) => acc + product.stock, 0);
  
    setTotalPrice(total);
    setTotalStock(stock);
  }, [filteredProducts]);
  
  useEffect(() => {
    const totalStockDifference = filteredProducts.reduce((acc, product) => {
      return acc + product.admins.reduce((adminAcc, item) => {
        return adminAcc + item.admin?.products
          .filter((p) => p.productId === product._id)
          .reduce((productAcc, filteredProduct) => {
            return productAcc + ((item.stock * Number(filteredProduct.price)) - (filteredProduct.stock * Number(filteredProduct.price)));
          }, 0);
      }, 0);
    }, 0);
  
    setStockDifference(totalStockDifference);
  }, [filteredProducts]);
  

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

  useEffect(() => {
    const getAllProducts = async () => {
      dispatch(getProductPending());
      try {
        const response = await Axios.get("product");
        const products = response.data?.data || [];
        dispatch(getProductSuccess(products));

      } catch (error) {
        dispatch(
          getProductError(error.response?.data?.message || "Noma'lum xato")
        );
      }
    };
    getAllProducts();
  }, [dispatch]);

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteConfirmOpen(true);
  };


  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await Axios.delete(`product/${selectedProduct._id}`);
      
      const deletedProduct = filteredProducts.find(
        (product) => product._id === selectedProduct._id
      );
  
      const updatedProducts = filteredProducts.filter(
        (product) => product._id !== selectedProduct._id
      );
  
      dispatch(getProductSuccess(updatedProducts));
  
      setTotalPrice((prev) => prev - deletedProduct.total);
      setTotalStock((prev) => prev - deletedProduct.stock);
  
      toast.success("Mahsulot muvaffaqiyatli o'chirildi");
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Mahsulotni o'chirishda xato");
    }
  };
  
  
  return (
    <div className="p-4 bg-green-100 w-full h-screen overflow-y-auto">
      <ToastContainer />
      <div className="w-full h-[70px] mt-2 flex py-4 md:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-semibold p-2 text-black">
          Mahsulotlar: <br />
        </h1>
        <div className="flex items-center gap-2">
        <select
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Barcha adminlar</option>
          {admins.map((item)=>(
            <option key={item._id} value={item.firstName}>
              {item.firstName}
            </option>
          ))}
        </select>
        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded"
          />
        <Link
          to={"/create-product"}
          className="bg-sidebarBg text-white px-2 py-2 text-sm rounded shadow hover:bg-highlight duration-400 transition-colors"
        >
          Qo'shish
        </Link>
        </div>
      </div>
      {isPending ? (
        <div className="text-center text-gray-500">Yuklanmoqda...</div>
      ) : isError ? (
        <p className="text-red-500 text-center text-xl">Xato: {isError}</p>
      ) : filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-highlight text-white text-left">
                <th className="border border-gray-300 px-4 py-3">Nomi</th>
                <th className="border border-gray-300 px-4 py-3">Narxi</th>
                <th className="border border-gray-300 px-4 py-3">Soni</th>
                <th className="border border-gray-300 px-4 py-3">Umumiy narx</th>
                <th className="border border-gray-300 px-4 py-3">Sotuvchilar</th>
                <th className="border border-gray-300 px-4 py-3">Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.reverse().map((product, index) => (
                <tr key={product._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">{product.title} ({product.size})
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">
                    {new Intl.NumberFormat("us").format(product.price)} so'm
                  </td>
                  <td className="border border-gray-300 px-4 py-3">{product.stock} ta</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">
                    {new Intl.NumberFormat("us").format(product.total)} so'm
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {product?.admins.map((item) => (
                      <div key={item._id} className="mb-1 text-sm flex flex-col border-b border-gray-500 p-1">
                        <span className="font-semibold ">{item.admin?.firstName}</span>
                        <span className="ml-2 text-gray-700">
                          {item.stock}/
                          {item.admin?.products
                            .filter((p) => p.productId === product._id)
                            .map((filteredProduct) => {
                              const stockDifference = (item.stock * Number(filteredProduct.price)) - (filteredProduct.stock * Number(filteredProduct.price));
                              return (
                                <span key={filteredProduct._id}>
                                  <span>{filteredProduct.stock}ta</span>
                                  <span className="font-semibold">
                                    {" "} {stockDifference.toLocaleString("uz-UZ")} so'm
                                  </span>
                                </span>
                              );
                            })}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(product)}
                      className="bg-red-500 text-white  px-3 py-2"
                      title="O'chirish"
                    >
                      <FaTrash/>
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-highlight text-white">
              <td className="border border-gray-300 px-4 py-3 font-semibold">
                Jami
              </td>
              <td className="border border-gray-300 px-4 py-3 font-semibold">
                   
              </td>
             
              <td className="border border-gray-300 px-4 py-3 font-semibold">
                {totalStock} ta      
              </td>
              <td className="border border-gray-300 px-4 py-3 font-semibold">
              {totalPrice.toLocaleString()} so'm    
              </td>
              <td className="border border-gray-300 px-4 py-3 font-semibold">
              {isStockDifference.toLocaleString("uz-UZ")} so'm             
               </td>
              <td className="border border-gray-300 px-4 py-3 font-semibold">
              </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Hech qanday mahsulot topilmadi</p>
      )}
      

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">O'chirishni tasdiqlash</h3>
            <p>Mahsulotni o'chirishni xohlaysizmi?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
