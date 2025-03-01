import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "../../Axios";
import { Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ShopSalesHistory = () => {
  const { partnerId } = useParams();
  const [partner, setPartner] = useState(null);
  const [products, setProducts] = useState([]);
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await Axios.get(`partner/${partnerId}`);
        setPartner(response.data.data);
        console.log(response.data);
        setProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Hamkor ma'lumotlarini olishda xatolik yuz berdi");
      }
    };



    fetchPartnerData();
  }, [partnerId]);

  const fetchPartnerProducts = async (productIds) => {
    try {
      const response = await Axios.post(`product/:${products}`, {
        ids: productIds.map((item) => item.productId),
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Mahsulotlarni olishda xatolik yuz berdi");
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("uz-UZ").format(num);
  };

  const handleEditProduct = async (productId) => {
    if (!newQuantity || isNaN(newQuantity) || parseInt(newQuantity) <= 0) {
      toast.error("Iltimos, to'g'ri miqdor kiriting");
      return;
    }

    toast.promise(
      Axios.put(`partner/${partnerId}/products/${productId}`, {
        newQuantity: parseInt(newQuantity),
      })
        .then(() => {
          return Axios.get(`partner/${partnerId}`);
        })
        .then((response) => {
          setPartner(response.data.data);
          fetchPartnerProducts(response.data.data.products);
          window.location.reload();
          setNewQuantity("");
        }),
      {
        pending: "Mahsulot tahrirlanmoqda...",
        success: "Mahsulot muvaffaqiyatli tahrirlandi!",
        error: "Mahsulotni tahrirlashda xatolik yuz berdi!",
      }
    );
  };

  const handleDeleteProduct = async (productId) => {
    toast.promise(
      Axios.delete(`partner/${partnerId}/products/${productId}`)
        .then(() => {
          return Axios.get(`partner/${partnerId}`);
        })
        .then((response) => {
          setPartner(response.data.data);
          fetchPartnerProducts(response.data.data.products);
        }),
      {
        pending: "Mahsulot o'chirilmoqda...",
        success: "Mahsulot muvaffaqiyatli o'chirildi!",
        error: "Mahsulotni o'chirishda xatolik yuz berdi!",
      }
    );
  };


  const totalSum = products.reduce((total, purchase) => {
    return total + (purchase.price * purchase.purchasedQuantity);
  }, 0);

  if (!partner) {
    return (
      <div className="flex justify-center bg-green-100 h-screen">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 w-full min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Do'kon tarixi</h2>
        <div className="flex items-center gap-4 bg-white  ">
          <img
            src={partner.photos[0] || "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"}
            alt=""
            className="w-20 h-20 rounded-md object-center"
          />
          <p className="text-lg text-gray-700 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Do'kon nomi:</span>
            <span className="font-medium text-xl text-gray-800">{partner.shopName}</span>
            <span className="font-medium text-sm text-gray-800">{partner.phoneNumber}</span>
          </p>
        </div>


        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Sotib olingan mahsulotlar tarixi:
          </h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Mahsulot
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Sotib olingan miqdor
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Umumiy narx (so'm)
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Sana
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Admin
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {partner.products.map((purchase, index) => {
                return (
                  purchase && (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-4">
                          <img
                            src={purchase.photos[0]}
                            alt={purchase.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <span className="font-medium text-gray-800">
                            {purchase.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {purchase.purchasedQuantity} ta
                      </td>
                      <td className="px-4 py-2 text-center">
                        {formatNumber(
                          purchase.price * purchase.purchasedQuantity
                        )}{" "}
                        so'm
                      </td>
                      <td className="px-4 py-2 text-center">
                        {new Date(purchase.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {purchase.admin}
                      </td>
                      <td className="px-4 py-2 text-center flex gap-2">
                        <input
                          type="number"
                          placeholder="Yangi miqdor"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md w-32"
                        />
                        <button
                          onClick={() => handleEditProduct(purchase.productId)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition duration-300 ease-in-out"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(purchase.productId)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-300 ease-in-out"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 font-semibold text-xl flex justify-between border-t pt-4 text-gray-800">
          <span>Umumiy summa:</span>
          <span>{formatNumber(totalSum)} so'm</span>
        </div>

        <div className="mt-8">
          <Link
            to="/partners"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Orqaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
};
