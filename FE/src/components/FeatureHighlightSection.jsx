import Image from 'next/image'

const features = [
  {
    icon: "/images/icons/service1.svg",
    title: "Phân phối rộng khắp nơi",
    desc: "Sản phẩm có mặt tại 30.000 nhà thuốc"
  },
  {
    icon: "/images/icons/service2.svg",
    title: "Ship COD toàn quốc",
    desc: "Miễn phí giao hàng với đơn từ 500K"
  },
  {
    icon: "/images/icons/service3.svg",
    title: "Sản phẩm chất lượng",
    desc: "Sản phẩm dựa trên tinh hoa"
  },
  {
    icon: "/images/icons/service4.svg",
    title: "Tích điểm 6 TẶNG 1",
    desc: "Khuyến mãi 6 tặng 1"
  }
]

const FeatureHighlightSection = () => (
  <section
    style={{
      backgroundColor: "#155D9E",
      padding: "32px 0"
    }}
  >
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap"
      }}
    >
      {features.map((f, idx) => (
        <div
          key={idx}
          style={{
            flex: "1 1 200px",
            minWidth: 200,
            color: "#fff",
            textAlign: "center"
          }}
        >
          <Image src={f.icon} alt={f.title} width={40} height={40} style={{ marginBottom: 12, color: "white" }} />
          <div style={{ fontWeight: 700 }}>{f.title}</div>
          <div style={{ fontSize: 15 }}>{f.desc}</div>
        </div>
      ))}
    </div>
  </section>
)

export default FeatureHighlightSection 