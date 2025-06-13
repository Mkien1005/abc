'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, addToQuickView, addToWishlist } from '@/store/slices/productSlice'
import ProductRating from './ProductRating'
import SlickSlider from '@/components/elements/SlickSlider'
import ProductDiscountLabel from './ProductDiscountLabel'
import { CartService } from '@/services/cart_service'
import Swal from 'sweetalert2' 
import { eventBus } from '@/utils/eventBus';

const ProductQuickView = () => {
  const dispatch = useDispatch()
  const [quantity, setquantity] = useState(0)
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const getQuickViewItem = useSelector((state) => state.productData.quickViewItems)
  const getWishlist = useSelector((state) => state.productData.wishlistItems)
  const isWishlistAdded = getWishlist.filter((data) => data.id === getQuickViewItem.id)
  const handleAddToCart = (product) => {
    if (quantity > 0) {
      CartService.addProductToCart(product.id, quantity).then((res) => {
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
          })
    } else {
      alert('Please select minimum 1 quantity')
    }
  }

  const handleAddToWishlist = (product) => {
    dispatch(addToWishlist(product))
  }

  const decrementQuantity = () => {
    if (quantity > 0) {
      setquantity(quantity - 1)
    }
  }
  const incrementQuantity = () => {
    if (quantity == getQuickViewItem.stock) {
      alert('Không đủ số lượng hàng trong kho.')
    } else {
      setquantity(quantity + 1)
    }
  }

  const quickViewHandler = () => {
    dispatch(
      addToQuickView({
        viewItem: null,
        quickView: false,
      })
    )
  }

  return (
    <>
      <div
        className='modal fade quick-view-product show'
        tabIndex={-1}
        aria-modal='true'
        role='dialog'
        style={{ paddingRight: '17px', display: 'block' }}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button onClick={() => quickViewHandler()} className='btn-close'>
                <i className='far fa-times' />
              </button>
            </div>
            <div className='modal-body'>
              <div className='single-product-thumb'>
                <div className='row'>
                  <div className='col-lg-7 mb--40'>
                    <div className='row'>
                      <div className='col-lg-10 order-lg-2'>
                        <SlickSlider
                          class='single-product-thumbnail product-large-thumbnail axil-product thumbnail-badge'
                          slidesToShow={1}
                          infinite={false}
                          draggable={false}
                          focusOnSelect={true}
                          adaptiveHeight={true}
                          asNavFor={nav2}
                          ref={(slider1) => setNav1(slider1)}
                        >
                          {getQuickViewItem.image_url ? (
                            getQuickViewItem.image_url?.map((data, index) => (
                              <div className='thumbnail' key={index}>
                                <Image src={data} width={446} height={446} alt='Gallery Thumbnail' />
                                {getQuickViewItem.price && <ProductDiscountLabel discount={getQuickViewItem} />}
                              </div>
                            ))
                          ) : (
                            <div className='thumbnail'>
                              <Image src='/images/product/furniture/product-4.png' width={446} height={446} alt='Gallery Thumbnail' />
                              {getQuickViewItem.salePrice && <ProductDiscountLabel discount={getQuickViewItem} />}
                            </div>
                          )}
                        </SlickSlider>
                      </div>
                      <div className='col-lg-2 order-lg-1'>
                        <SlickSlider
                          class='product-small-thumb small-thumb-wrapper'
                          slidesToShow={5}
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
                          {getQuickViewItem.image_url ? (
                            getQuickViewItem.image_url?.map((data, index) => (
                              <div className='small-thumb-img' key={index}>
                                <Image src={data} width={73} height={71} alt='Gallery Thumbnail' />
                              </div>
                            ))
                          ) : (
                            <div className='small-thumb-img'>
                              <Image src='/images/product/furniture/product-4.png' width={73} height={71} alt='Gallery Thumbnail' />
                            </div>
                          )}
                        </SlickSlider>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-5 mb--40'>
                    <div className='single-product-content'>
                      <div className='inner'>
                        <ProductRating rating={getQuickViewItem} textEnable />
                        <h3 className='product-title'>{getQuickViewItem.title}</h3>
                        <span className='price-amount'>
                          {getQuickViewItem.price ? getQuickViewItem.price : getQuickViewItem.price}
                          <span className='currency-symbol'> vnđ</span>
                        </span>
                        {getQuickViewItem.description && (
                          <>
                            <ul
                              className='product-meta'
                              dangerouslySetInnerHTML={{
                                __html: '',
                              }}
                            ></ul>
                            <p className='description'>Mô tả: {getQuickViewItem.description}</p>
                          </>
                        )}
                        {getQuickViewItem.stock && <p className='description'>Kho: {getQuickViewItem.stock}</p>}
                        {getQuickViewItem.brand && <p className='description'>Thương hiệu: {getQuickViewItem.brand.name}</p>}

                        <div className='product-action-wrapper d-flex-center'>
                          {getQuickViewItem.stock > 0 && (
                            <div className='pro-qty'>
                              <span className='qtybtn' onClick={decrementQuantity}>
                                -
                              </span>
                              <input type='number' className='quantity-input' value={quantity} readOnly />
                              <span className='qtybtn' onClick={incrementQuantity}>
                                +
                              </span>
                            </div>
                          )}
                          <ul className='product-action d-flex-center mb--0'>
                            <li className='add-to-cart'>
                              {getQuickViewItem.pCate !== 'NFT' ? (
                                <button
                                  disabled={
                                    (getQuickViewItem.colorAttribute && !colorImage) || (getQuickViewItem.sizeAttribute && !productSize)
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleAddToCart(getQuickViewItem)}
                                  className='axil-btn btn-bg-primary btn-cate'
                                >
                                  Add to Cart
                                </button>
                              ) : (
                                <Link className='axil-btn btn-bg-primary' href={`/products/${getQuickViewItem.id}`}>
                                  Buy Product
                                </Link>
                              )}
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
        </div>
      </div>
      <div className='modal-backdrop fade show' onClick={() => quickViewHandler()}></div>
    </>
  )
}

export default ProductQuickView
