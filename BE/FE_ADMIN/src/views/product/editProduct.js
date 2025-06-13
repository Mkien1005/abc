import React, { useState, useEffect } from "react";
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

const EditProduct = () => {
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

  // Hàm giả lập getProductById (thay bằng API call thực tế)
  const getProduct = async (productId) => {
    try {
      setLoading(true);
      // Giả lập dữ liệu trả về từ API (thay bằng fetch thực tế)
      const mockProduct = await getProductById(productId);
      setImageFiles(mockProduct?.image_url);
      setProductData(mockProduct);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải thông tin sản phẩm!");
      setLoading(false);
    }
  };

  // Gọi API khi có id
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          await getProduct(id);
        }

        const cate = await getCategories();
        setCategories(cate.items);

        const res = await getBrands();
        setBrands(res.items);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Xử lý submit sản phẩm (thêm hoặc sửa tùy theo id)
      console.log("Product data:", productData);
      console.log("Image files:", imageFiles);
      // Sau khi xử lý xong
      setLoading(false);
    } catch (err) {
      setError("Đã có lỗi xảy ra!");
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
              Discard
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Publishing..."
                : id
                  ? "Cập nhật sản phẩm"
                  : "Publish product"}
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
              placeholder="Write title here..."
              required
            />

            <div className="mb-4">
              <h4 className="mb-3">Mô tả</h4>
              <CFormTextarea
                rows={8}
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Write a description here..."
              />
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Gi á</h4>
              <CFormInput
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                placeholder="Enter price"
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
                placeholder="Enter stock quantity"
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
                placeholder="Write usage instructions here..."
              />
            </div>

            <div className="mb-4">
              <h4 className="mb-3">Chống Chỉ Định</h4>
              <CFormTextarea
                rows={5}
                name="contraindications"
                value={productData.contraindications}
                onChange={handleChange}
                placeholder="Write contraindications here..."
              />
            </div>

            <h4 className="mb-3">Ảnh</h4>
            <div className="mb-4 p-4 border border-light rounded">
              <div className="d-flex flex-wrap mb-3">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="border rounded d-flex align-items-center justify-content-center position-relative me-2 mb-2"
                    style={{ height: "80px", width: "80px" }}
                  >
                    <img
                      src={id ? file : URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                    <CButton
                      color="light"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      style={{ padding: "0.15rem 0.35rem" }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </CButton>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-medium-emphasis mb-2">
                  Thả hoặc chọn ảnh vào đây
                </p>
                <CFormInput
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <CRow className="g-3">
              <CCol xs={12}>
                <CCard className="mb-3">
                  <CCardBody>
                    <h4 className="card-title mb-4">Chọn</h4>
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

export default EditProduct;
