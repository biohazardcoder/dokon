import React, { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Axios from "../../Axios";
import { FaIndustry } from "react-icons/fa";

export const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAuth } = useSelector((state) => state.user);

  if (isAuth) {
    window.location.href = "/";
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await Axios.post("admin/login", {
        password,
        phoneNumber: +phone,
      });

      Cookies.set("token", data.token, { secure: true, expires: 7 });
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen bg-sidebarBg flex items-center justify-center">
      <div className="bg-mainBg shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-accent transition-colors duration-300 ease-in-out">
            <FaIndustry />
          </span>
          <h1 className="text-2xl font-semibold text-accent tracking-wide  transition-colors duration-300 ease-in-out">
            Ishlab chiqarish markazi
          </h1>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="flex items-center bg-sidebarBg border border-mainText rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-1/6 text-sm bg-transparent text-mainText border-r border-mainText"
            >
              +998
            </button>
            <input
              type="number"
              className="p-3 outline-none w-5/6 bg-sidebarBg text-mainText placeholder-gray-400"
              placeholder="Телефонный номер"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="border border-mainText p-3 w-full rounded-lg bg-sidebarBg text-mainText placeholder-gray-400"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeSlash size={24} color="#fff" />
              ) : (
                <Eye size={24} color="#fff" />
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className={`bg-accent py-2 text-mainText rounded-lg font-semibold shadow-md hover:bg-highlight transition-all duration-300 ease-in-out ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};
