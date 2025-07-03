import { Notify } from "@nutui/nutui-react";
import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000",
  // withCredentials: true,
  validateStatus: (err) => {
    if (err !== 200) {
      // message.error(err);
      return false;
    } else {
      return true;
    }
  },
  // transformResponse: [
  //   function (data) {
  //     // 对接收的 data 进行任意转换处理
  //     console.log('data', data);
  //     return data;
  //   },
  // ],
});

export default async (payload) => {
  try {
    return await request(payload);
  } catch (error) {
    console.error(payload.url, error.response?.data);
    Notify.text(error.response.data.message, {
      style: {
        "--nutui-notify-text-color": "#FFFFFF",
        "--nutui-notify-background-color": "#ff0f23",
      },
    });
    return Promise.resolve({
      data: [],
    });
  }
};
