'use client'
import NewArrivalsSection from '@/app/products/NewArrivalsSection'
import CategoryMedical from '@/components/category/CategoryJewellery'
import Section from '@/components/elements/Section'
import SectionTitle from '@/components/elements/SectionTitle'
import SlickSlider from '@/components/elements/SlickSlider'
import FeatureHighlightSection from '@/components/FeatureHighlightSection'
import Footer from '@/components/footer/Footer'
import HeaderFive from '@/components/header/HeaderFive'
import BannerFour from '@/components/hero-banner/BannerFour'
import NewsLetter from '@/components/newsletter/NewsLetter'
import PosterTwo from '@/components/poster/PosterTwo'
import Preloader from '@/components/preloader/Preloader'
import ProductFour from '@/components/product/ProductFour'
import ServiceTwo from '@/components/services/ServiceTwo'
import ProductsData from '@/data/Products'
import { ProductService } from '@/services/product_service'
import { slugify } from '@/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const HomeJewellery = () => {
  const pathname = usePathname()
  const [products, SetProducts] = useState()
  const split = pathname.split('/')
  const pageCategory = split[split.length - 1]
  useEffect(() => {
    async function getProducts() {
      const res = await ProductService.getProducts() //get data từ BE
      const data = await res.data
      return data.items
    }
    getProducts().then((data) => SetProducts(data)) // bỏ dta ra giao diện
  }, [])
  const jewelleryProduct = ProductsData.filter((data) => slugify(data.pCate) === pageCategory)
  return (
    <>
      <Preloader />
      <HeaderFive />
      <main className='main-wrapper'>
        <CategoryMedical showImage={false} showTitle={false} isSlider={false} />
        <BannerFour />
        <FeatureHighlightSection />
        <CategoryMedical showImage={true} showTitle={true} isSlider={true} />
        <PosterTwo
          section='axil-section-gap pb--0'
          row='g-lg-5 g-4'
          leftThumb='/images/product/poster/banner-3.jpg'
          rightThumb='/images/product/poster/banner-2.jpg'
        />

        {products && <NewArrivalsSection products={products} />}

        <Section pClass='pb--80 pt--80'>
        <SectionTitle title='Sản phẩm bán chạy' subColor='highlighter-primary' />
          <SlickSlider
            class='slick-layout-wrapper--30 axil-slick-arrow arrow-top-slide'
            slidesToShow={4}
            autoplay={true}
            autoplaySpeed={2500}
            arrows={false}
            infinite={true}
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
            {products && products.slice().sort(() => Math.random() - 0.5).map((data) => <ProductFour product={data} key={data.id} />)}
          </SlickSlider>
        </Section>
        <NewsLetter bgImage='bg_image--11' />
        <ServiceTwo />
      </main>
      <Footer />
    </>
  )
}

export default HomeJewellery
