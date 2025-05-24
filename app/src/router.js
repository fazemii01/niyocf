import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminDashboard from "./pages/Admin";
import ManageOrder from "./pages/Admin/ManageOrder";
import Auth from "./pages/Auth";
import ForgotPass from "./pages/Auth/ForgotPass";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPass from "./pages/Auth/ResetPass";

import NotFound from "./pages/Error";
import History from "./pages/History";
import HistoryDetail from "./pages/History/HistoryDetail";
import Mainpage from "./pages/Mainpage";
import Cart from "./pages/cart";
import Products from "./pages/Products";
import EditProduct from "./pages/Products/EditProduct";
import NewProduct from "./pages/Products/NewProduct";
import EditGalery from "./pages/Galery/EditGalery";
import NewGalery from "./pages/Galery/NewGalery";
import GaleryIndex from "./pages/Galery/index";
import trans from "./utils/dataProvider/transaction";

import EditTesti from "./pages/Testi/EditTestimonial";
import NewTesti from "./pages/Testi/NewTestimonial";
import IndexTesti from "./pages/Testi/IndexTestimonial";

import ProductDetail from "./pages/Products/ProductDetail";
import Profile from "./pages/Profile";
import EditPromo from "./pages/Promo/EditPromo";
import NewPromo from "./pages/Promo/NewPromo";
import InvoicePage from "./pages/Invoice/InvoicePage"; // Added InvoicePage import
import ScrollToTop from "./utils/scrollToTop";
import {
  CheckAuth,
  CheckIsAdmin,
  CheckNoAuth,
  TokenHandler,
} from "./utils/wrappers/protectedRoute";

// const AllRouter = createBrowserRouter(createRoutesFromElements());

const Routers = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<TokenHandler />}>
          {/* Public Route */}
          <Route path="*" element={<NotFound />} />
          <Route index element={<Mainpage />} />
          <Route path="products/*" element={<Products title="Products" />}>
            <Route path="category/:id" element={""} />
          </Route>
          <Route
            path="products/detail/:productId"
            element={<ProductDetail />}
          />
          <Route path="cart" element={<Cart />} />
          {/* Route which must not logged in */}
          <Route
            path="auth"
            element={
              <CheckNoAuth>
                <Auth />
              </CheckNoAuth>
            }
          >
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgotpass" element={<ForgotPass />} />
            <Route path="resetpass" element={<ResetPass />} />
          </Route>

          {/* Route which must logged in */}
          <Route element={<CheckAuth />}>
            <Route path="profile" element={<Profile title="User Profile" />} />
            <Route path="history" element={<History />} />
            <Route path="history/:id" element={<HistoryDetail />} />
            <Route path="invoice/:invoiceId" element={<InvoicePage />} />{" "}
            {/* Added InvoicePage route */}
          </Route>

          {/* Route which only admin */}
          <Route element={<CheckIsAdmin />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="manage-order" element={<ManageOrder />} />
            <Route path="products/edit/:productId" element={<EditProduct />} />
            <Route path="promo/new" element={<NewPromo />} />
            <Route path="promo/edit/:promoId" element={<EditPromo />} />
            <Route path="gallery/new" element={<NewGalery />} />
            <Route path="gallery/edit/:id" element={<EditGalery />} />
            <Route path="gallery" element={<GaleryIndex />} />
            <Route path="testi/new" element={<NewTesti />} />
            <Route path="testi/edit/:id" element={<EditTesti />} />
            <Route path="testi" element={<IndexTesti />} />
            <Route path="transaction/:id" element={<trans />} />
            <Route path="transaction" element={<trans />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
