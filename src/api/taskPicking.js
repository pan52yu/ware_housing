import request from "@/utils/request";

// 分页查询承运商
export const pagingQueryCarrier = (list) => {
  return request({
    url: "/api/carrier/page",
    params: list,
  });
};
