import request from "@/utils/request";

// 查询全部货主管理
export const queryAllOwnersManagement = () => {
  return request({
    url: "/api/owner/list",
  });
};

// 分页查询盘点单明细
export const pagingQueryList = (list) => {
  return request({
    url: "/ips/check/pageDetail",
    params: list,
  });
};

// 生成盘点任务
export const generateCountingTask = (data) => {
  return request({
    url: "/ips/check/task",
    method: "post",
    data,
  });
};

// 查询详情
export const forDetails = (id) => {
  return request({
    url: `/ips/check/detail/${id}`,
  });
};

// 分页查询盘点清单明细
export const pagingQueryInventoryListingSubsidiary = (list) => {
  return request({
    url: "/ips/checkList/pageDetail",
    params: list,
  });
};
// 分页查询明细库存
export const pagingQueryDetailedInventory = (list) => {
  return request({
    url: "/ips/stock/pageDetail",
    params: list,
  });
};
// 查询盘点单
export const queryInventoryListById = (id) => {
  return request({
    url: `/ips/check/${id}`,
  });
};

// 修改盘点单
export const modifyList = (queryList) => {
  return request({
    url: "/ips/check",
    method: "PUT",
    data: queryList,
  });
};

// 新增盘点单
export const addList = (data) => {
  return request({
    url: "/ips/check",
    method: "POST",
    data,
  });
};

// 批量新增盘点清单
export const batchAddList = (data) => {
  return request({
    url: "/ips/checkList/batch",
    method: "POST",
    data,
  });
};
// 取消盘点单
export const cancelInventoryList = (id) => {
  return request({
    url: "/ips/check/cancel",
    method: "PUT",
    data: {
      id,
    },
  });
};
