import React, { useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import {
  createImport,
  deleteImport,
  getImports,
  updateImport,
} from "/src/api/imports";
import { getProducts } from "/src/api/product";
import { getBrands } from "/src/api/brand"; // Thêm import cho API nhà cung cấp
import Pagination from "../../components/paginate";

const InventoryImports = () => {
  const [imports, setImports] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]); // Thêm state cho danh sách nhà cung cấp
  const [currentImport, setCurrentImport] = useState({
    quantity: 0,
    cost: 0,
    brandName: "", // Đổi từ supplier sang supplierId để lưu ID
    note: "",
    productId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products for dropdown
  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      setProducts(response.items || response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  }, []);

  // Fetch suppliers for dropdown
  const fetchBrands = useCallback(async () => {
    try {
      const response = await getBrands();
      // Kiểm tra và lấy items từ response nếu có
      setBrands(response.items || response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách thương hiệu",
      });
    }
  }, []);

  // Fetch inventory imports
  const fetchImports = useCallback(async () => {
    try {
      const data = await getImports(page, limit);
      setImports(data.items);
      setPage(data.meta.currentPage);
      setLimit(data.meta.itemsPerPage);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách phiếu nhập kho",
      });
    }
  }, [page, limit]);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchBrands(); // Thêm fetch suppliers
    fetchImports();
  }, [fetchImports, fetchProducts, fetchBrands]);

  // Open dialog for adding/editing
  const handleOpenDialog = (isEdit = false, importItem = null) => {
    if (isEdit && importItem) {
      setCurrentImport({
        quantity: Number(importItem.quantity),
        cost: Number(importItem.cost),
        brandName: importItem.brandName || "", // Sử dụng supplierId
        note: importItem.note || "",
        productId: importItem.productId,
      });
      setCurrentId(importItem.id);
      setIsEditing(true);
    } else {
      setCurrentImport({
        quantity: 0,
        cost: 0,
        brandName: "",
        note: "",
        productId: "",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentImport((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "cost" ? Number(value) : value,
    }));
  };

  // Edit import record
  const handleEdit = (id) => {
    const importItem = imports.find((b) => b.id === id);
    if (importItem) {
      handleOpenDialog(true, importItem);
    }
  };

  // Delete import record
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa phiếu nhập kho này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteImport(id);
          fetchImports();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa phiếu nhập kho thành công",
          });
        } catch (error) {
          console.error("Lỗi khi xóa phiếu nhập kho:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể xóa phiếu nhập kho",
          });
        }
      }
    });
  };

  // Submit form
  const handleSubmit = async () => {
    const formattedImport = {
      ...currentImport,
      quantity: Number(currentImport.quantity),
      cost: Number(currentImport.cost),
      brandName: currentImport.brandName,
    };

    if (!formattedImport.productId) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn sản phẩm",
      });
      return;
    }

    if (!formattedImport.brandName) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn nhà cung cấp",
      });
      return;
    }

    if (
      !Number.isInteger(Number(formattedImport.quantity)) ||
      Number(formattedImport.quantity) <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Số lượng phải là số nguyên dương",
      });
      return;
    }

    if (Number(formattedImport.cost) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Giá nhập phải là số dương",
      });
      return;
    }

    try {
      handleCloseDialog();
      if (isEditing && currentId) {
        await updateImport(currentId, formattedImport);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật phiếu nhập kho thành công",
        });
      } else {
        await createImport(formattedImport);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm phiếu nhập kho mới thành công",
        });
      }
      fetchImports();
    } catch (error) {
      console.error("Lỗi khi lưu phiếu nhập kho:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lưu phiếu nhập kho",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        mx={5}
      >
        <Typography variant="h2">Phiếu Nhập Kho</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog(false)}>
          Thêm Phiếu Nhập Kho
        </Button>
      </Box>

      <CTable>
        <CTableHead>
          <CTableRow>
            {[
              "STT",
              "Sản Phẩm",
              "Số Lượng",
              "Giá Nhập",
              "Thương hiệu",
              "Ngày Nhập",
              "Hành Động",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {imports.length > 0 ? (
            imports.map((importItem, index) => (
              <CTableRow key={importItem.id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  {importItem.product?.name || "N/A"}
                </CTableDataCell>
                <CTableDataCell>{importItem.quantity}</CTableDataCell>
                <CTableDataCell>
                  {importItem.cost.toLocaleString()} VND
                </CTableDataCell>
                <CTableDataCell>
                  {brands.find((b) => b.id === importItem.brandName)?.name ||
                    "Không xác định"}
                </CTableDataCell>
                <CTableDataCell>
                  {new Date(importItem.importDate).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(importItem.id)}
                  >
                    <BorderColorIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(importItem.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={7}
                style={{ textAlign: "center", padding: "20px" }}
              >
                Không có dữ liệu
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Chỉnh Sửa Phiếu Nhập Kho" : "Thêm Phiếu Nhập Kho Mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Sản Phẩm"
            name="productId"
            value={currentImport.productId}
            onChange={handleInputChange}
            variant="standard"
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="quantity"
            label="Số Lượng"
            type="number"
            fullWidth
            variant="standard"
            value={currentImport.quantity}
            onChange={handleInputChange}
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            margin="dense"
            name="cost"
            label="Giá Nhập"
            type="number"
            fullWidth
            variant="standard"
            value={currentImport.cost}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            select
            margin="dense"
            name="brandName"
            label="Thương hiệu"
            fullWidth
            variant="standard"
            value={currentImport.brandName}
            onChange={handleInputChange}
            required
          >
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="note"
            label="Ghi Chú"
            type="text"
            fullWidth
            variant="standard"
            value={currentImport.note}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryImports;
