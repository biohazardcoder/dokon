import React from "react";
import { FaIndustry } from "react-icons/fa";

export const Header = () => {
  return (
    <header className="bg-sidebarBg h-[60px] shadow-lg flex items-center">
      <div className="w-full max-w-6xl flex items-center justify-between px-4 text-sidebarText">
        <div className="flex items-center gap-3">
          <span className="text-[30px] md:text-[24px] text-accent transition-colors duration-300 ease-in-out">
            <FaIndustry className="text-[1.5rem] md:text-[1.25rem]" />
          </span>
          <h1 className="text-xl md:text-lg cursor-default font-semibold text-accent tracking-wide transition-colors duration-300 ease-in-out">
            Ishlab chiqarish markazi
          </h1>
        </div>
      </div>
    </header>
  );
};
