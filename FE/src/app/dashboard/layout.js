"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import NewsLetter from "@/components/newsletter/NewsLetter";
import ServiceTwo from "@/components/services/ServiceTwo";
import { DashboardAsideMenu } from "@/data/Menu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "@/services/user_service";
import { setUser } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";
import Preloader from "@/components/preloader/Preloader";

const DahsboardLayout = ({ children }) => {
  const pathname = usePathname();
  const split = pathname.split("/");
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUsers] = useState(null);
  useEffect(() => {
    UserService.getInfoUser()
      .then((res) => {
        setUsers(res.data.data);
        dispatch(setUser(res.data.data));
      })
      .catch((error) => {
        console.error("Error getting user information:", error);
      });
  }
    , []);
  const pageSlug = split[split.length - 1];
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated]);

  return (
    <>
      <Preloader />
      <HeaderFive headerSlider />
      <main className="main-wrapper">
        <Breadcrumb activeItem="My Account" title="Thông tin chung" />
        <div className="axil-dashboard-area axil-section-gap">
          <div className="container">
            <div className="axil-dashboard-warp">
              <div className="axil-dashboard-author">
                <div className="media">
                  <div className="thumbnail">
                    <Image
                      src={user?.avatar}
                      height={1000}
                      width={1000}
                      alt={user?.fullName}
                    />
                  </div>
                  <div className="media-body">
                    <h5 className="title mb-0">Xin chào {user?.fullName}</h5>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-md-4">
                  <aside className="axil-dashboard-aside">
                    <nav className="axil-dashboard-nav">
                      <div className="nav nav-tabs">
                        {DashboardAsideMenu.map((data, index) => (
                          <Link
                            href={`dashboard/${data.slug}`}
                            className={`nav-item nav-link ${data.slug === pageSlug ? "active" : ""}`}
                            key={index}
                          >
                            <i className={data.icon} />
                            {data.name}
                          </Link>
                        ))}
                        <Link href="/sign-in" className="nav-item nav-link">
                          <i className="fal fa-sign-out" />
                          Logout
                        </Link>
                      </div>
                    </nav>
                  </aside>
                </div>
                <div className="col-xl-9 col-md-8">
                  <div className="tab-content">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NewsLetter />
        <ServiceTwo />
      </main>
      <div></div>
      <Footer />
    </>
  );
};

export default DahsboardLayout;
