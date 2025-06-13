'use client'
import SlickSlider from '@/components/elements/SlickSlider'
import ProductRating from '@/components/product/elements/ProductRating'
import { addToCart } from '@/store/slices/productSlice'
import { discountPercentage } from '@/utils'
import { formatVND } from "@/utils/formatVND"
import Image from 'next/image'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { eventBus } from '@/utils/eventBus';
import { CartService } from '@/services/cart_service'

const SingleLayoutTwo = ({ singleData }) => {
  const dispatch = useDispatch()
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const [quantity, setquantity] = useState(1)
  const colorImageHandler = (color) => {
    setColorImage(color)
  }
  const productSizeHandler = (size) => {
    setProductSize(size)
  }
  const decrementQuantity = () => {
    if (quantity > 0) {
      setquantity(quantity - 1)
    }
  }
  const incrementQuantity = () => {
    setquantity(quantity + 1)
  }
  const handleAddToCart = (cartAddedData) => {
    let product = { ...cartAddedData }

    if (quantity > 0) {
      product.cartQuantity = quantity
      // dispatch(addToCart(product))
      CartService.addProductToCart(product.id, 1).then((res) => {
            eventBus.emit("cartUpdated");  
            Swal.fire({
              title: 'Đã thêm vào giỏ hàng!',
              text: `${product.name} đã được thêm thành công.`,
              icon: 'success',
              showConfirmButton: false,
              timer: 2000 
            })
          }).catch((error) => {
            Swal.fire({
              title: 'Đã xảy ra lỗi!',
              text: 'Vui lòng thử lại sau.',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000 
            })
          }
          )
    } else {
      Swal.fire({
        title: 'Product add to cart fail!',
        text: 'Please select minimum 1 quantity.',
        icon: 'error',
      })
    }
  }

  return (
    <div className='axil-single-product-area bg-color-white'>
      <div className='single-product-thumb axil-section-gap pb--20 pb_sm--0'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6 mb--40'>
              <div className='row'>
                <div className='col-lg-10 order-lg-2'>
                  <div className='single-product-thumbnail-wrap'>
                    <SlickSlider
                      class='product-large-thumbnail single-product-thumbnail axil-product'
                      slidesToShow={1}
                      arrows={false}
                      infinite={false}
                      draggable={false}
                      focusOnSelect={true}
                      adaptiveHeight={true}
                      asNavFor={nav2}
                      ref={(slider1) => setNav1(slider1)}
                    >
                      {singleData.image_url ? (
                        singleData.image_url.map((galleryImg, index) => (
                          <div className='thumbnail' key={index}>
                            <Image src={galleryImg} height={584} width={584} alt='Gallery Image' />
                          </div>
                        ))
                      ) : (
                        <div className='thumbnail'>
                          <Image src={singleData.thumbnail} height={584} width={584} alt='Gallery Image' />
                        </div>
                      )}
                    </SlickSlider>
                    {singleData.salePrice && (
                      <div className='label-block'>
                        <div className='product-badget'>{discountPercentage(singleData.price, singleData.salePrice)}% OFF</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='col-lg-2 order-lg-1'>
                  <SlickSlider
                    class='product-small-thumb small-thumb-wrapper small-thumb-style-two'
                    slidesToShow={5}
                    arrows={false}
                    infinite={false}
                    draggable={false}
                    focusOnSelect={true}
                    vertical={true}
                    asNavFor={nav1}
                    ref={(slider2) => setNav2(slider2)}
                    responsive={[
                      {
                        breakpoint: 992,
                        settings: {
                          vertical: false,
                        },
                      },
                    ]}
                  >
                    {singleData.image_url ? (
                      singleData.image_url.map((galleryImg, index) => (
                        <div className='small-thumb-img' key={index}>
                          <Image src={galleryImg} height={207} width={213} alt='Thumb Image' />
                        </div>
                      ))
                    ) : (
                      <div className='small-thumb-img'>
                        <Image src={singleData.thumbnail} height={207} width={213} alt='Thumb Image' />
                      </div>
                    )}
                  </SlickSlider>
                </div>
              </div>
            </div>
            <div className='col-lg-6 mb--40'>
              <div className='single-product-content'>
                <div className='inner'>
                  <h2 className='product-title'>{singleData.name}</h2>
                  <span className="price-amount">
                    {formatVND(singleData.salePrice ? singleData.salePrice : singleData.price)}
                  </span>
                  <ProductRating rating={singleData} textEnable />
                  {singleData.shortDes && (
                    <>
                      <ul
                        className='product-meta'
                        dangerouslySetInnerHTML={{
                          __html: singleData.shortDes.listItem,
                        }}
                      ></ul>
                      <p>{singleData.shortDes.text}</p>
                    </>
                  )}
                  <div className='product-desc-wrapper pt_sm--60'>
                    <h4 className='primary-color mb--10 desc-heading'>Mô tả</h4>
                    {singleData.description && singleData.description}
                    <ul className='pro-des-features pro-desc-style-two'>
                      {singleData.description?.listDesc?.map((data, index) => (
                        <li className='single-features' key={index}>
                          <div className='icon'>
                            <Image src={data.icon} width={30} height={34} alt='icon' />
                          </div>
                          {data.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='product-action-wrapper pt--40 d-flex-center'>
                    <div className='pro-qty'>
                      <span className='qtybtn' onClick={decrementQuantity}>
                        -
                      </span>
                      <input type='number' className='quantity-input' value={quantity} readOnly />
                      <span className='qtybtn' onClick={incrementQuantity}>
                        +
                      </span>
                    </div>
                    <ul className='product-action d-flex-center mb--0'>
                      <li className='add-to-cart'>
                        <button
                          disabled={(singleData.colorAttribute && !colorImage) || (singleData.sizeAttribute && !productSize) ? true : false}
                          onClick={() => handleAddToCart(singleData)}
                          className='axil-btn btn-bg-primary btn-cate'
                        >
                          Add to Cart
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleLayoutTwo
