import React from "react";
import { Header } from "../Components/Header/Header";
import { Sidebar } from "../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="h-screen ">
      <Header />
      <div className="root-grid ">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};
