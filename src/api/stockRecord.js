import request from "@/utils/request";

// 分页查询盘点单明细
export const pagingQueryStockRecord = (list) => {
  return request({
    url: "/ips/stockRecord/page",
    params: list,
  });
};
