import Image from "next/image";
import SectionTitle from "../elements/SectionTitle";

const SplashFeatures = () => {
  const ThemeFeatures = [
    {
      title: "Được xây dựng bởi Next.js",
      icon: "/images/preview/feature-icon-10.png",
      text: "Mẫu giao diện của chúng tôi hoàn hảo cho mọi thiết bị. Được xây dựng trên nền tảng Next.js với hiệu suất cao.",
    },
    {
      title: "Các thành phần có thể tái sử dụng",
      icon: "/images/preview/feature-icon-11.png",
      text: "Tất cả các thành phần trong mẫu này đều có thể tái sử dụng. Chúng tôi đã xây dựng eTrade bằng các functional components.",
    },
    {
      title: "Tốc độ tải nhanh",
      icon: "/images/preview/feature-icon-05.png",
      text: "Tốc độ website rất quan trọng. Do đó chúng tôi đã tạo ra eTrade để website của bạn tải nhanh và có hiệu suất tốt hơn.",
    },
    {
      title: "Giao diện hoàn toàn <br /> responsive",
      icon: "/images/preview/feature-icon-01.png",
      text: "Tất cả các trang trong theme này đều responsive. Chúng tôi sử dụng framework Bootstrap để xây dựng website.",
    },
    {
      title: "Hơn 25 trang <br /> hữu ích",
      icon: "/images/preview/feature-icon-02.png",
      text: "Tất cả các trang đều được tạo dựa trên nội dung thực tế mà bạn cần để vận hành doanh nghiệp. Chỉ cần thay đổi hình ảnh và văn bản là có thể sử dụng!",
    },
    {
      title: "Hoàn toàn <br /> tùy chỉnh được",
      icon: "/images/preview/feature-icon-09.png",
      text: "Mẫu của chúng tôi hoàn toàn có thể tùy chỉnh. Bạn có thể thay đổi màu sắc, font chữ, biểu tượng, nội dung, hình ảnh, v.v. Bạn cũng có thể thêm CSS tùy chỉnh.",
    },
    {
      title: "Biểu tượng Font Awesome 5 <br /> Pro",
      icon: "/images/preview/feature-icon-03.png",
      text: "Mẫu này đi kèm với các biểu tượng chất lượng cao từ FontAwesome. Tất cả các biểu tượng đều dựa trên font và sẵn sàng phù hợp với chất lượng của mọi màn hình HQ.",
    },
    {
      title: "Font <br /> Google",
      icon: "/images/preview/feature-icon-04.png",
      text: "Một bộ sưu tập lớn các font Google được tích hợp trong theme. Bạn có thể sử dụng bất kỳ font nào phù hợp với thương hiệu của bạn.",
    },
    {
      title: "Cập nhật <br /> trọn đời",
      icon: "/images/preview/feature-icon-05.png",
      text: "Chỉ cần mua theme của chúng tôi một lần và nhận được cập nhật trọn đời. Chúng tôi liên tục cập nhật sản phẩm để theo kịp xu hướng và công nghệ mới nhất.",
    },
  ];
  return (
    <div className="pv-feature-area" id="features">
      <div className="container">
        <div className="pv-feature-box">
          <SectionTitle
            pClass="section-title-center"
            subColor="highlighter-secondary"
            subtitle="Tính năng"
            subtitleIcon="fas fa-fire"
            title="Chúng tôi có những tính năng <br/>
                ấn tượng"
          />
          <div className="row">
            {ThemeFeatures.map((data, index) => (
              <div className="col-lg-4 col-md-6 col-12" key={index}>
                <div className="pv-feature">
                  <div className="service-box">
                    <div className="icon">
                      <Image
                        src={data.icon}
                        height={48}
                        width={48}
                        alt="icon"
                      />
                    </div>
                    <div className="content">
                      <h3
                        className="title"
                        dangerouslySetInnerHTML={{ __html: data.title }}
                      ></h3>
                      <p>{data.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashFeatures;
