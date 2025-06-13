import { cookies } from "next/headers";
import ProductDetailsClient from "./ProductDetailsClient";
import { ProductService } from "@/services/product_service";

export default async function ProductDetails({ params }) {
  params = await params;
  const { id } = params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    return <div>Vui lòng đăng nhập để xem sản phẩm</div>;
  }

  try {
    const response = await ProductService.getProductByIdPage(id, accessToken);
    const product = response?.data?.item || response?.data;

    const productsResponse = await ProductService.getProductsPage(
      { page: 1, limit: 10, name: "" },
      accessToken
    );

    const products = productsResponse?.data?.items || [];

    if (!product) {
      return <div>Không tìm thấy sản phẩm</div>;
    }
    // console.log("Sản phẩm:", product);
    return <ProductDetailsClient product={product} products={products} />;
    // return <ProductDetailsClient params={params} />;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return <div>Không tìm thấy sản phẩm</div>;
  }
}
