'use client'
import { Category } from '@/data/ProductCategory'
import { CategoryService } from '@/services/catefory_service'
import { slugify } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Section from '../elements/Section'
import SectionTitle from '../elements/SectionTitle'
import SlickSlider from '../elements/SlickSlider'

const availableImages = [
  '/images/agiclovir.png',
  '/images/danapha.png',
  '/images/laferine.png',
  '/images/truongphuc.png',
  '/images/truongphucdaitrang.png',

]
const getImageForCategory = (category, index) => {
  return availableImages[index % availableImages.length]
}

const CategoryJewellery = (props) => {
  const pathname = usePathname()
  const split = pathname.split('/')
  const pageCategory = split[split.length - 1]
  const [category, setCategory] = useState([])
  const findCategory = Category.filter((data) => slugify(data.cate) === pageCategory)

  useEffect(() => {
    CategoryService.getCategories()
      .then((res) => {
        const categoriesWithImages = res.data.items.map((cat, index) => ({
          ...cat,
          imagePath: props.showImage ? getImageForCategory(cat, index) : null
        }))
        setCategory(categoriesWithImages)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Section pClass='axil-categorie-area' sectionPadding={props.isSlider ? 'axil-section-gapcommon' : 'py-3 bg-categories-header'}>
      {category && category.length > 0 ? (
        props.isSlider ? (
          <>
            {props.showTitle && <SectionTitle title='Danh mục sản phẩm' subColor='highlighter-primary' />}
            <SlickSlider
              class='slick-layout-wrapper--15 axil-slick-arrow arrow-top-slide'
              slidesToShow={6}
              infinite={true}
              autoplay={true}
              autoplaySpeed={2500}
              responsive={[
                {
                  breakpoint: 1400,
                  settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                  },
                },
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                  },
                },
                {
                  breakpoint: 767,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                  },
                },
              ]}>
              {category.map((data, index) => (
                <div className='categrie-product' key={index}>
                  <Link href={`/products/category/${data.id}`}>
                    {props.showImage && (
                      <Image
                        src={data.imagePath}
                        height={64}
                        width={64}
                        alt={data.name}
                      />
                    )}
                    <h6 className='cat-title'>{data.name}</h6>
                  </Link>
                </div>
              ))}
            </SlickSlider>
          </>
        ) : (
          <div className='d-flex justify-content-between align-items-center h-50' style={{ padding: "10px !important", color: "white" }}>
            {category.map((data, index) => (
              <Link href={`/products/category/${data.id}`} key={index}>
                <div className='text-white font-weight-semibold'>{data.name}</div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div>Không có danh mục nào</div>
      )}
    </Section>
  )
}


export default CategoryJewellery
  