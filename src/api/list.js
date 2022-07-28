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
