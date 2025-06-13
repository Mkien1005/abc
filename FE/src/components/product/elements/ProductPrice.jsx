import { formatVND } from "@/utils/formatVND"

const ProductPrice = (props) => {
  return (
    <div className='product-price-variant'>
      
      {props.price.salePrice ? (
        <span className='price old-price'>
          {formatVND(props.price.price)}
        </span>
      ) : (
        ''
      )}
      <span className='price current-price'>
        {formatVND(props.price.salePrice ? props.price.salePrice : props.price.price)}
      </span>
    </div>
  )
}

export default ProductPrice
