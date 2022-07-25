// 获取待办信息
import request from "@/utils/request";

export const getInformation = () => {
  return request({
    url: "/ips/home/todo",
  });
};

// 获取出库入库信息
export const getForInformation = (dimension) => {
  return request({
    url: "/ips/home/sumList",
    params: {
      data: "",
      dimension,
    },
  });
};

// 获取库存使用情况
export const getstockUseStatus = () => {
  return request({
    url: "/ips/home/stockUseStatus",
  });
};

// 获取 库区使用情况
export const getAreaUseStatus = () => {
  return request({
    url: "/ips/home/areaUseStatus",
  });
};
