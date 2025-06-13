"use client";
import { useState, useEffect } from "react";
import Section from "@/components/elements/Section";
import ProductOne from "@/components/product/ProductOne";
import { slugify } from "@/utils";
import { CategoryService } from "@/services/catefory_service";
import { ProductService } from "@/services/product_service";
import Swal from "sweetalert2";
import { BrandService } from "@/services/brand_service";

const ShopWithSidebar = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [Products, setProducts] = useState([]);
  const [productShow, setProductShow] = useState(9);
  const [cateToggle, setcateToggle] = useState(true);
  const [brandToggle, setbrandToggle] = useState(true);
  const [priceRangeToggle, setpriceRangeToggle] = useState(true);
  const [categoryShow, setCategoryShow] = useState([]);
  const [brandShow, setBrandShow] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    CategoryService.getCategories()
      .then((res) => {
        setCategoryShow(res.data.items);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      });
    BrandService.getBrands()
      .then((res) => {
        setBrandShow(res.data.items);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      });
    ProductService.getProducts()
      .then((res) => {
        setProducts(res.data.items);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      });
  }, []);
  useEffect(() => {
    let filtered = Products;

    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        slugify(product.category.id).includes(selectedCategory)
      );
    }

    if (selectedPrice !== null) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPrice.min &&
          product.price <= selectedPrice.max
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand.id === selectedBrand
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPrice, Products, selectedBrand]);

  const categoryHandler = (cateSelect) => {
    setSelectedCategory(cateSelect);
  };
  const brandHandler = (cateSelect) => {
    setSelectedBrand(cateSelect);
  };
  const priceRangeHandler = (rangeSelect) => {
    setSelectedPrice(rangeSelect);
  };

  const ProductShowHandler = () => {
    setProductShow(productShow + 3);
  };

  const productFilterReset = () => {
    setSelectedCategory(null);
    setSelectedPrice(null);
    setSelectedBrand(null);
    setFilteredProducts(Products);
  };

  const priceRangeData = [
    { label: "Dưới 50.000₫", min: 0, max: 50000 },
    { label: "50.000₫ - 200.000₫", min: 50000, max: 200000 },
    { label: "200.000₫ - 500.000₫", min: 200000, max: 500000 },
    { label: "Trên 500.000₫", min: 500000, max: Infinity },
  ];

  return (
    <Section pClass="axil-shop-area">
      <div className="row">
        <div className="col-lg-3">
          <div className="axil-shop-sidebar">
            <div className="d-lg-none">
              <button className="sidebar-close filter-close-btn">
                <i className="fas fa-times" />
              </button>
            </div>
            {/* Category Filter */}
            <div
              className={`toggle-list product-categories ${
                cateToggle ? "active" : ""
              }`}
            >
              <h6 onClick={() => setcateToggle(!cateToggle)} className="title">
                Loại thuốc
              </h6>
              {cateToggle && (
                <div className="shop-submenu">
                  <ul>
                    {categoryShow &&
                      categoryShow.map((data, index) => (
                        <li
                          className={
                            selectedCategory === slugify(data.id)
                              ? "current-cat"
                              : ""
                          }
                          key={index}
                        >
                          <button
                            className="btn-cate"
                            onClick={() => categoryHandler(slugify(data.id))}
                          >
                            {data.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div
              className={`toggle-list product-categories ${
                cateToggle ? "active" : ""
              }`}
            >
              <h6
                onClick={() => setbrandToggle(!brandToggle)}
                className="title"
              >
                Thương hiệu
              </h6>
              {cateToggle && (
                <div className="shop-submenu">
                  <ul>
                    {categoryShow &&
                      brandShow.map((data, index) => (
                        <li
                          className={
                            selectedBrand === slugify(data.id)
                              ? "current-cat"
                              : ""
                          }
                          key={index}
                        >
                          <button
                            className="btn-cate"
                            onClick={() => brandHandler(slugify(data.id))}
                          >
                            {data.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price Filter  */}
            <div
              className={`toggle-list product-price-range ${
                priceRangeToggle ? "active" : ""
              }`}
            >
              <h6
                onClick={() => setpriceRangeToggle(!priceRangeToggle)}
                className="title"
              >
                Giá
              </h6>
              <div className="shop-submenu">
                <ul>
                  {priceRangeData.map((range, index) => (
                    <li
                      className={
                        selectedPrice?.min === range.min &&
                        selectedPrice?.max === range.max
                          ? "chosen"
                          : ""
                      }
                      key={index}
                    >
                      <button onClick={() => priceRangeHandler(range)}>
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="axil-btn btn-bg-primary"
              onClick={() => productFilterReset()}
            >
              All Reset
            </button>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="row row--15">
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, productShow).map((data) => (
                <div className="col-xl-4 col-sm-6" key={data.id}>
                  <ProductOne product={data} pClass="mb--30" />
                </div>
              ))
            ) : (
              <h4 className="text-center pt--30">Không có sản phẩm nào</h4>
            )}
          </div>
          <div className="text-center pt--20">
            <button
              className={`axil-btn btn-bg-lighter btn-load-more ${
                filteredProducts.length < productShow ? "disabled" : ""
              }`}
              onClick={ProductShowHandler}
            >
              {filteredProducts.length < productShow
                ? "Hết sản phẩm"
                : "Xem thêm sản phẩm"}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ShopWithSidebar;
