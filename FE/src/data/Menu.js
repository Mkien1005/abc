const HeaderMenu = [
  {
    name: "Trang chủ",
    url: "/",
    hasChildren: true,
  },
  {
    name: "Cửa hàng",
    url: "/shop",
    hasChildren: true,
  },
  {
    name: "Giới thiệu",
    url: "/about",
    hasChildren: false,
  },
  {
    name: "Liên hệ",
    url: "/contact",
    hasChildren: false,
  },
  {
    name: "Tài liệu hướng dẫn y tế",
    url: "/info",
    hasChildren: false,
  }
];

const CateMenu = [
  {
    name: "Thời trang",
    url: "/shop?category=fashion",
    icon: "/images/product/categories/cat-01.png",
    hasChildren: true,
    children: [
      {
        label: "Nam",
        items: [
          {
            name: "Áo thun",
            url: "/",
          },
          {
            name: "Áo sơ mi",
            url: "/",
          },
          {
            name: "Quần jeans",
            url: "/",
          },
        ],
      },
      {
        label: "Nữ",
        items: [
          {
            name: "Quần jeans",
            url: "/",
          },
          {
            name: "Áo thun",
            url: "/",
          },
          {
            name: "Áo sơ mi",
            url: "/",
          },
          {
            name: "Áo kiểu",
            url: "/",
          },
          {
            name: "Jumpsuit",
            url: "/",
          },
          {
            name: "Áo khoác",
            url: "/",
          },
          {
            name: "Áo len",
            url: "/",
          },
        ],
      },
      {
        label: "Phụ kiện",
        items: [
          {
            name: "Túi xách",
            url: "/",
          },
          {
            name: "Giày",
            url: "/",
          },
          {
            name: "Ví",
            url: "/",
          },
        ],
      },
    ],
    featured: [
      {
        thumb: "/images/product/product-feature1.png",
        url: "/",
      },
      {
        thumb: "/images/product/product-feature2.png",
        url: "/",
      },
      {
        thumb: "/images/product/product-feature3.png",
        url: "/",
      },
      {
        thumb: "/images/product/product-feature4.png",
        url: "/",
      },
    ],
  },
  {
    name: "Điện tử",
    url: "/shop?category=electronics",
    icon: "/images/product/categories/cat-02.png",
    hasChildren: false,
  },
  {
    name: "Trang trí nhà cửa",
    url: "/",
    icon: "/images/product/categories/cat-03.png",
    hasChildren: false,
  },
  {
    name: "Thuốc",
    url: "/",
    icon: "/images/product/categories/cat-04.png",
    hasChildren: false,
  },
  {
    name: "Nội thất",
    url: "/shop?category=furniture",
    icon: "/images/product/categories/cat-05.png",
    hasChildren: false,
  },
  {
    name: "Thủ công mỹ nghệ",
    url: "/",
    icon: "/images/product/categories/cat-06.png",
    hasChildren: false,
  },
  {
    name: "Phụ kiện",
    url: "/",
    icon: "/images/product/categories/cat-07.png",
    hasChildren: false,
  },
];

const DashboardAsideMenu = [
  {
    icon: "fas fa-th-large",
    name: "Bảng điều khiển",
    slug: "",
  },
  {
    icon: "fas fa-shopping-basket",
    name: "Đơn hàng",
    slug: "orders",
  },
  {
    icon: "fas fa-user",
    name: "Chi tiết tài khoản",
    slug: "account-details",
  },
];

export { HeaderMenu, CateMenu, DashboardAsideMenu };
