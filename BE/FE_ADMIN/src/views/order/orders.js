import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { getOrders } from "src/api/order";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import Pagination from "../../components/paginate";
import { useNavigate } from "react-router-dom";
import "./orders.css";
import { TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders(page, limit, searchQuery);
      setOrders(data.items);
      setPage(data.meta.currentPage);
      setLimit(data.meta.itemPerPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchValue);
    setPage(1);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (id) => {
    const order = orders.find((b) => b.id === id);
    if (order) {
      navigate(`/order-detail/${order.id}`);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("vn").format("DD/MM/YYYY HH:mm:ss");
  };

  const convertToVnd = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getPaymentMethodText = (method) => {
    const paymentMethods = {
      cod: "Thanh toán khi nhận hàng",
      bank_transfer: "Chuyển khoản ngân hàng",
    };
    return paymentMethods[method] || method;
  };
  console.log(orders);
  return (
    <div className="orders-container">
      <div className="orders-header">
        <Typography className="orders-title">Quản lý đơn hàng</Typography>
        <div className="search-container">
          <TextField
            className="search-field"
            placeholder="Tìm kiếm theo tên khách hàng hoặc giá..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            className="search-button"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <CTable className="orders-table">
        <CTableHead>
          <CTableRow className="table-header">
            <CTableHeaderCell align="center">ID</CTableHeaderCell>
            <CTableHeaderCell align="left">Khách hàng</CTableHeaderCell>
            <CTableHeaderCell align="left">Địa chỉ giao hàng</CTableHeaderCell>
            <CTableHeaderCell align="left">
              Phương thức thanh toán
            </CTableHeaderCell>
            <CTableHeaderCell className="amount-header">
              Tổng tiền
            </CTableHeaderCell>
            <CTableHeaderCell className="date-header">
              Ngày tạo
            </CTableHeaderCell>
            <CTableHeaderCell className="action-header">
              Hành động
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {orders.map((order, index) => (
            <CTableRow key={order.id} className="table-row">
              <CTableDataCell className="table-cell id-cell">
                {index + 1}
              </CTableDataCell>
              <CTableDataCell className="table-cell customer-cell">
                {order.user.fullName}
              </CTableDataCell>
              <CTableDataCell className="table-cell address-cell">
                {order.shippingAddress}
              </CTableDataCell>
              <CTableDataCell className="table-cell payment-cell">
                {getPaymentMethodText(order.paymentMethod)}
              </CTableDataCell>
              <CTableDataCell className="table-cell amount-cell">
                {convertToVnd(order.totalAmount)}
              </CTableDataCell>
              <CTableDataCell className="table-cell date-cell">
                {formatDate(order.createdAt)}
              </CTableDataCell>
              <CTableDataCell className="table-cell action-cell">
                <div className="table-actions">
                  <IconButton
                    className="action-button edit-button"
                    onClick={() => handleEdit(order.id)}
                  >
                    <BorderColorIcon />
                  </IconButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div className="pagination-container">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default Orders;
