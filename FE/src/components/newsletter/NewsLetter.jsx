import SectionTitle from "../elements/SectionTitle";

const NewsLetter = (props) => {
  return (
    <div className="axil-newsletter-area axil-section-gap pt--0">
      <div className="container">
        <div
          className={`ctf-background-newsletter etrade-newsletter-wrapper bg_image`}
        >
          <div className="newsletter-content">
            
            <div className="input-group newsletter-form">
              <div className="position-relative newsletter-inner mb--15">
                <input placeholder="example@gmail.com" type="text" />
              </div>
              <button type="submit" className="axil-btn mb--15">
                Nhận thông báo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
