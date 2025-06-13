import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import { deleteProduct, getProducts } from "src/api/product";
import ImageCarousel from "./imageCarousel";
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
import "./productList.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts(page, limit);
      setProducts(data.items);
      setPage(data.meta.currentPage);
      setLimit(data.meta.itemPerPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenDialog = (isEdit = false, id) => {
    const path = isEdit ? `/product/edit/${id}` : `/product/add`;
    navigate(path);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa sản phẩm này?",
      showCancelButton: true,
      color: "#545454",
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      cancelButtonText: "Hủy",
      cancelButtonColor: "#545454",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id);
          fetchProducts();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa sản phẩm thành công",
          });
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể xóa sản phẩm",
          });
        }
      }
    });
  };

  const convertToVnd = (number) => {
    const formatted = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
    return formatted.replace("₫", "VNĐ");
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("vn").format("DD/MM/YYYY HH:mm:ss");
  };

  const getStatusBadgeClass = (status) => {
    return status === "active" ? "status-active" : "status-inactive";
  };

  return (
    <div className="product-list-container">
      <div className="product-header">
        <Typography className="product-title">Quản lý sản phẩm</Typography>

        <Button
          className="add-product-btn"
          variant="contained"
          onClick={() => handleOpenDialog(false)}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      <CTable className="product-table">
        <CTableHead>
          <CTableRow className="table-header">
            <CTableHeaderCell align="center">ID</CTableHeaderCell>
            <CTableHeaderCell align="center">Tên</CTableHeaderCell>
            <CTableHeaderCell align="center">Giá (vnđ)</CTableHeaderCell>
            <CTableHeaderCell align="center">Mô tả</CTableHeaderCell>
            <CTableHeaderCell align="center">Số lượng</CTableHeaderCell>
            <CTableHeaderCell align="center">Hình ảnh</CTableHeaderCell>
            <CTableHeaderCell align="center">Trạng thái</CTableHeaderCell>
            <CTableHeaderCell align="center">Nổi bật</CTableHeaderCell>
            <CTableHeaderCell align="center">Ngày tạo</CTableHeaderCell>
            <CTableHeaderCell align="center">Hành động</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {products.map((product, index) => (
            <CTableRow key={product.id} className="table-row">
              <CTableDataCell className="table-cell id-cell">
                {index + 1}
              </CTableDataCell>
              <CTableDataCell className="table-cell name-cell">
                {product.name}
              </CTableDataCell>
              <CTableDataCell className="table-cell price-cell">
                {convertToVnd(product.price)}
              </CTableDataCell>
              <CTableDataCell className="table-cell description-cell">
                {product.description}
              </CTableDataCell>
              <CTableDataCell className="table-cell stock-cell">
                {product.stock}
              </CTableDataCell>
              <CTableDataCell className="table-cell image-cell">
                <ImageCarousel images={product.image_url} />
              </CTableDataCell>
              <CTableDataCell className="table-cell status-cell">
                <span
                  className={`status-badge ${getStatusBadgeClass(product.status)}`}
                >
                  {product.status}
                </span>
              </CTableDataCell>
              <CTableDataCell className="table-cell featured-cell">
                <span className="featured-badge">
                  {product.is_featured ? "Có" : "Không"}
                </span>
              </CTableDataCell>
              <CTableDataCell className="table-cell date-cell">
                {formatDate(product.createdAt)}
              </CTableDataCell>
              <CTableDataCell className="table-cell action-cell">
                <div className="table-actions">
                  <IconButton
                    className="action-button edit-button"
                    onClick={() => handleOpenDialog(true, product.id)}
                  >
                    <BorderColorIcon />
                  </IconButton>
                  <IconButton
                    className="action-button delete-button"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon />
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

export default Products;
