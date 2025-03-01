import React from "react";

export const Loading = () => {
  return (
    <section className="h-screen bg-sidebarBg flex items-center justify-center">
      <div className="w-12 h-12 rounded-full animate-spin border-x-8 border-solid border-accent border-t-transparent"></div>
    </section>
  );
};
