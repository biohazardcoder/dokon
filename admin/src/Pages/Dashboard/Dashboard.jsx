import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { Section } from "../../Components/Section/Section";
import { Statistics } from "../Statistics/Statistics";
import Axios from "../../Axios";
import { ToastContainer } from "react-toastify";

export const Dashboard = () => {
  const { data } = useSelector((state) => state.user);
  const [productCount, setproductCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [adminsCount, setadminsCount] = useState(0);

  function Logout() {
    if (!window.confirm("Are you sure you want to logout")) return;
    Cookies.remove("token");
    window.location.href = "/";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesResponse = await Axios.get("/partner");
        setproductCount(gamesResponse.data.data.length);

        const AdminsResponse = await Axios.get("/admin");
        setadminsCount(AdminsResponse.data.data.length);

        const clientsResponse = await Axios.get("/product");
        setClientCount(clientsResponse.data.data.length);
      } catch (error) {
        console.error("Failed to fetch statistics data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Section className="bg-dashboardBg overflow-y-auto max-h-screen py-4 px-3 md:py-8 md:px-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <Link
          to={`/edit-admin/${data._id}`}
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <img
              src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJwmuY1yYR2LJqWXtA0ZY0T3kx9uAZdO4lrIG3O7rnsAMp9oWxPOmcXU1AcMvFLwCxqWs&usqp=CAU"}
              alt="User Avatar"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-accent shadow-lg group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dashboardBg rounded-full shadow-md"></span>
          </div>
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-bold text-sidebarBg group-hover:text-accent transition-colors duration-300">
              Xush kelibsiz, {data.firstName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Profilingizni tahrirlash!
            </p>
          </div>
        </Link>

        <button
          onClick={Logout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 ease-in-out hover:shadow-xl"
        >
          Chiqish <LogOut size={18} />
        </button>
      </div>

      <Statistics
        productCount={productCount}
        adminsCount={adminsCount}
        clientCount={clientCount}
      ></Statistics>
    </Section>
  );
};
