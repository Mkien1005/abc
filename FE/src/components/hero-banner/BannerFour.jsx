import Link from "next/link";
import { JewellerySlider } from "@/data/Slider";
import HeaderFive from "../header/HeaderFive";
const BannerFour = () => {
  return (
    <div className="ctf-banner-page axil-main-slider-area main-slider-style-7">
      <div className="container"> 
        <div className="row align-items-center">
          <div className="col-sm-8">
            <div className="main-slider-content">
              <span className="subtitle">
                <i className={JewellerySlider.subIcon} />
                {JewellerySlider.subtitle}
              </span>
              <h1 className="title">{JewellerySlider.title}</h1>
              <p>{JewellerySlider.text}</p>
              <div className="shop-btn">
                <Link
                  href="/shop"
                  className="ctf-button axil-btn"
                  style={{ backgroundColor: "#155D9E", color: "white" }}
                >
                  Khám phá sản phẩm <i className="ctf-icon-arrow fal fa-long-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default BannerFour;
