import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../../Axios";
import { Section } from "../../Components/Section/Section";
import { toast } from "react-toastify";

export const UserUpdate = () => {
  const { data } = useSelector((state) => state.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    avatar: data.avatar,
    phoneNumber: data.phoneNumber,
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.put(`admin/${id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        avatar: formData.avatar,
        phoneNumber: formData.phoneNumber,
        password: formData.newPassword,
      });
      toast.success("Muvaffaqiyatli yangilandi!")
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  const FormInput = "p-4 outline-none border border-white rounded-lg bg-sidebarBg text-white placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
  const LinkStyle = "text-white rounded-lg py-2 px-4 duration-300  font-semibold transition-colors"

  return (
    <Section className="bg-dashboardBg flex flex-col justify-center items-center h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-mainBg p-8 rounded-lg shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-center text-2xl font-bold text-white">Profilingizni tahrirlash:</h1>
        <input
          className={FormInput}
          type="text"
          placeholder="Ismingiz"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          className={FormInput}
          type="text"
          placeholder="Familiyangiz"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <input
          className={FormInput}
          type="number"
          placeholder="Telefon raqamingiz"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
        <input
          className={FormInput}
          type="password"
          placeholder="Parolingiz"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
        <div className="flex justify-between gap-4">
          <Link
            to="/"
            className={`bg-red-500  text-center ${LinkStyle} hover:bg-red-400`}
          >
            Bekor qilish
          </Link>
          <button
            type="submit"
            className={`bg-highlight  ${LinkStyle} shadow-md hover:bg-accent`}
          >
            Saqlash
          </button>
        </div>
      </form>
    </Section>
  );
};
