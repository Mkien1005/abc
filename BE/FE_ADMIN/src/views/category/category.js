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
  createNewCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "src/api/category";
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
import "./category.css";

const CategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null > null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories(page, limit);
      setCategories(data.items);
      setPage(data.meta.currentPage);
      setLimit(data.meta.itemPerPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại thuốc:", error);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const handleOpenDialog = (isEdit = false, category) => {
    if (isEdit && category) {
      setCurrentCategory({
        name: category.name,
        description: category.description,
        id: category.id,
      });
      setCurrentId(category.id);
      setIsEditing(true);
    } else {
      setCurrentCategory({
        name: "",
        description: "",
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
    const category = categories.find((b) => b.id === id);
    if (category) {
      handleOpenDialog(true, category);
    }
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa loại thuốc này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id);
          fetchCategories();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa loại thuốc thành công",
          });
        } catch (error) {
          console.error("Lỗi khi xóa loại thuốc:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể xóa loại thuốc",
          });
        }
      }
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      handleCloseDialog();
      if (isEditing && currentId) {
        await updateCategory(currentId, currentCategory);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật loại thuốc thành công",
        });
      } else {
        await createNewCategory(currentCategory);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm loại thuốc mới thành công",
        });
      }
      fetchCategories();
    } catch (error) {
      handleCloseDialog();
      console.error("Error saving category:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lưu loại thuốc",
      });
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("vn").format("DD/MM/YYYY HH:mm:ss");
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <Typography className="category-title">Quản lý loại thuốc</Typography>

        <Button
          className="add-button"
          variant="contained"
          onClick={() => handleOpenDialog(false)}
        >
          Thêm loại thuốc mới
        </Button>
      </div>

      <CTable className="category-table">
        <CTableHead>
          <CTableRow className="table-header">
            <CTableHeaderCell align="center">ID</CTableHeaderCell>
            <CTableHeaderCell align="center">Tên loại thuốc</CTableHeaderCell>
            <CTableHeaderCell align="center">Mô tả</CTableHeaderCell>
            <CTableHeaderCell align="center">Hành động</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={category.id} className="table-row">
              <CTableDataCell className="table-cell" align="center">
                {index + 1}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                {category.name}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                {category.description}
              </CTableDataCell>
              <CTableDataCell className="table-cell" align="center">
                <div className="action-buttons">
                  <IconButton
                    className="action-button edit-button"
                    onClick={() => handleEdit(category.id)}
                  >
                    <BorderColorIcon />
                  </IconButton>
                  <IconButton
                    className="action-button delete-button"
                    onClick={() => handleDelete(category.id)}
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
          {isEditing ? "Cập nhật loại thuốc" : "Thêm loại thuốc mới"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên loại thuốc"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCategory.name}
            onChange={handleInputChange}
            className="dialog-field"
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
            value={currentCategory.description}
            onChange={handleInputChange}
            className="dialog-field"
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="add-button"
          >
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryView;
