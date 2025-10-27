import "./styles/theme.css";
import "./styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Cart } from "./views/Cart/Cart";
import { Favourites } from "./views/Favourites/Favourites";
import { Layout } from "./components/Layout/Layout";
import { MainPage } from "./views/MainPage/MainPage";
import { ProductsList } from "./views/ProductsList/ProductsList";
import { ProductDetails } from "./views/ProductDetails/ProductDetails";
import { mainPageLoader } from "./api/mainPageLoader";
import { productListLoader } from "./api/productListLoader";
import { productLoader } from "./api/productLoader";
import { favouritesLoader } from "./api/favouritesLoader";
import { addProductToFavourites } from "./api/addProductToFavouritesAction";
import { deleteFavouriteAction } from "./api/deleteFavouritesAction";
import { NotFound } from "./components/NotFound/NotFound";
import { AdminDashboard } from "./views/Admin/AdminDashboard";
import { AdminProductsList } from "./views/Admin/AdminProductsList";
import { AdminAddProduct } from "./views/Admin/AdminAddProduct";
import { AdminEditProduct } from "./views/Admin/AdminEditProduct";
import { adminProductsLoader } from "./api/adminLoader";
import { adminProductLoader } from "./api/adminLoader";
import { editProductAction } from "./api/editProductAction";
import { deleteProductAction } from "./api/deleteProductAction";

const router = createBrowserRouter([
  {
    path: "/add-to-favourites/:productId",
    action: addProductToFavourites,
    errorElement: <NotFound />,
  },
  {
    path: "/delete-from-favourites/:favouriteId",
    action: deleteFavouriteAction,
    errorElement: <NotFound />,
  },
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/koszyk",
        element: <Cart />,
      },
      {
        path: "/ulubione",
        element: <Favourites />,
        loader: favouritesLoader,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/products",
        element: <AdminProductsList />,
        loader: adminProductsLoader,
      },
      {
        path: "/admin/products/add",
        element: <AdminAddProduct />,
      },
      {
        path: "/admin/products/edit/:id",
        element: <AdminEditProduct />,
        loader: adminProductLoader,
        action: editProductAction,
      },
      {
        path: "/admin/products/delete/:id",
        action: deleteProductAction,
      },
      {
        path: "/:gender?",
        element: <MainPage />,
        loader: mainPageLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/:gender/:category/:subcategory?",
        element: <ProductsList />,
        loader: productListLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/:gender/:category/:subcategory/:productId",
        element: <ProductDetails />,
        loader: productLoader,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "test",
    element: <Layout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
