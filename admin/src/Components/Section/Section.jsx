import React from "react";

export const Section = ({ children, className }) => {
  return (
    <section className={"p-5 overflow-y-auto md:p-4 sm:p-3 xs:p-2" + " " + className}>
      {children}
    </section>
  );
};