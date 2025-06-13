import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import {
  createNewBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "src/api/brand";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import Pagination from "../../components/paginate";
import "./brand.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [currentBrand, setCurrentBrand] = useState({
    name: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBrands = useCallback(async () => {
    try {
      const data = await getBrands(page, limit);
      setBrands(data.items);
      setPage(data.meta.currentPage);
      setLimit(data.meta.itemPerPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenDialog = (isEdit = false, brand) => {
    if (isEdit && brand) {
      setCurrentBrand({
        name: brand.name,
        description: brand.description,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        id: brand.id,
      });
      setCurrentId(brand.id);
      setIsEditing(true);
    } else {
      setCurrentBrand({
        name: "",
        description: "",
        createdAt: "",
        updatedAt: "",
        id: "",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (id) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      handleOpenDialog(true, brand);
    }
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa thương hiệu này?",
      showCancelButton: true,
      color: "#545454",
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      cancelButtonText: "Hủy",
      cancelButtonColor: "#545454",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBrand(id);
          fetchBrands();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa thương hiệu thành công",
          });
        } catch (error) {
          console.error("Lỗi khi xóa thương hiệu:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể xóa thương hiệu",
          });
        }
      }
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBrand((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      handleCloseDialog();
      if (isEditing && currentId) {
        await updateBrand(currentId, currentBrand);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật thương hiệu thành công",
        });
      } else {
        await createNewBrand(currentBrand);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm thương hiệu mới thành công",
        });
      }
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      handleCloseDialog();
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lưu thương hiệu",
      });
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("vn").format("DD/MM/YYYY HH:mm:ss");
  };

  return (
    <div className="brand-list-container">
      <div className="brand-header">
        <Typography className="brand-title">Quản lý thương hiệu</Typography>

        <Button
          className="add-brand-btn"
          variant="contained"
          onClick={() => handleOpenDialog(false)}
        >
          Thêm thương hiệu mới
        </Button>
      </div>

      <CTable className="brand-table">
        <CTableHead>
          <CTableRow className="table-header">
            <CTableHeaderCell align="center">ID</CTableHeaderCell>
            <CTableHeaderCell align="center">Tên thương hiệu</CTableHeaderCell>
            <CTableHeaderCell align="center">Ngày tạo</CTableHeaderCell>
            <CTableHeaderCell align="center">Hành động</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {brands.map((brand, index) => (
            <CTableRow key={brand.id} className="table-row">
              <CTableDataCell className="table-cell" align="center">
                {index + 1}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                {brand.name}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                {formatDate(brand.createdAt)}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                <div className="table-actions">
                  <IconButton
                    className="action-button edit-button"
                    onClick={() => handleEdit(brand.id)}
                  >
                    <BorderColorIcon />
                  </IconButton>
                  <IconButton
                    className="action-button delete-button"
                    onClick={() => handleDelete(brand.id)}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {isEditing ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên thương hiệu"
            type="text"
            fullWidth
            variant="outlined"
            value={currentBrand.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentBrand.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Brands;
