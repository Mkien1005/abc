import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Brands = React.lazy(() => import("./views/brand"));
const CategoryView = React.lazy(() => import("./views/category/category"));
const Products = React.lazy(() => import("./views/product/productList"));
const AddProduct = React.lazy(() => import("./views/product/addProduct"));
const Orders = React.lazy(() => import("./views/order/orders"));
const OrderDetails = React.lazy(() => import("./views/order/orderDetail"));
const Imports = React.lazy(() => import("./views/product/imports"));
const Suppliers = React.lazy(() => import("./views/supplier/supplier"));
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Thương hiệu", element: Dashboard },
  { path: "/brand", name: "Dashboard", element: Brands },
  { path: "/product", name: "Sản phẩm", element: Products },
  { path: "/category", name: "Loại sản phẩm", element: CategoryView },
  { path: "/product/add", name: "Thêm sản phẩm", element: AddProduct },
  { path: "/product/edit/:id", name: "Sửa sản phẩm", element: AddProduct },
  { path: "/orders", name: "Danh sách đơn hàng", element: Orders },
  {
    path: "/order-detail/:id",
    name: "Chi tiết đơn hàng",
    element: OrderDetails,
  },
  { path: "/imports", name: "Nhập hàng", element: Imports },
  { path: "/suppliers", name: "Nhà cung cấp", element: Suppliers },
];

export default routes;
