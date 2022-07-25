import request from "@/utils/request";

// 获取下一个编码
export const forNextEncod = () => {
  return request({
    url: "/api/codeFactory/next/CK",
  });
};
