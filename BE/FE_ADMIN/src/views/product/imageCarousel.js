import React, { useState } from 'react'
import { CButton } from '@coreui/react'

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CButton color='primary' size='sm' onClick={handlePrev}>
        ←
      </CButton>
      <img src={images[currentIndex]} alt={`product-${currentIndex}`} width='100' height='100' style={{ margin: '0 8px' }} />
      <CButton color='primary' size='sm' onClick={handleNext}>
        →
      </CButton>
    </div>
  )
}

export default ImageCarousel
