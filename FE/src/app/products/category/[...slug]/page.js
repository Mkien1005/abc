"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Section from "@/components/elements/Section";
import ProductOne from "@/components/product/ProductOne";
import { CategoryService } from "@/services/catefory_service";

const CategoryProduct = ({ params }) => {
  const [cateProduct, setCateProduct] = useState([]);
  const [catParam, setCatParam] = useState("");
  const [category, setCategory] = useState("Category Name");

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setCatParam(resolvedParams.slug[resolvedParams.slug.length - 1]);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!catParam) return;
    async function getProductsByCategory(category) {
      // Fetch products from the server
      const response = await CategoryService.getProducts(category);
      const products = await response.data.items[0].products;
      setCategory(response.data.items[0].name);
      setCateProduct(products);
    }
    getProductsByCategory(catParam);
  }, [catParam]);

  return (
    <>
      <Breadcrumb activeItem="Category" title={category} />
      <Section pClass="axil-shop-area" sectionPadding="axil-section-gapcommon">
        <div className="row row--15">
          {cateProduct && cateProduct.length > 0 ? (
            cateProduct?.map((data) => (
              <div className="col-xl-3 col-lg-4 col-sm-6" key={data.id}>
                <ProductOne product={data} />
              </div>
            ))
          ) : (
            <h2 className="text-center">Không có sản phẩm nào</h2>
          )}
        </div>
      </Section>
    </>
  );
};

export default CategoryProduct;
