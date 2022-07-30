import request from "@/utils/request";

// 分页查询盘点单明细
export const pagingQueryListTack = (list) => {
  return request({
    url: "/ips/checkTask/pageDetail",
    params: list,
  });
};

//生成损益单
export const generateProfitsLossesTheSingle = (data) => {
  return request({
    url: "/ips/checkTask/increaseDecrease",
    method: "post",
    data,
  });
};

// 生成复盘任务
export const generateCheckingTasks = (data) => {
  return request({
    url: "/ips/checkTask/task",
    method: "post",
    data,
  });
};

// 分配
export const distribution = (queryList) => {
  return request({
    url: "/ips/checkTask/distribute",
    method: "PUT",
    data: queryList,
  });
};

// 修改盘点清单
export const modifyInventoryList = (queryList) => {
  return request({
    url: "/ips/checkList",
    method: "PUT",
    data: queryList,
  });
};

// 盘点完成
export const inventoryFinish = (data) => {
  return request({
    url: "/ips/checkTask/complete",
    method: "PUT",
    data,
  });
};

// 分页查询损益单明细
export const pagingQueryLossesTheSingleDetail = (list) => {
  return request({
    url: "/ips/increaseDecrease/pageDetail",
    params: list,
  });
};

// 调整库存
export const adjustStock = (id) => {
  return request({
    url: "/ips/increaseDecrease/change",
    method: "PUT",
    data: {
      id,
    },
  });
};

// 取消调整
export const cancelAdjustment = (id) => {
  return request({
    url: "/ips/increaseDecrease/cancel",
    method: "PUT",
    data: {
      id,
    },
  });
};
