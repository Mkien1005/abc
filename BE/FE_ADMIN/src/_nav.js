import {
  cibBloggerB,
  cilBasket,
  cilDrop,
  cilSpeedometer,
  cilTruck,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import React from "react";

const _nav = [
  {
    component: CNavItem,
    name: "Thống kê chung",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Thương hiệu",
    to: "/brand",
    icon: <CIcon icon={cibBloggerB} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Loại thuốc",
    to: "/category",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Sản phẩm",
    to: "/product",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: "Nhà cung cấp",
  //   to: "/suppliers",
  //   icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: "Đơn hàng",
    to: "/orders",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Nhập hàng",
    to: "/imports",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
];

export default _nav;
