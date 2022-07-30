// 分页查询盘点单明细
import request from "@/utils/request";

export const pagingQueryListIn = (list) => {
  return request({
    url: "/ips/receipt/pageDetail",
    params: list,
  });
};

// 生成收货任务
export const generateReceivingTask = (data) => {
  return request({
    url: "/ips/receipt/receiving",
    method: "post",
    data,
  });
};

// 查询详情
export const forDetails = (id) => {
  return request({
    url: `/ips/receipt/detail/${id}`,
  });
};

// 分页查询入库清单明细
export const pagingQueryInventoryListingSubsidiary = (list) => {
  return request({
    url: "/ips/receiptList/pageDetail",
    params: list,
  });
};
