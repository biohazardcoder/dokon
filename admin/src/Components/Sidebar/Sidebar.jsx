import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { ToastContainer,toast } from "react-toastify";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreen(window.innerWidth >= 757 && window.innerWidth <= 800);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={`${
          isMediumScreen ? "block" : "md:hidden"
        } p-4 bg-sidebarBg flex items-center justify-between shadow-lg`}
      >
        <h1 className="text-lg font-semibold text-sidebarText">Menyular</h1>
        <button onClick={toggleMenu} className="text-3xl text-sidebarText">
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      <aside
        className={`
          bg-sidebarBg h-full shadow-lg transform transition-transform duration-300 ease-in-out 
          fixed top-0 left-0 z-50
          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${
            isMediumScreen
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "md:translate-x-0 md:static md:w-[310px]"
          }
        `}
      >
        <ul className="h-full flex flex-col">
          {[
            { path: "/", label: "Shaxsiy panel" },
            { path: "/products", label: "Mahsulotlar" },
            { path: "/partners", label: "Hamkorlar" },
            { path: "/admins", label: "Sotuvchilar" },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center text-lg font-semibold p-4 transition-colors duration-300 ${
                    isActive
                      ? "bg-highlight text-highlightText"
                      : "text-sidebarText hover:bg-hoverBg hover:text-hoverText"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {isOpen && (
        <div
          className={`fixed inset-0 bg-black opacity-50 z-40 ${
            isMediumScreen ? "block" : "md:hidden"
          }`}
          onClick={toggleMenu}
        ></div>
      )}

    </>
  );
};

