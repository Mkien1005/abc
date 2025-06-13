'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductsData from '@/data/Products'
import ProductThumbnail from '@/components/product/elements/ProductThumbnail'
import ProductTitle from '@/components/product/elements/ProductTitle'
import ProductPrice from '@/components/product/elements/ProductPrice'
import ProductRating from '@/components/product/elements/ProductRating'
import ActionButtons from '@/components/product/elements/ActionButtons'
import { ProductService } from '@/services/product_service'
const ProductSearchModal = (props) => {
  const getProducts = ProductsData
  const [productQuery, setProductQuery] = useState([])
  function debounce(func, delay) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), delay)
    }
  }
  const SearchInputHandler = debounce(async (inputValue) => {
    if (inputValue.length > 0) {
      await getProds(inputValue)
    } else {
      setProductQuery([])
    }
  }, 1000)
  async function getProds(param) {
    const res = await ProductService.searchProducts({ param })
    setProductQuery(res.data.items)
  }

  return (
    <>
      <div className={`header-search-modal ${props.toggler ? 'open' : ''}`}>
        <button className='card-close sidebar-close' onClick={props.toggleHandler}>
          <i className='fas fa-times' />
        </button>
        <div className='header-search-wrap'>
          <div className='card-header'>
            <div className='input-group'>
              <input type='search' className='form-control' placeholder='Tìm kiếm sản phẩm....' onChange={(e) => SearchInputHandler(e.target.value)} />
              <button className='axil-btn btn-bg-primary'>
                <i className='far fa-search' />
              </button>
            </div>
          </div>
          <div className='card-body'>
            <div className='search-result-header'>
              <h6 className='title'>{productQuery.length} Kết quả tìm kiếm</h6>
              <Link href='/shop'>Xem tất cả</Link>
            </div>
            <div className='psearch-results'>
              {productQuery &&
                productQuery.map((data) => (
                  <div className='axil-product-list' key={data.id}>
                    <div onClick={props.toggleHandler}>
                      <ProductThumbnail productThumb={data} width={120} height={120} />
                    </div>
                    <div className='product-content'>
                      <ProductRating rating={data} />
                      <div onClick={props.toggleHandler}>
                        <ProductTitle productTitle={data} titleTag='h6' />
                      </div>
                      <ProductPrice price={data} />
                      <ActionButtons productAction={data} wishlistBtn cartBtn />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {props.toggler ? <div className='closeMask' onClick={props.toggleHandler}></div> : ''}
    </>
  )
}

export default ProductSearchModal
