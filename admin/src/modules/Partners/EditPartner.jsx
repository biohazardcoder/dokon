import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "../../Axios";
import { toast, ToastContainer } from "react-toastify";

export const EditPartner = () => {
  const { partnerId } = useParams();
  const [isChecked, setIsChecked] = useState(false);

  const [partner, setPartner] = useState({
    shopName: "",
    address: "",
    phoneNumber: "",
    color: "",
  });

  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    phoneNumber: "",
    status: "",
    color: "red",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await Axios.get(`partner/${partnerId}`);
        setPartner(response.data.data);
        setFormData({
          shopName: response.data.data.shopName,
          address: response.data.data.address,
          phoneNumber: response.data.data.phoneNumber,
          status: response.data.data.status,
          color: response.data.data.color || "red",
        });

        setIsChecked(response.data.data.color === "green");
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || "Hamkorni olishda xato");
        setLoading(false);
      }
    };
    fetchPartner();
  }, [partnerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setFormData((prev) => ({
      ...prev,
      color: !isChecked ? "green" : "red", 
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shopName && !formData.address && !formData.phoneNumber) {
      toast.error("Iltimos, biror maydonni tahrir qiling!");
      return;
    }

    try {
      const updatedData = {
        shopName: formData.shopName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        status: formData.status,
        color: formData.color, 
      };

      try {
        const response = await Axios.put(`partner/${partnerId}`, updatedData);
        console.log(response.data);

        toast.success("Hamkor muvaffaqiyatli yangilandi!");

        setTimeout(() => {
          window.location.href = "/partners";
        }, 1000);
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        toast.error("Hamkorni yangilashda xato");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Hamkorni yangilashda xato");
    }
  };

  if (loading) return <p className="w-full bg-green-100 text-center h-screen">Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 px-4">
      <ToastContainer />
      <div className="p-4 w-full max-w-md bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Hamkorni Tahrirlash
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Dokon Nomi</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              maxLength={25}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Manzil</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              maxLength={30}
              onChange={handleChange}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              maxLength={43}
              minLength={1}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Telefon Raqami</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength={15}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4 flex gap-2 items-center">
            <h1>Qarzdorlik : </h1>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-5 h-5 cursor-pointer"
            />
            <span
              className={
                isChecked ? "text-green-500 font-bold" : "text-red-500 font-bold"
              }
            >
              {formData.color === "red" ? "To'lanmagan" : "To'langan"}
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
          >
            O'zgarishlarni Saqlash
          </button>
          <Link
            to="/partners"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 w-full text-center block"
          >
            Orqaga qaytish
          </Link>
        </form>
      </div>
    </div>
  );
};
