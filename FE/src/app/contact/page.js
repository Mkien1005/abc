"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import ServiceTwo from "@/components/services/ServiceTwo";
import { StoreInfo } from "@/data/Common";
import Preloader from "@/components/preloader/Preloader";

const ContactUs = () => {
  const [result, showresult] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const sendEmail = (formData) => {
    emailjs
      .send(
        "service_g3aufzu",
        "template_sk4dqiz",
        formData,
        "9L_sRsO66U253zcxC",
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        },
      );
    reset();
    showresult(true);
  };

  setTimeout(() => {
    showresult(false);
  }, 2000);

  return (
    <>
      <Preloader />
      <HeaderFive headerSlider />
      <main className="main-wrapper">
        <Breadcrumb activeItem="Contact" title="Liên hệ với chúng tôi" />
        <div className="axil-contact-page-area axil-section-gap">
          <div className="container">
            <div className="axil-contact-page">
              <div className="row row--30">
                <div className="col-lg-8">
                  <div className="contact-form">
                    <div>
                      <h3 className="title mb--10 pb-5">
                        Gửi email phản hồi tại đây
                      </h3>

                      <form onSubmit={handleSubmit(sendEmail)}>
                        <div className="row row--10">
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label>
                                Tên <span>*</span>
                              </label>
                              <input
                                type="text"
                                {...register("name", { required: true })}
                              />
                              {errors.name && (
                                <p className="error">Vui lòng nhập tên.</p>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label>
                                Điện thoại <span>*</span>
                              </label>
                              <input
                                type="text"
                                {...register("phone", { required: true })}
                              />
                              {errors.phone && (
                                <p className="error">Vui lòng nhập số điện thoại.</p>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-group">
                              <label>
                                Email <span>*</span>
                              </label>
                              <input
                                type="email"
                                {...register("email", { required: true })}
                              />
                              {errors.email && (
                                <p className="error">Vui lòng nhập email.</p>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Tin nhắn của bạn</label>
                              <textarea
                                {...register("message")}
                                cols={1}
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group mb--0">
                              <button
                                name="submit"
                                type="submit"
                                className="axil-btn btn-bg-primary"
                              >
                                Gửi tin nhắn
                              </button>
                              {result && (
                                <p className="success">
                                  Tin nhắn đã được gửi thành công
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-location mb--40">
                    <h4 className="title mb--20">Cửa hàng của chúng tôi</h4>
                    <span className="address mb--20">{StoreInfo.address}</span>
                    <span className="phone">Điện thoại: {StoreInfo.phone}</span>
                    <span className="email">Email: {StoreInfo.email}</span>
                  </div>
                  <div className="contact-career mb--40">
                    <h4 className="title mb--20">Tuyển dụng</h4>
                    <p>
                      Thay vì mua sáu thứ, hãy mua một thứ mà bạn thực sự thích.
                    </p>
                  </div>
                  <div className="opening-hour">
                    <h4 className="title mb--20">Giờ mở cửa:</h4>
                    <p>
                      Thứ Hai đến Thứ Bảy: {StoreInfo.opening.monToSat}
                      <br /> Chủ Nhật: {StoreInfo.opening.othersDay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="axil-google-map-wrap axil-section-gap pb--0">
              <div className="mapouter">
                <div className="gmap_canvas">
                  {/* <iframe
                    width={1080}
                    height={500}
                    id="gmap_canvas"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3725.464671421843!2d105.7840919!3d20.9740027!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acd3777cffff%3A0xbbf9d17cfb0e9269!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gxJDhuqd1IFTGsCBUY29waGFy!5e0!3m2!1svi!2s!4v1742545128986!5m2!1svi!2s" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  /> */}


                  <iframe
                    width={1080}
                    height={500}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5528.270068974778!2d105.64617275!3d21.9122718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36cb2c5438fd3b1f%3A0x656c812f337c1880!2zVHJ1bmcgS2nDqm4sIENo4bujIENodSwgxJDhu4tuaCBIw7NhLCBUaMOhaSBOZ3V5w6pu!5e1!3m2!1svi!2s!4v1748457541498!5m2!1svi!2s" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ServiceTwo />
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
