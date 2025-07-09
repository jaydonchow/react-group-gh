import { Swiper } from "@nutui/nutui-react";

export default () => {
  const data = [111, 222, 333, 444, 555];
  return (
    <Swiper
      autoplay={0}
      loop={false}
      indicator={false}
      // ref={swiperRef}
    >
      {data.map((v) => {
        return (
          <Swiper.Item key={v}>
            <div style={{ width: "100%", height: 100, background: "#" + v, color: "#fff" }}>{v}</div>
          </Swiper.Item>
        );
      })}
    </Swiper>
  );
};
