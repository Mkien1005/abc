import Link from 'next/link'
import Image from 'next/image'
import ProductDiscountLabel from './ProductDiscountLabel'
import ActionButtons from './ActionButtons'

const ProductThumbnail = (props) => {
  return (
    <div className='thumbnail'>
      <Link href={`/products/${props.productThumb.id}`}>
        <Image
          src={props.productThumb.image_url ? props.productThumb.image_url[0] : '/images/product/furniture/product-4.png'}
          width={300}
          height={300}
          alt={props.productThumb.name}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} // Thêm style để kiểm soát hình ảnh
        />
        {props.productThumb.hoverThumbnail && props.isHoverThumbnail ? (
          <Image
            src={props.productThumb.hoverThumbnail}
            width={300}
            height={300}
            alt={props.productThumb.name}
            className='hover-img'
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          ''
        )}
      </Link>
      {props.productThumb.salePrice && props.discountLabel && <ProductDiscountLabel discount={props.productThumb} />}
      {props.hoverItems && (
        <div className='product-hover-action'>
          <ActionButtons
            productAction={props.productThumb}
            wishlistBtn={props.wishlistBtn}
            cartBtn={props.cartBtn}
            quickViewBtn={props.quickViewBtn}
          />
        </div>
      )}
    </div>
  )
}

export default ProductThumbnail
