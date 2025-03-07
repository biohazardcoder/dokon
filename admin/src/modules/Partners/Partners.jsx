import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import {
  getPartnerError,
  getPartnerPending,
  getPartnerSuccess,
} from "../../Toolkit/PartnersSlicer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const Partners = () => {
  const dispatch = useDispatch();
  const { data, isPending, isError } = useSelector((state) => state.partners);
  const [adminName, setAdminName] = useState("");
  const [selected, setSelected ] = useState({})
  const [modal, setModal ] = useState(false)
  const total = (selected?.products?.length > 0)
    ? selected.products.reduce((acc, { price, quantity }) => acc + price * quantity, 0)
    : 0;
  
  useEffect(() => {
    const getAllPartners = async () => {
      dispatch(getPartnerPending());
      try {
        const response = await Axios.get("partner");
        dispatch(getPartnerSuccess(response.data?.data || []));
      } catch (error) {
        dispatch(
          getPartnerError(error.response?.data?.message || "Noma'lum xatolik")
        );
      }
    };
    getAllPartners();
  }, [dispatch]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const handleModal = ()=>{
    setModal(!modal)
  }

  const filteredPartners = data.filter((partner) => {
    const createdAt = new Date(partner.updatedAt).toISOString().split("T")[0];
  
    const matchesDate =
      (!startDate || createdAt >= startDate) &&
      (!endDate || createdAt <= endDate);
  
    const matchesAdmin = adminName
      ? partner.admin?.firstName?.toLowerCase().includes(adminName.toLowerCase())
      : true;
  
    return matchesDate && matchesAdmin;
  });
  
  const today = new Date().toLocaleDateString("sv-SE"); 
  const exportToExcel = () => {
    const excelData = filteredPartners.map((partner, index) => ({
      "№": index + 1,
      "Do‘kon Nomi": partner.shopName,
      "Oxirgi amaliyot": partner.updatedAt.slice(0,10) || "Noma'lum",
      "Telefon raqami": partner.phoneNumber || "Noma'lum",
      "Sotuvchi": partner.admin?.firstName || "Noma'lum",
      "Jami Summa": partner.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toLocaleString(),
      "Mahsulotlar": partner.products.map(p => `${p.product} (${p.date.slice(0,10)}) (${p.quantity} ta)`).join(", ")
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, today);

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${today}.xlsx`);
  };

  return (
    <div className="p-4 bg-green-100 w-full min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="flex mb-4 items-center gap-5">
      <div>
  <label className="block text-gray-700 font-semibold">Boshlanish sanasi:</label>
  <input
    type="date"
    className="border p-2 rounded w-full"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
</div>

<div>
  <label className="block text-gray-700 font-semibold">Tugash sanasi:</label>
  <input
    type="date"
    className="border p-2 rounded w-full"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
    </div>
        <div>
          <label className="block text-gray-700 font-semibold">Sotuvchi ismi bo‘yicha filtr:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Sotuvchi ismini kiriting"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700 transition"
        >
          Tortib olish
        </button>

      </div>

      {isPending ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Yuklanmoqda...</p>
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center text-xl">{isError}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Do‘kon Nomi</th>
                <th className="border p-2">Sotuvchi</th>
                <th className="border p-2">Jami</th>
                <th className="border p-2">Mahsulotlar</th>
              </tr>
            </thead>
            <tbody className="bg-white font-normal">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner, index) => {
                  const groupedProducts = partner.products.reduce((acc, product) => {
                    if (acc[product.product]) {
                      acc[product.product].quantity += product.quantity;
                      acc[product.product].totalPrice += product.price * product.quantity;
                    } else {
                      acc[product.product] = {
                        product: product.product,
                        quantity: product.quantity,
                        totalPrice: product.price * product.quantity
                      };
                    }
                    return acc;
                  }, {});
                  return (
                    <tr key={partner._id} className="border text-xs" onClick={() => { setSelected(partner); handleModal(); }}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">
                        <span>
                          <span className="font-semibold">{partner.shopName} </span>
                          ({partner.updatedAt.slice(0, 10)})
                        </span>
                        <br /> <span>{partner.phoneNumber}</span>
                      </td>
                      <td className="border p-2">{partner.admin?.firstName || "Noma'lum"}</td>
                      <td className="border p-2">
                        {partner.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toLocaleString()} so'm
                      </td>
                      <td className="border p-2">
                        {Object.values(groupedProducts).map((group, i) => (
                          <span key={i} className="block">
                            {group.product} {group.quantity}ta - {(group.totalPrice).toLocaleString()} so'm
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-600">
                    Hech qanday ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 ">
                <td colSpan="3" className="border p-2 font-semibold">Jami:</td>
                <td className="border p-2 font-semibold">
                  {filteredPartners
                    .reduce((sum, partner) => sum + partner.products.reduce((total, product) => total + (product.price * product.quantity), 0), 0)
                    .toLocaleString()} so‘m
                </td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
          {modal && <div className="w-full h-screen absolute  top-[60px] left-0  p-20 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white overflow-y-auto w-full h-full">
                <table className="min-w-full table-auto border-collapse border border-gray-300 ">
                <thead>
                  <tr className="bg-highlight text-white">
                    <th className="px-4 py-2 text-left">Nomi</th>
                    <th className="px-4 py-2 text-left">Sanasi</th>
                    <th className="px-4 py-2 text-left">Narxi</th>
                    <th className="px-4 py-2 text-left">Soni</th>
                    <th className="px-4 py-2 text-left flex items-center justify-between"><span>Jami</span> 
                    <button 
                    onClick={handleModal}
                    className="bg-red-500 px-4 py-1 rounded-md">Yopish</button></th>
                  </tr>
                </thead>
                <tbody>
                 {
                  selected.products.length > 0 ? (selected.products.map(({ date, price, quantity, size, product }, index) => (
                    <tr key={index} className={`border-t text-xs font-semibold ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}>
                      <td className="px-4 py-2">{product}({size})</td>
                      <td className="px-4 py-2">{date.slice(0, 10)}</td>
                      <td className="px-4 py-2">{(price).toLocaleString()} so'm</td>
                      <td className="px-6 py-2">{quantity}</td>
                      <td className="px-4 py-2">{(quantity * price).toLocaleString()} so'm</td>
                    </tr>
                  ))) : <h1 className="p-2 text-center  text-black">
                      Mahsulotlar mavjud emas
                      </h1>
                 }
                </tbody>
                <tfoot>
                  <tr className="bg-highlight text-white">
                    <td className="px-4 py-2" colSpan={4}>Jami:</td>
                    <td className="px-4 py-2 text-sm font-semibold" >{total.toLocaleString()} so'm</td>
                  </tr>
                </tfoot>
              </table>
                </div>
            </div>}
        </div>
      )}
    </div>
  );
};
