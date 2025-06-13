import Section from "../elements/Section";
import SectionTitle from "../elements/SectionTitle";
import Image from "next/image";
import { TestimonialData } from "@/data/Testimonial";
import SlickSlider from "../elements/SlickSlider";

const TestimonialOne = () => {
  return (
    <Section pClass="bg-vista-white">
      <SectionTitle
        title="Đánh giá của khách hàng"
        subColor="highlighter-secondary"
      />
      <SlickSlider
        class="testimonial-style-one-wrapper slick-layout-wrapper--20 axil-slick-arrow arrow-top-slide"
        responsive={[
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ]}
      >
        {TestimonialData.map((data, index) => (
          <div className="testimonial-style-one" key={index}>
            <div>
              <div className="review-speech">
                <p>{data.reviewText}</p>
              </div>
              <div className="media">
                <div className="thumbnail">
                  <Image
                      src={data.authorThumb}
                      width={60}
                      height={60}
                      alt={data.authorName}
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </div>
                <div className="media-body">
                  <span className="designation">{data.authorDesignation}</span>
                  <h6 className="title">{data.authorName}</h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </SlickSlider>
    </Section>
  );
};

export default TestimonialOne;
