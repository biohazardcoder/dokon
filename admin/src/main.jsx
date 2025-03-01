import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Toolkit/UserSlicer.jsx";
import { Provider } from "react-redux";
import AdminsReducer from "./Toolkit/AdminsSlicer.jsx";
import ProductsReducer from "./Toolkit/ProductsSlicer.jsx";
import PartnerReducer from "./Toolkit/PartnersSlicer.jsx";

const store = configureStore({
  reducer: {
    user: UserReducer,
    admins: AdminsReducer,
    products: ProductsReducer,
    partners: PartnerReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
