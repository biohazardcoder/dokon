import React, { useEffect, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Axios from "./Axios";
import {
  getUserError,
  getUserPending,
  getUserSuccess,
} from "./Toolkit/UserSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "./Pages/Loading/Loading";
import { Login } from "./Pages/Auth/Login";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { RootLayout } from "./Layout/RootLayout";
import { AuthLayout } from "./Layout/AuthLayout";
import { Error } from "./Pages/Error/Error";
import { UserUpdate } from "./Pages/Update/UserUpdate";
import { Admins } from "./modules/Admins/Admins";
import { CreateAdmin } from "./modules/Admins/CreateAdmin";
import { AddProduct } from "./modules/Products/AddProduct";
import { Products } from "./modules/Products/Products";
import { Partners } from "./modules/Partners/Partners";

function App() {
  const dispatch = useDispatch();
  const { isAuth, isPending } = useSelector((state) => state.user);

  useEffect(() => {
    async function getMyData() {
      try {
        dispatch(getUserPending());
        const response = (await Axios.get("admin/me")).data;

        if (response.data) {
          dispatch(getUserSuccess(response.data));
        } else {
          dispatch(getUserError("No user data available"));
        }
      } catch (error) {
        dispatch(getUserError(error.response?.data || "Unknown Token"));
      }
    }
    getMyData();
  }, [dispatch]);

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: "/",
          element: <Loading />,
        },
      ]);
    }

    if (isAuth) {
      return createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: "edit-admin/:id",
              element: <UserUpdate />,
            },
            {
              path: "admins",
              element: <Admins />,
            },
            {
              path: "create-admin",
              element: <CreateAdmin />,
            },
            {
              path: "products",
              element: <Products />,
            },
            {
              path: "create-product",
              element: <AddProduct />,
            },
            {
              path: "partners",
              element: <Partners />,
            },
            {
              path: "*",
              element: <Error />,
            },
          ],
        },
      ]);
    }

    return createBrowserRouter([
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "*",
            element: <Error />,
          },
        ],
      },
    ]);
  }, [isPending, isAuth]);

  return <RouterProvider router={router} />;
}

export default App;
