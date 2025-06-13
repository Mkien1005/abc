import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CButtonGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilDollar,
  cilPeople,
  cilList,
  cibCcMastercard,
  cilChartLine,
  cilStar,
  cilCloudDownload,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";
import {
  cibGoogle,
  cibFacebook,
  cibTwitter,
  cibLinkedin,
  cibCcVisa,
  cibCcStripe,
  cibCcPaypal,
  cibCcApplePay,
  cibCcAmex,
} from "@coreui/icons";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import MainChart from "./MainChart";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import classNames from "classnames";
import {
  getRevenueStats,
  getCustomerStats,
  getOrderStats,
  getProductStats,
  getMonthlyStats,
  getCategoryStats,
  getTopProducts,
} from "src/api/dashboard";

// Comment out avatar imports
// import avatar1 from "../../assets/images/avatars/1.jpg";
// import avatar2 from "../../assets/images/avatars/2.jpg";
// import avatar3 from "../../assets/images/avatars/3.jpg";
// import avatar4 from "../../assets/images/avatars/4.jpg";
// import avatar5 from "../../assets/images/avatars/5.jpg";
// import avatar6 from "../../assets/images/avatars/6.jpg";

// Comment out flag imports
// import cifUs from "../../assets/images/flags/us.jpg";
// import cifBr from "../../assets/images/flags/br.jpg";
// import cifIn from "../../assets/images/flags/in.jpg";
// import cifFr from "../../assets/images/flags/fr.jpg";
// import cifEs from "../../assets/images/flags/es.jpg";
// import cifPl from "../../assets/images/flags/pl.jpg";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    revenue: { amount: 0, changePercentage: 0 },
    newCustomers: 0,
    orders: 0,
    bestSellingProduct: "",
    charts: {
      monthlyStats: [],
      productTypeStats: [],
      customerGrowthStats: [],
      topProducts: [],
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          revenueData,
          customerData,
          orderData,
          productData,
          monthlyData,
          categoryData,
          topProductsData,
        ] = await Promise.all([
          getRevenueStats(),
          getCustomerStats(),
          getOrderStats(),
          getProductStats(),
          getMonthlyStats(),
          getCategoryStats(),
          getTopProducts(),
        ]);

        setDashboardData({
          revenue: revenueData.data,
          newCustomers: customerData.data.newCustomers,
          orders: orderData.data.totalOrders,
          bestSellingProduct: productData.data.bestSellingProduct,
          charts: {
            monthlyStats: monthlyData.data,
            productTypeStats: categoryData.data,
            customerGrowthStats: customerData.data.growthStats,
            topProducts: topProductsData.data,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    console.log("value :>> ", isNaN(value));
    const num = parseFloat(value);
    if (isNaN(num)) return "0.0%";
    console.log(`num :>> ${num.toFixed(1)}%`);
    return `${num.toFixed(1)}%`;
  };

  const widgets = [
    {
      title: "Doanh thu",
      value: formatCurrency(dashboardData.revenue.amount),
      value2: formatPercentage(dashboardData.revenue.changePercentage),
    },
    {
      title: "Khách hàng mới",
      value: dashboardData.newCustomers.toString(),
      value2: "tháng này",
    },
    {
      title: "Đơn hàng",
      value: dashboardData.orders.toString(),
      value2: "tháng này",
    },
    {
      title: "Sản phẩm bán chạy",
      value: dashboardData.bestSellingProduct,
      value2: "tháng này",
    },
  ];

  const progressExample = [
    { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
    { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
    {
      title: "Pageviews",
      value: "78.706 Views",
      percent: 60,
      color: "warning",
    },
    { title: "New Users", value: "22.123 Users", percent: 80, color: "danger" },
    {
      title: "Bounce Rate",
      value: "Average Rate",
      percent: 40.15,
      color: "primary",
    },
  ];

  const progressGroupExample1 = [
    { title: "Monday", value1: 34, value2: 78 },
    { title: "Tuesday", value1: 56, value2: 94 },
    { title: "Wednesday", value1: 12, value2: 67 },
    { title: "Thursday", value1: 43, value2: 91 },
    { title: "Friday", value1: 22, value2: 73 },
    { title: "Saturday", value1: 53, value2: 82 },
    { title: "Sunday", value1: 9, value2: 69 },
  ];

  const progressGroupExample2 = [
    { title: "Male", icon: cilUser, value: 53 },
    { title: "Female", icon: cilUserFemale, value: 43 },
  ];

  const progressGroupExample3 = [
    { title: "Organic Search", icon: cibGoogle, percent: 56, value: "191,235" },
    { title: "Facebook", icon: cibFacebook, percent: 15, value: "51,223" },
    { title: "Twitter", icon: cibTwitter, percent: 11, value: "37,564" },
    { title: "LinkedIn", icon: cibLinkedin, percent: 8, value: "27,319" },
  ];

  // Comment out tableExample array
  const tableExample = [
    // {
    //   avatar: { src: avatar1, status: "success" },
    //   user: {
    //     name: "Yiorgos Avraamu",
    //     new: true,
    //     registered: "Jan 1, 2023",
    //   },
    //   country: { name: "USA", flag: cifUs },
    //   usage: {
    //     value: 50,
    //     period: "Jun 11, 2023 - Jul 10, 2023",
    //     color: "success",
    //   },
    //   payment: { name: "Mastercard", icon: cibCcMastercard },
    //   activity: "10 sec ago",
    // },
    // ... other table items ...
  ];

  const monthlyRevenueData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh thu",
        data: dashboardData.charts.monthlyStats,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const productTypeData = {
    labels: dashboardData.charts.productTypeStats.map((stat) => stat.type),
    datasets: [
      {
        data: dashboardData.charts.productTypeStats.map((stat) => stat.count),
        backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const productTypeOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const customerGrowthData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Khách hàng mới",
        data: dashboardData.charts.customerGrowthStats,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const topProducts = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      sales: 150,
      revenue: "1.500.000đ",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      sales: 120,
      revenue: "2.400.000đ",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Khẩu trang y tế",
      sales: 200,
      revenue: "1.000.000đ",
      rating: 4.2,
    },
  ];

  return (
    <>
      <WidgetsDropdown className="mb-4" widgets={widgets} />
      {/* <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">
                January - July 2023
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === "Month"}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  "d-none d-xl-block": index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard> */}
      <CRow className="g-4">
        <CCol xs={12} lg={8}>
          <CCard className="chart-card">
            <CCardBody style={{ position: "relative" }}>
              <div className="chart-title mb-3">Doanh thu theo tháng</div>
              <div className="main-chart-placeholder">
                <Line data={monthlyRevenueData} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={4}>
          <CCard className="chart-card">
            <CCardBody>
              <div className="chart-title mb-3">Loại sản phẩm bán được</div>
              <div className="main-donut-placeholder">
                <div
                  style={{ width: "180px", height: "180px", margin: "0 auto" }}
                >
                  <Doughnut data={productTypeData} />
                </div>
                <div className="traffic-source-list mt-4">
                  {dashboardData.charts.productTypeStats.map((stat, index) => (
                    <div key={index} className="traffic-source-item">
                      <span
                        className={`dot dot-${index === 0 ? "blue" : index === 1 ? "orange" : "green"}`}
                      ></span>
                      {stat.type} <span className="percent">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-4 mt-4">
        <CCol xs={12} lg={6}>
          <CCard className="chart-card">
            <CCardBody>
              <div className="chart-title mb-3">Tăng trưởng khách hàng</div>
              <div className="main-chart-placeholder">
                <Bar data={customerGrowthData} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="chart-card">
            <CCardBody>
              <div className="chart-title mb-3">Sản phẩm bán chạy</div>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sản phẩm</CTableHeaderCell>
                    <CTableHeaderCell>Đã bán</CTableHeaderCell>
                    <CTableHeaderCell>Doanh thu</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashboardData.charts.topProducts.map((product, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{product.name}</CTableDataCell>
                      <CTableDataCell>{product.sales}</CTableDataCell>
                      <CTableDataCell>
                        {formatCurrency(product.revenue)}
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilStar} className="text-warning me-1" />
                          {Number(product.rating).toFixed(1)}
                        </div>
                      </CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
