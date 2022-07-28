import request from "@/utils/request";

// 分页查询货品类型管理
export const pagingQueryGoodsType = (list) => {
  return request({
    url: "/api/goodsType/page",
    params: list,
  });
};
// 查询货品类型管理
export const queryItemTypeManagement = (id) => {
  return request({
    url: `/api/goodsType/${id}`,
  });
};

// 新增货品类型管理
export const addGoodsType = (list) => {
  return request({
    url: "/api/goodsType",
    method: "post",
    data: list,
  });
};

// 修改货品类型管理
export const putGoodsType = (list) => {
  return request({
    url: "/api/goodsType",
    method: "put",
    data: list,
  });
};
