import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Breadcrumb, Button, Dropdown, Table, Card, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getOrderById } from 'src/api/order'
import Swal from 'sweetalert2'
import { updateOrder } from '../../api/order'
const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [shippingPhone, setShippingPhone] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pending') // State cho trạng thái thanh toán
  const [orderStatus, setOrderStatus] = useState('pending') // State cho tình trạng đơn hàng
  useEffect(() => {
    const fetchOrder = async (id) => {
      const order = await getOrderById(id)
      // Fetch order details from API
      if (order) {
        setOrder(order)
        setOrderStatus(order.status)
        setPaymentStatus(order.paymentStatus)
        setShippingPhone(order.shippingPhone)
      }
    }
    fetchOrder(id)
  }, [id])
  const handleEditToggle = () => {
    setIsEditing(!isEditing) // Chuyển đổi giữa xem và chỉnh sửa
  }
  const handleSave = async (e) => {
    try {
      //kiểm tra value là số
      if (!Number.isNaN(parseFloat(shippingPhone))) {
        setIsEditing(false) // Thoát chế độ chỉnh sửa
        // Lưu số điện thoại vào database
        const result = await updateOrder(id, { shippingPhone })
        if (result) {
          Swal.fire({
            title: 'Thông báo',
            text: 'Đã lưu!',
            icon: 'success',
          })
        } else {
          Swal.fire({
            title: 'Thông báo',
            text: 'Lưu số điện thoại thất bại!',
            icon: 'error',
          })
        }
      } else {
        Swal.fire({
          title: 'Thông báo',
          text: 'Số điện thoại không hợp lệ!',
          icon: 'error',
        })
      }
    } catch (e) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Lỗi khi lưu số điện thoại!',
        icon: 'error',
      })
    }
  }
  const handlePaymentStatusChange = async (e) => {
    const newStatus = e.target.value
    setPaymentStatus(newStatus)
    try {
      // Giả sử có API updateOrder
      const result = await updateOrder(id, { paymentStatus: newStatus })
      if (result) {
        Swal.fire({
          title: 'Thông báo',
          text: 'Đã cập nhật trạng thái thanh toán thành công!',
          icon: 'success',
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã cập nhật trạng thái thanh toán thất bại!',
        icon: 'success',
      })
    }
  }

  const handleOrderStatusChange = async (e) => {
    const newStatus = e.target.value
    setOrderStatus(newStatus)
    try {
      // Giả sử có API updateOrder
      const result = await updateOrder(id, { status: newStatus })
      if (result) {
        Swal.fire({
          title: 'Thông báo',
          text: 'Đã cập nhật tình trạng đơn hàng thành công!',
          icon: 'success',
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã cập nhật tình trạng đơn hàng thất bại!',
        icon: 'error',
      })
    }
  }
  return (
    <div className='content w-100'>
      <Container>
        {/* Breadcrumb */}
        <nav className='mb-3' aria-label='breadcrumb'>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Chi tiết đơn hàng</Breadcrumb.Item>
          </Breadcrumb>
        </nav>

        <div className='mb-9'>
          <h2 className='mb-0'>
            Mã đơn hàng: <span>{id}</span>
          </h2>

          {/* Customer Info and Actions */}
          <Row className='d-sm-flex flex-between-center mb-3'>
            <Col>
              <p className='text-body-secondary lh-sm mb-0 mt-2 mt-sm-0'>
                Mã khách hàng:{' '}
                <a className='fw-bold' href='#!'>
                  {order?.user?.id}
                </a>
              </p>
            </Col>
            <Col className='d-flex'>
              <Button variant='link' className='pe-3 ps-0 text-body'>
                <i className='fas fa-print me-2'></i>Print
              </Button>
              <Button variant='link' className='px-3 text-body'>
                <i className='fas fa-undo me-2'></i>Refund
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant='link' className='text-body ps-3 pe-0 dropdown-caret-none'>
                  More action <i className='fas fa-chevron-down ms-2'></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align='end'>
                  <Dropdown.Item href='#'>Action</Dropdown.Item>
                  <Dropdown.Item href='#'>Another action</Dropdown.Item>
                  <Dropdown.Item href='#'>Something else here</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {/* Main Content */}
          <Row className='g-5 gy-7'>
            <Col xs={12} xl={8} xxl={9}>
              {/* Order Table */}
              <div id='orderTable'>
                <div className='table-responsive scrollbar'>
                  <Table className='fs-9 mb-0 border-top border-translucent'>
                    <thead>
                      <tr>
                        <th scope='col'>STT</th>
                        <th scope='col' style={{ minWidth: '150px' }}>
                          Tên sản phẩm
                        </th>
                        <th scope='col' style={{ minWidth: '150px' }}>
                          Địa chỉ giao hàng
                        </th>
                        <th scope='col' className='text-end ps-4' style={{ width: '150px' }}>
                          Giá
                        </th>
                        <th scope='col' className='text-end ps-4' style={{ width: '200px' }}>
                          Số lượng
                        </th>
                        <th scope='col' className='text-end ps-4' style={{ width: '250px' }}>
                          Tổng giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.orderDetails?.map((item, index) => (
                        <tr key={index} className='hover-actions-trigger'>
                          <td className='align-middle white-space-nowrap py-2'>{index + 1}</td>
                          <td className='align-middle py-0'>
                            <a className='fw-semibold line-clamp-2 mb-0' href='../landing/product-details.html'>
                              {item.product.name}
                            </a>
                          </td>
                          <td className='align-middle text-body fw-semibold text-start py-0 ps-4'>{order.shippingAddress}</td>
                          <td className='align-middle text-body fw-semibold text-end py-0 ps-4'>{item.product.price} VNĐ</td>
                          <td className='align-middle text-end py-0 ps-4 text-body-tertiary'>{item.quantity}</td>
                          <td className='align-middle fw-bold text-body-highlight text-end py-0 ps-4'>{item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              {/* 
              <div className='d-flex flex-between-center py-3 border-bottom border-translucent mb-6'>
                <p className='text-body-emphasis fw-semibold lh-sm mb-0'>Items subtotal :</p>
                <p className='text-body-emphasis fw-bold lh-sm mb-0'>$1690</p>
              </div> */}
              <div className='d-flex flex-between-center py-3 border-bottom border-translucent mb-6'></div>
              {/* Billing, Shipping, Other Details */}
              <Row className='gx-4 gy-6 g-xl-7 justify-content-sm-center justify-content-xl-start'>
                <Col xs={12} sm='auto'>
                  <h4 className='mb-5'>Billing details</h4>
                  {/* Add billing details here */}
                </Col>
                <Col xs={12} sm='auto'>
                  <h4 className='mb-5'>Shipping details</h4>
                  SĐT người giao hàng:
                  <br />
                  {isEditing ? (
                    <div>
                      <Form.Control type='text' value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} className='mb-2' />
                      <Button variant='primary' size='sm' onClick={(e) => handleSave(e)} className='me-2'>
                        Lưu
                      </Button>
                      <Button variant='secondary' size='sm' onClick={handleEditToggle}>
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className='text-body-emphasis fw-bold d-inline'>{shippingPhone}</p>
                      <Button variant='link' className='ms-3 text-primary' onClick={handleEditToggle}>
                        <i className='fas fa-edit me-1'></i>Sửa
                      </Button>
                    </>
                  )}
                </Col>
                <Col xs={12} sm='auto'>
                  <h4 className='mb-5'>Other details</h4>
                  {/* Add other details here */}
                </Col>
              </Row>
            </Col>

            {/* Summary and Status */}
            <Col xs={12} xl={4} xxl={3}>
              <Row>
                <Col xs={12}>
                  <Card className='mb-3'>
                    <Card.Body>
                      <h3 className='card-title mb-4'>Tổng giá:</h3>
                      <div>
                        <div className='d-flex justify-content-between'>
                          <p className='text-body fw-semibold'>Tất cả sản phẩm:</p>
                          <p className='text-body-emphasis fw-semibold'>{order?.totalAmount}</p>
                        </div>
                        {/* Add other summary items */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card>
                    <Card.Body>
                      <h3 className='card-title mb-4'>Trạng thái đơn hàng</h3>
                      <h6 className='mb-2'>Trạng thái thanh toán</h6>
                      <Form.Select className='mb-4' value={paymentStatus} onChange={handlePaymentStatusChange}>
                        <option value='pending'>Đang chờ</option>
                        <option value='paid'>Đã thanh toán</option>
                        <option value='failed'>Thất bại</option>
                      </Form.Select>
                      <h6 className='mb-2'>Tình trạng đơn hàng</h6>
                      <Form.Select value={orderStatus} onChange={handleOrderStatusChange}>
                        <option value='pending'>Chờ xử lý</option>
                        <option value='confirmed'>Đã xác nhận</option>
                        <option value='processing'>Đang xử lý</option>
                        <option value='shipped'>Đã gửi hàng</option>
                        <option value='delivered'>Đã giao hàng</option>
                        <option value='cancelled'>Đã hủy</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default OrderDetails
