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

// 查询入库单
export const queryReceiptListById = (id) => {
  return request({
    url: `/ips/receipt/${id}`,
  });
};

// 查询全部仓库列表
export const queryAllWarehouse = (id) => {
  return request({
    url: `/api/warehouse/list`,
    params: {
      status: 1,
      ownerId: id,
    },
  });
};

// 新增入库单
export const addReceipt = (data) => {
  return request({
    url: "/ips/receipt",
    method: "POST",
    data,
  });
};

// 修改入库单
export const modifyReceipt = (queryList) => {
  return request({
    url: "/ips/receipt",
    method: "PUT",
    data: queryList,
  });
};

// 分页查询入库货品
export const pagingQueryReceipt = (list) => {
  return request({
    url: "/api/goods/pageDetail",
    params: list,
  });
};

// 批量新增货品
export const batchAddGoods = (data) => {
  return request({
    url: "/ips/receiptList/batch",
    method: "POST",
    data,
  });
};

// 取消入库单
export const cancelReceipt = (id) => {
  return request({
    url: "/ips/receipt/cancel",
    method: "PUT",
    data: {
      id,
    },
  });
};

// 查询合计信息
export const aggregateInformationQuery = (id) => {
  return request({
    url: `/ips/receiptList/sum/${id}`,
  });
};
