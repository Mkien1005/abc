'use client'
import ProductOne from '@/components/product/ProductOne'
import SlickSlider from '@/components/elements/SlickSlider'
import SingleLayouThree from './SingleLayouThree'
import Section from '@/components/elements/Section'
import SectionTitle from '@/components/elements/SectionTitle'
import SingleLayouSeven from './SingleLayouSeven'
import SingleLayoutOne from './SingleLayoutOne'
import SingleLayoutTwo from './SingleLayoutTwo'
import SingleLayoutFour from './SingleLayoutFour'
import { useEffect, useState } from 'react'
import { ProductService } from '@/services/product_service'
import Swal from 'sweetalert2'

function ProductDetailsClient({ product, products }) {
  // const [product, setProduct] = useState({})
  // const [products, setProducts] = useState({})

  // useEffect(() => {
    // async function getProduct(id) {
    //   ProductService.getProductById(id)
    //     .then((product) => {
    //       console.log(product)
    //       setProduct(product)
    //     })
    //     .catch((error) => {
    //       Swal.fire({
    //         title: 'Error',
    //         text: error.response.data.message,
    //         icon: 'error',
    //       }).then(() => {
    //         window.location.href = '/'
    //       })
    //     })
    // }
    // async function getProducts() {
    //   ProductService.getProducts()
    //     .then((data) => {
    //       setProducts(data)
    //     })
    //     .catch((error) => {
    //       Swal.fire({
    //         title: 'Error',
    //         text: error.response.data.message,
    //         icon: 'error',
    //       }).then(() => {
    //         window.location.href = '/'
    //       })
    //     })
    // }
    // getProduct(params.id)
    // getProducts()
  // }, [])

  const ProductSingleLayout = () => {
    // switch (product && product.data?.category?.name) {
    switch (product && product?.category?.name) {
      case 'NFT':
        return <SingleLayouSeven singleData={product} />
      case 'Electronics':
        return <SingleLayouThree singleData={product} />
      case 'Fashion':
        return <SingleLayoutOne singleData={product} />
      case 'Furniture':
        return <SingleLayoutFour singleData={product} />
      default:
        return <SingleLayoutTwo singleData={product} />
    }
  }
  return (
    <>
      <ProductSingleLayout />
      <Section pClass='pb--50 pb_sm--30'>
        <div className='product-contraindications'>
          {/* Chống chỉ định */}
          {product.contraindications && (
            <div className='mb-4'>
              <h4 className='mb-3'>Chống Chỉ Định</h4>
              <ul className='pro-contraindications'>{product.contraindications}</ul>
            </div>
          )}
        </div>
        {/* Hướng dẫn sử dụng */}
        {product.usage_instructions && (
          <div className='mb-4'>
            <h4 className='mb-3'>Hướng Dẫn Sử Dụng</h4>
            <ul className='pro-contraindications'>{product.usage_instructions}</ul>
          </div>
        )}
        <SlickSlider
          class='recent-product-activation slick-layout-wrapper--15 axil-slick-arrow arrow-top-slide'
          slidesToShow={4}
          infinite={false}
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
          {products && products?.map((data) => <ProductOne product={data} key={data.id} />)}
        </SlickSlider>
      </Section>
    </>
  )
}

export default ProductDetailsClient 