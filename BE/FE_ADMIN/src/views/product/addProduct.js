import React, { useState, useEffect, useRef } from "react";
import {
  CContainer,
  CForm,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CCard,
  CCardBody,
  CFormLabel,
} from "@coreui/react";
import Typography from "@mui/material/Typography";
import { getProductById } from "src/api/product";
import { useParams } from "react-router-dom";
import { getCategories } from "src/api/category";
import { getBrands } from "src/api/brand";
import { createProduct, updateProduct } from "src/api/product";
import Swal from "sweetalert2";

const AddProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    usage_instructions: "",
    contraindications: "",
    category_id: "",
    brand_id: "",
    is_featured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState(null);

  const getProduct = async (productId) => {
    try {
      setLoading(true);
      const productData = await getProductById(productId);
      const { image_url, ...productDetails } = productData;
      setImageFiles(image_url || []);
      setProductData(productDetails);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải thông tin sản phẩm!");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          await getProduct(id);
        }

        const cateResponse = await getCategories();
        setCategories(cateResponse.items);

        const brandResponse = await getBrands();
        setBrands(brandResponse.items);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu!");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "price" || name === "stock") {
      setProductData({ ...productData, [name]: value ? Number(value) : 0 });
    } else if (name === "is_featured") {
      setProductData({ ...productData, [name]: value === "true" });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    addNewFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addNewFiles(files);
    }
  };

  const addNewFiles = (files) => {
    const validImageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImageFiles.length > 0) {
      setImageFiles((prevFiles) => [...prevFiles, ...validImageFiles]);
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const formData = new FormData();

      const priceValue = productData.price ? Number(productData.price) : 0;
      formData.append("price", priceValue);

      const stockValue = productData.stock ? Number(productData.stock) : 0;
      formData.append("stock", stockValue);

      const isFeatured =
        productData.is_featured === true || productData.is_featured === "true"
          ? "true"
          : "false";
      formData.append("is_featured", isFeatured);

      Object.keys(productData).forEach((key) => {
        if (
          productData[key] !== null &&
          productData[key] !== undefined &&
          key !== "price" &&
          key !== "stock" &&
          key !== "is_featured"
        ) {
          formData.append(key, productData[key]);
        }
      });

      const newImages = [];
      const existingImages = [];

      imageFiles.forEach((file) => {
        if (file instanceof File) {
          newImages.push(file);
        } else if (typeof file === "string") {
          existingImages.push(file);
        }
      });

      newImages.forEach((file) => {
        formData.append("image_url", file);
      });

      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      let response;
      if (id) {
        response = await updateProduct(id, formData);
        Swal.fire({
          title: "Thông báo",
          text: "Sản phẩm đã được cập nhật thành công!",
          icon: "success",
        });
      } else {
        response = await createProduct(formData);
        Swal.fire({
          title: "Thông báo",
          text: "Sản phẩm đã được tạo thành công!",
          icon: "success",
        });
      }

      if (!id) {
        setProductData({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          usage_instructions: "",
          contraindications: "",
          category_id: "",
          brand_id: "",
          is_featured: false,
        });
        setImageFiles([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      if (err.response && err.response.data) {
        if (Array.isArray(err.response.data)) {
          setError(err.response.data.join(", "));
        } else if (err.response.data.message) {
          setError(`Lỗi: ${err.response.data.message}`);
        } else {
          setError("Đã có lỗi xảy ra khi lưu sản phẩm!");
        }
      } else {
        setError("Đã có lỗi xảy ra khi lưu sản phẩm!");
      }
      setLoading(false);
    }
  };


  const pageTitle = id ? "Sửa sản phẩm" : "Thêm sản phẩm";

  return (
    <CContainer>
      <CForm className="mb-4">
        <CRow className="mb-4 justify-content-between align-items-center">
          <CCol>
            <Typography variant="h2" className="mb-2" flexGrow={1}>
              {pageTitle}
            </Typography>
          </CCol>
          <CCol xs="auto">
            <CButton color="secondary" className="me-2" disabled={loading}>
              Hủy bỏ
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Đang xử lý..."
                : id
                  ? "Cập nhật sản phẩm"
                  : "Đăng sản phẩm"}
            </CButton>
          </CCol>
        </CRow>

        {error && <p className="text-danger">{error}</p>}

        <CRow className="g-4">
          <CCol md={8}>
            <h4 className="mb-3">Tên Sản Phẩm</h4>
            <CFormInput
              className="mb-4"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm..."
              required
            />

            <div className="mb-4">
              <div className="description-header d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Mô tả</h4>
                <div className="description-tools">
                  <span className="text-muted small me-2">
                    {productData.description.length}/2000 ký tự
                  </span>
                </div>
              </div>
              <div className="description-wrapper position-relative">
                <CFormTextarea
                  rows={8}
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả sản phẩm..."
                  className="form-control-modern"
                  style={{
                    resize: "none",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "1rem",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  maxLength={2000}
                />
                <style>
                  {`
                    .form-control-modern:focus {
                      border-color: #80bdff !important;
                      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.15) !important;
                    }
                    .form-control-modern:hover {
                      border-color: #b3d7ff;
                    }
                    .description-tools {
                      background: #f8f9fa;
                      padding: 4px 12px;
                      border-radius: 4px;
                      font-weight: 500;
                    }
                  `}
                </style>
              </div>
              <div className="description-footer mt-2">
                <p className="text-muted small mb-0">
                  Mô tả chi tiết về sản phẩm, bao gồm đặc điểm, công dụng và các
                  thông tin quan trọng khác.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Giá</h4>
              <CFormInput
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                placeholder="Nhập giá sản phẩm"
                min="0"
                required
              />
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Số lượng</h4>
              <CFormInput
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                placeholder="Nhập số lượng sản phẩm"
                min="0"
                required
              />
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Hướng Dẫn Sử Dụng</h4>
              <CFormTextarea
                rows={5}
                name="usage_instructions"
                value={productData.usage_instructions}
                onChange={handleChange}
                placeholder="Nhập hướng dẫn sử dụng..."
              />
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Chống Chỉ Định</h4>
              <CFormTextarea
                rows={5}
                name="contraindications"
                value={productData.contraindications}
                onChange={handleChange}
                placeholder="Nhập thông tin chống chỉ định..."
              />
            </div>

            <h4 className="mb-3">Ảnh</h4>
            <div className="mb-4">
              <div
                className={`p-4 border rounded text-center mb-3 ${isDragging ? "bg-light border-primary" : "border-light"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleOpenFileDialog}
                style={{ cursor: "pointer", minHeight: "150px" }}
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <i
                    className="fa fa-cloud-upload text-primary mb-2"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p className="mb-1">
                    Kéo và thả ảnh vào đây hoặc click để chọn
                  </p>
                  <p className="text-muted small">Hỗ trợ nhiều file ảnh</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </div>

              {imageFiles.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="border rounded position-relative overflow-hidden"
                      style={{ height: "120px", width: "120px" }}
                    >
                      <img
                        src={
                          file instanceof File
                            ? URL.createObjectURL(file)
                            : file
                        }
                        alt={`Preview ${index}`}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <CButton
                        color="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          padding: "0",
                          margin: "5px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <span style={{ fontSize: "16px", lineHeight: "0" }}>
                          ×
                        </span>
                      </CButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CCol>
          <CCol md={4}>
            <CRow className="g-3">
              <CCol xs={12}>
                <CCard className="mb-3">
                  <CCardBody>
                    <h4 className="card-title mb-4">Phân loại</h4>
                    <CRow className="g-3">
                      <CCol xs={12}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <CFormLabel className="mb-0 fw-bold">
                              Loại Thuốc
                            </CFormLabel>
                            <a className="fw-bold small" href="#!">
                              Thêm loại thuốc mới
                            </a>
                          </div>
                          <CFormSelect
                            name="category_id"
                            value={productData.category_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Chọn loại thuốc</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CCol>
                      <CCol xs={12}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <CFormLabel className="mb-0 fw-bold">
                              Thương Hiệu
                            </CFormLabel>
                            <a className="fw-bold small" href="#!">
                              Thêm thương hiệu mới
                            </a>
                          </div>
                          <CFormSelect
                            name="brand_id"
                            value={productData.brand_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Chọn thương hiệu</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CCol>
                      <CCol xs={12}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <CFormLabel className="mb-0 fw-bold">
                              Featured Product
                            </CFormLabel>
                          </div>
                          <CFormSelect
                            name="is_featured"
                            value={productData.is_featured}
                            onChange={handleChange}
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </CFormSelect>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  );
};

export default AddProduct;
