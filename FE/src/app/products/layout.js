"use client";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import NewsLetter from "@/components/newsletter/NewsLetter";
import Preloader from "@/components/preloader/Preloader";
import ServiceTwo from "@/components/services/ServiceTwo";

const SingleProductLayout = ({ children }) => {
  return (
    <>
    <Preloader />
      <HeaderFive headerSlider />
      <main className="main-wrapper">
        {children}
        <NewsLetter />
        <ServiceTwo />
      </main>
      <Footer />
    </>
  );
};

export default SingleProductLayout;
