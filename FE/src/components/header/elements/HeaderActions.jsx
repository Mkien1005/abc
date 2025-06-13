import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import ProductSearchModal from '@/components/header/elements/ProductSearchModal'
import MiniCart from '@/components/header/elements/MiniCart'
import { miniCartHandler } from '@/store/slices/productSlice'
import { mobileMenu } from '@/store/slices/menuSlice'
import { useEffect, useState, useRef } from 'react'
import { CartService } from '@/services/cart_service'
import { eventBus } from '@/utils/eventBus'
import { useRouter } from 'next/navigation'
import NotificationList from './NotificationList'
import { notificationService } from '@/services/notification_service'
import { socketService } from '@/services/socket_service'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import { Bell, LogOut, User } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Badge } from '@/components/ui/badge'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { useToast } from '@/components/ui/use-toast'

const HeaderActions = (props) => {
  const [searchToggle, setSearchToggle] = useState(false)
  const [accountDropdown, setaccountDropdown] = useState(false)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationRef = useRef(null)
  // const { toast } = useToast()

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const updateCart = () => {
      CartService.getCart().then((res) => {
        if (res.data && res.data.cartDetails) {
          setCartQuantity(res.data.cartDetails.length);
        }
      });
    };
    updateCart();
    eventBus.on("cartUpdated", updateCart);

    return () => {
      eventBus.off("cartUpdated", updateCart);
    };
  }, []);
  const dispatch = useDispatch();

  const getProducts = useSelector((state) => state.productData);

  const searchBoxToggleHandler = () => {
    setSearchToggle((toggler) => !toggler);
  };
  const accountDropdownToggler = () => {
    setaccountDropdown((toggler) => !toggler);
  };
  const cartHandler = (data) => {
    dispatch(miniCartHandler(data));
  };

  const mobileMneuHandler = (data) => {
    dispatch(mobileMenu(data));
  };

  const handleLogout = async () => {
    try {
      // Xóa token và các dữ liệu local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      
      // Hiển thị thông báo
      Swal.fire({
        title: 'Đăng xuất thành công',
        description: 'Bạn đã đăng xuất khỏi hệ thống',
        timer: 1500,
        icon: 'success',
      }).then(() => {
        router.push('/sign-in')
        router.refresh() // Refresh lại router để đảm bảo state được cập nhật
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi đăng xuất',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/bell-notification.mp3')
    audio.play()
  }

  useEffect(() => {
    // Connect to socket when component mounts
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      socketService.connect(accessToken)
      // Listen for new notifications
      socketService.on('newNotification', (notification) => {
        setUnreadCount(prev => prev + 1)
        // Play sound and show toast when new notification arrives
        playNotificationSound()
        toast.info('Bạn có thông báo mới!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })

      // Listen for unread count updates
      socketService.on('unreadCount', (count) => {
        setUnreadCount(count)
      })
    }

    // Initial fetch of unread count
    fetchUnreadCount()

    return () => {
      socketService.removeAllListeners()
      socketService.disconnect()
    }
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  return (
    <div className="header-action">
      <ul className="action-list">
        {props.searchBox && (
          <li className="axil-search" onClick={searchBoxToggleHandler}>
            <input
              type="search"
              className="placeholder product-search-input"
              name="search2"
              placeholder="Bạn cần tìm loại thuốc nào?"
              autoComplete="off"
            />
            <button type="submit" className="icon wooc-btn-search">
              <i className="far fa-search" />
            </button>
          </li>
        )}
        {props.searchIcon && (
          <li className="axil-search axil-search-icon">
            <button
              className="header-search-icon"
              onClick={searchBoxToggleHandler}
            >
              <i className="far fa-search" />
            </button>
          </li>
        )}
        <li className="google-lens" style={{ position: "relative", zIndex: 1 }}>
          <a
            href="https://lens.google.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", padding: "0 10px" }}
          >
            <i
              className="far fa-camera"
              style={{ color: "white", fontSize: "20px" }}
            />
          </a>
        </li>
        <li className="shopping-cart">
          <button
            className="cart-dropdown-btn"
            onClick={() => cartHandler(true)}
          >
            <span className="cart-count">{cartQuantity}</span>
            <i className="far fa-shopping-cart" style={{ color: "white" }} />
          </button>
        </li>
        <li className="my-account">
          <button onClick={accountDropdownToggler}>
            <i className="far fa-user" style={{ color: "white" }} />
          </button>
          <div
            className={`my-account-dropdown ${accountDropdown ? "open" : ""}`}
          >
            {isClient && isAuthenticated ? (
              <>
                <span className="title">Quản trị</span>
                <ul>
                  <li>
                    <Link href="/dashboard">Tài khoản của tôi</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/orders">Đơn hàng</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/account-details">Cài đặt</Link>
                  </li>
                </ul>
                <div className='login-btn'>
                  <Link href={''} onClick={handleLogout} className='axil-btn btn-bg-primary'>
                    Đăng xuất
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="login-btn">
                  <Link href="/sign-in" className="axil-btn btn-bg-primary">
                    Đăng nhập
                  </Link>
                </div>
                <div className="reg-footer text-center">
                  Chưa có tài khoản?
                  <Link href="/sign-up" className="btn-link">
                    ĐĂNG KÝ TẠI ĐÂY.
                  </Link>
                </div>
              </>
            )}
          </div>
        </li>
        <li className='notification-btn' ref={notificationRef}>
          <button className='notification-btn relative' onClick={toggleNotification}>
            <i className='far fa-bell' style={{ color: "white" }} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          <NotificationList 
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              width: '350px',
              maxHeight: '400px',
            }}
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
            handleMarkAllAsRead={handleMarkAllAsRead}
          />
        </li>
        <li className='axil-mobile-toggle'>
          <button className='menu-btn mobile-nav-toggler' onClick={() => mobileMneuHandler(true)}>
            <i className='fal fa-bars'></i>
          </button>
        </li>
      </ul>
      <MiniCart />
      {(props.searchIcon || props.searchBox) && (
        <ProductSearchModal
          toggleHandler={searchBoxToggleHandler}
          toggler={searchToggle}
        />
      )}
    </div>
  );
};

export default HeaderActions;
