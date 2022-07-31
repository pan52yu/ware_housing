// 分页查询盘点单明细
import request from "@/utils/request";

export const pagingQueryListOut = (list) => {
  return request({
    url: "/ips/outbound/pageDetail",
    params: list,
  });
};

// 生成拣货任务
export const generatePickingTask = (data) => {
  return request({
    url: "/ips/outbound/picking",
    method: "post",
    data,
  });
};

// 取消出库单
export const cancelOutboundOrder = (id) => {
  return request({
    url: "/ips/outbound/cancel",
    method: "PUT",
    data: {
      id,
    },
  });
};

// 查询全部承运商
export const queryAllShippers = () => {
  return request({
    url: "/api/carrier/list",
  });
};

// 新增出库单
export const addOutboundOrder = (data) => {
  return request({
    url: "/ips/outbound",
    method: "POST",
    data,
  });
};

// 修改出库单
export const modifyOutboundOrder = (queryList) => {
  return request({
    url: "/ips/outbound",
    method: "PUT",
    data: queryList,
  });
};

// 查询出库单
export const queryOutboundOrderListById = (id) => {
  return request({
    url: `/ips/outbound/${id}`,
  });
};

// 分页查询出库清单明细
export const pagingQueryOutboundListingSubsidiary = (list) => {
  return request({
    url: "/ips/outboundList/pageDetail",
    params: list,
  });
};

// 分页查询盘点单明细
export const pagingQueryInventoryListDetails = (list) => {
  return request({
    url: "/ips/receiving/pageDetail",
    params: list,
  });
};

// 分配收货任务
export const receivingAssignment = (queryList) => {
  return request({
    url: "/ips/receiving/distribute",
    method: "PUT",
    data: queryList,
  });
};

// 收货完成
export const goodsFinish = (data) => {
  return request({
    url: "/ips/receiving/complete",
    method: "PUT",
    data,
  });
};

// 分页查询拣货任务明细
export const pagingQueryPickingTaskDetails = (list) => {
  return request({
    url: "/ips/picking/pageDetail",
    params: list,
  });
};

// 分页查询上架任务明细
export const pagingQueryOnDetail = (list) => {
  return request({
    url: "/ips/grounding/pageDetail",
    params: list,
  });
};
// 拣选完成
export const pickingComplete = (data) => {
  return request({
    url: "/ips/picking/complete",
    method: "PUT",
    data,
  });
};

//  查询合计信息
export const aggregateInformationQuery = (id) => {
  return request({
    url: `/ips/outboundList/sum/${id}`,
  });
};

// 分配拣货任务
export const pickingTaskDistribution = (queryList) => {
  return request({
    url: "/ips/picking/distribute",
    method: "PUT",
    data: queryList,
  });
};

// 修改拣货任务实拣数量
export const modifyPicking = (queryList) => {
  return request({
    url: "/ips/outboundList",
    method: "PUT",
    data: queryList,
  });
};

// 分页查询交接任务明细
export const pagingQueryTransitionTaskDetails = (list) => {
  return request({
    url: "/ips/handover/pageDetail",
    params: list,
  });
};

// 分配交接任务
export const handoverAssignment = (queryList) => {
  return request({
    url: "/ips/picking/distribute",
    method: "PUT",
    data: queryList,
  });
};
