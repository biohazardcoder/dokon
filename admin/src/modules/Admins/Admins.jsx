import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";
import {
  getAdminsError,
  getAdminsPending,
  getAdminsSuccess,
} from "../../Toolkit/AdminsSlicer";
import { CircleDollarSign, DollarSign, Trash2, Wallet } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export const Admins = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isPending, isError } = useSelector((state) => state.admins);
  const [isXS, setIsXS] = useState(window.innerWidth <= 767);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selected , setSelected] = useState({})
  const [selectedHistory , setSelectedHistory] = useState({})
  const [menu , setMenu] = useState(false)
  const [paid , setPaid] = useState(0)
  
  
  useEffect(() => {
    const handleResize = () => {
      setIsXS(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getAllAdmins = async () => {
    dispatch(getAdminsPending());
    try {
      const response = await Axios.get("admin");
      dispatch(getAdminsSuccess(response.data?.data || []));
    } catch (error) {
      dispatch(
        getAdminsError(error.response?.data?.message || "Noma'lum xato")
      );
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, []);
  
  useEffect(() => {
    if (selectedHistory) {
        handleCreditBacker();
    }
}, [selectedHistory]); 
  const handleMenu = async () => {
    setMenu(!menu)
  }

  const handleCreditChanger = async () => {
    if (!selected) return;
    try {
      await Axios.post("/admin/credit", {
        id: selected._id,
        paid: paid,
      });
      setPaid(0);
      getAllAdmins(); 
      setMenu(false)
    } catch (error) {
      console.error(error);
    }
  };

const handleCreditBacker = async () => {
    if (!selectedHistory) {
        alert("Tarixdan biror to‘lovni tanlang");
        return;
    }

    try {
        await Axios.post("/admin/backer", {
            id: selected?._id,
            paid: selectedHistory.paid,
            selectedId: selectedHistory._id
        });
        setPaid(0);
      getAllAdmins(); 
      setMenu(false)
    } catch (error) {
        console.log(error );
    } 
};


  const handleDelete = async (id) => {
    if (!window.confirm("Siz ushbu adminni o'chirishni xohlaysizmi?")) return;
    try {
      await Axios.delete(`admin/${id}`);
      dispatch(getAdminsSuccess(data.filter((admin) => admin._id !== id)));
      toast.success("Admin muvaffaqiyatli o'chirildi!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Adminni o'chirishda xato");
    }
  };

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="p-4 sm:p-8 relative bg-dashboardBg h-screen overflow-y-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Adminlar <span className="text-gray-500">[{data.length}]</span>
        </h1>
        <button
          onClick={() => navigate("/create-admin")}
          className="bg-sidebarBg text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Admin Qo'shish
        </button>
      </div>

      {isPending ? (
        <p className="text-center text-gray-600">Yuklanmoqda...</p>
      ) : isError ? (
        <p className="text-red-500 text-center text-lg">Xato: {isError}</p>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((admin, index) => (
            <div
              key={admin._id}
              className={`bg-gray-50 rounded-lg shadow-md transition transform ${
                isXS && activeIndex === index ? "scale-105" : "scale-100"
              }`}
            >
              <div
                className={`p-4 flex justify-between items-center ${
                  isXS ? "cursor-pointer" : ""
                }`}
                onClick={() => isXS && toggleCollapse(index)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    {admin.firstName} {admin.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{admin.phoneNumber}</p>
                </div>
                {isXS && (
                  <span className="text-gray-400">
                    {activeIndex === index ? "-" : "+"}
                  </span>
                )}
              </div>
              {(!isXS || activeIndex === index) && (
                <div className="p-4 bg-white space-y-3 rounded-b-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">Ism:</span>
                    <span className="text-gray-700">{admin.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Familiya:
                    </span>
                    <span className="text-gray-700">{admin.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Telefon raqami:
                    </span>
                    <span className="text-gray-700">{admin.phoneNumber}</span>
                  </div>
                  <button
                      onClick={() => {
                        setSelected(admin);
                        handleMenu();
                      }}
                      className="bg-highlight text-white text-sm py-2 px-4 rounded-md hover:bg-accent w-full"
                    >
                      <Wallet className="inline-block mr-2" /> Mablag'
                    </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-500 text-white text-sm py-2 px-4 rounded-md hover:bg-red-600 w-full"
                  >
                    <Trash2 className="inline-block mr-2" /> O'chirish
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-4">
          Adminlar topilmadi.
        </p>
      )}

      {menu && <div className="absolute top-0  z-50 left-0 p-10  bg-black/50 w-full h-screen">
          <div className="w-full h-full p-4 bg-white">
            <div className="flex justify-between gap-10">
            <div> 
                <h1>
                {selected.firstName} {selected.lastName}
                </h1>
                <h1>
                +998 {selected.phoneNumber}
                </h1>
            </div>
             <button
             onClick={handleMenu}
             className="bg-highlight text-white text-sm px-3 rounded-md hover:bg-accent "
             >
              Yopish
             </button>
            </div>
            <div>
              <hr className="mt-2" />
              <div className="flex items-center justify-between">
              <h1>
                Berilmagan pul: {selected.creadit.toLocaleString()} so'm
              </h1>
              <div className="flex items-center">
                <input 
                value={paid}
                onChange={(e)=>{setPaid(Number(e.target.value))}}
                type="number"  className="p-2 border-black border"/>
                <button 
                onClick={handleCreditChanger}
                className="p-2 border border-transparent text-white bg-highlight">
                  <CircleDollarSign/>
                </button>
              </div>
              </div>
            </div>
                <div className="overflow-x-auto">
            <table className="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                  <th className="border border-gray-300 px-4 py-2">Paid</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selected.history.slice().reverse().map((item, index) => (
                  <tr key={item._id} className="odd:bg-white even:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.date.slice(0, 10)}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.total.toLocaleString()} so'm</td>
                    <td className="border border-gray-300 px-4 py-2">{item.paid.toLocaleString()} so'm</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button 
                      onClick={()=>setSelectedHistory(item)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                        Qaytarish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
         </div>
        </div>}

    </div>
  );
};
