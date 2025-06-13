import Section from '@/components/elements/Section'
import SectionTitle from '@/components/elements/SectionTitle'
import SlickSlider from '@/components/elements/SlickSlider'
import ProductFour from '@/components/product/ProductFour'

const NewArrivalsSection = ({ products }) => {
  if (!products || products.length === 0) return null

  return (
    <Section pClass='axil-new-arrivals-product-area fullwidth-container pb--80 pt--80' containerClass='ml--xxl-0' borderBottom='pb--50'>
      <SectionTitle title='Sản phẩm mới' subColor='highlighter-primary' />
      <SlickSlider
        class='slick-layout-wrapper--15 axil-slick-arrow arrow-top-slide'
        slidesToShow={4}
        infinite={true}
        autoplay={true}
        arrows={false}
        autoplaySpeed={3000}
        
        responsive={[
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ]}
      >
        {products.map((data) => <ProductFour product={data} key={data.id} />)}
      </SlickSlider>
    </Section>
  )
}

export default NewArrivalsSection