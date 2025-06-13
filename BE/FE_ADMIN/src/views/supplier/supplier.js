import { useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "src/api/suppliers";
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
import "./supplier.css";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
    id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    try {
      const data = await getSuppliers(); // Không phân trang
      setSuppliers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleOpenDialog = (isEdit = false, supplier) => {
    if (isEdit && supplier) {
      setCurrentSupplier({
        name: supplier.name,
        contact: supplier.contact,
        address: supplier.address,
        email: supplier.email || "",
        id: supplier.id,
      });
      setCurrentId(supplier.id);
      setIsEditing(true);
    } else {
      setCurrentSupplier({
        name: "",
        contact: "",
        address: "",
        email: "",
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
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      handleOpenDialog(true, supplier);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa nhà cung cấp này?",
      showCancelButton: true,
      color: "#545454",
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      cancelButtonText: "Hủy",
      cancelButtonColor: "#545454",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSupplier(id);
          fetchSuppliers();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa nhà cung cấp thành công",
          });
        } catch (error) {
          console.error("Lỗi khi xóa nhà cung cấp:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể xóa nhà cung cấp",
          });
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      handleCloseDialog();
      if (isEditing && currentId) {
        await updateSupplier(currentId, currentSupplier);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật nhà cung cấp thành công",
        });
      } else {
        await createSupplier(currentSupplier);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm nhà cung cấp mới thành công",
        });
      }
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      handleCloseDialog();
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lưu nhà cung cấp",
      });
    }
  };

  return (
    <div className="supplier-list-container">
      <div className="supplier-header">
        <Typography className="supplier-title">Nhà cung cấp</Typography>

        <Button
          className="add-supplier-btn"
          variant="contained"
          onClick={() => handleOpenDialog(false)}
        >
          Thêm nhà cung cấp mới
        </Button>
      </div>

      <CTable className="supplier-table">
        <CTableHead>
          <CTableRow className="table-header">
            {[
              "ID",
              "Tên nhà cung cấp",
              "Liên hệ",
              "Địa chỉ",
              "Email",
              "Hành động",
            ].map((header) => (
              <CTableHeaderCell
                key={header}
                className="table-cell"
                align={header === "Hành động" ? "center" : "left"}
              >
                {header}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier, index) => (
              <CTableRow key={supplier.id} className="table-row">
                <CTableDataCell className="table-cell">
                  {index + 1}
                </CTableDataCell>
                <CTableDataCell className="table-cell">
                  {supplier.name}
                </CTableDataCell>
                <CTableDataCell className="table-cell">
                  {supplier.contact}
                </CTableDataCell>
                <CTableDataCell className="table-cell">
                  {supplier.address}
                </CTableDataCell>
                <CTableDataCell className="table-cell">
                  {supplier.email || "N/A"}
                </CTableDataCell>
                <CTableDataCell className="table-cell">
                  <div className="table-actions">
                    <IconButton
                      className="action-button edit-button"
                      onClick={() => handleEdit(supplier.id)}
                    >
                      <BorderColorIcon />
                    </IconButton>
                    <IconButton
                      className="action-button delete-button"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={6}
                className="table-cell"
                style={{ textAlign: "center", padding: "20px" }}
              >
                Không có dữ liệu
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {isEditing ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp mới"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên nhà cung cấp"
            type="text"
            fullWidth
            variant="outlined"
            value={currentSupplier.name}
            onChange={handleInputChange}
            className="text-field"
          />
          <TextField
            margin="dense"
            name="contact"
            label="Liên hệ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentSupplier.contact}
            onChange={handleInputChange}
            className="text-field"
          />
          <TextField
            margin="dense"
            name="address"
            label="Địa chỉ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentSupplier.address}
            onChange={handleInputChange}
            className="text-field"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={currentSupplier.email}
            onChange={handleInputChange}
            className="text-field"
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

export default Suppliers;
