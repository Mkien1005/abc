'use client'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, addToWishlist, addToQuickView } from '@/store/slices/productSlice'
import { CartService } from '@/services/cart_service'
import Swal from 'sweetalert2' 
import { eventBus } from '@/utils/eventBus';

const ActionButtons = (props) => {
  const dispatch = useDispatch()
  const getWishlist = useSelector((state) => state.productData.wishlistItems)
  const isWishlistAdded = getWishlist.some((data) => data.id === props.productAction.id)

  const handleAddToCart = (product) => {
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
  }

  const handleAddToWishlist = (product) => {
    dispatch(addToWishlist(product))
  }

  const quickViewHandler = (product) => {
    dispatch(
      addToQuickView({
        viewItem: product,
        quickView: true,
      })
    )
  }

  return (
    <ul className='cart-action'>
      {/* {props.wishlistBtn && props.productAction.pCate !== 'NFT' && (
        <li className='wishlist'>
          <button onClick={() => handleAddToWishlist(props.productAction)}>
            <i className={isWishlistAdded ? 'fas fa-heart' : 'far fa-heart'} />
          </button>
        </li>
      )} */}
      {props.cartBtn && (
        <li className='select-option'>
          <button className='btn-cate' onClick={() => handleAddToCart(props.productAction)}>
            Add to Cart
          </button>
        </li>
      )}
      {props.quickViewBtn && props.productAction.pCate !== 'NFT' && (
        <li className='quickview'>
          <button onClick={() => quickViewHandler(props.productAction)}>
            <i className='far fa-eye' />
          </button>
        </li>
      )}
    </ul>
  )
}

export default ActionButtons
