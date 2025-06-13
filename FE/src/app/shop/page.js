import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import NewsLetter from "@/components/newsletter/NewsLetter";
import Preloader from "@/components/preloader/Preloader";
import ServiceTwo from "@/components/services/ServiceTwo";
import ShopNoSidebar from "./ShopNoSidebar";
import ShopWithSidebar from "./ShopWithSidebar";

const Shop = ({ searchParams }) => {
  return (
    <>
      <Preloader />
      <HeaderFive headerCampaign />
      <Breadcrumb activeItem="Shop" title="Danh sách sản phẩm" />
      <main className="main-wrapper">
        {searchParams.layout === "no-sidebar" ? (
          <ShopNoSidebar />
        ) : (
          <ShopWithSidebar />
        )}
        <NewsLetter />
        <ServiceTwo />
      </main>
      <Footer />
    </>
  );
};

export default Shop;
