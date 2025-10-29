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
import { Admin } from "./views/Admin/Admin";
import { AdminAddProductView } from "./views/AdminAddProduct/AdminAddProduct";
import { AdminEditProductView } from "./views/AdminEditProduct/AdminEditProduct";
import { AdminProductsListView } from "./views/AdminProductsList/AdminProductsList";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute/AdminProtectedRoute";
import { AdminProvider } from "./components/AdminProvider";
import { adminProductsLoader } from "./api/adminLoader";
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
        element: <Admin />,
      },
      {
        path: "/admin/products",
        element: (
          <AdminProtectedRoute>
            <AdminProductsListView />
          </AdminProtectedRoute>
        ),
        loader: adminProductsLoader,
      },
      {
        path: "/admin/products/add",
        element: (
          <AdminProtectedRoute>
            <AdminAddProductView />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/products/edit/:id",
        element: (
          <AdminProtectedRoute>
            <AdminEditProductView />
          </AdminProtectedRoute>
        ),
        loader: productLoader,
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
    <AdminProvider>
      <RouterProvider router={router}></RouterProvider>
    </AdminProvider>
  </React.StrictMode>
);
