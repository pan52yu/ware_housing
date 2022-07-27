import request from "@/utils/request";

// 分页查询明细货品
export const pagingQueryGoods = (list) => {
  return request({
    url: "/api/goods/pageDetail",
    params: list,
  });
};

// 查询仓库根据id
export const queryGoods = (id) => {
  return request({
    url: `/api/goods/${id}`,
  });
};

// 修改货品
export const modifyGoods = (queryList) => {
  return request({
    url: "/api/goods",
    method: "PUT",
    data: queryList,
  });
};

// 新增库位
export const addGoods = (data) => {
  return request({
    url: "/api/goods",
    method: "POST",
    data,
  });
};
// 模糊查询货品类型 fuzzyQueryItemType
export const fuzzyQueryItemType = () => {
  return request({
    url: "/api/goodsType/vague",
    params: {
      params: "",
    },
  });
};

//  模糊查询货主 fuzzyQueryOwner
export const fuzzyQueryOwner = () => {
  return request({
    url: "/api/owner/vague",
    params: {
      params: "",
    },
  });
};

//  根据货主ID查询库区queryReservoirByOwnerId
export const queryReservoirByOwnerId = (id) => {
  return request({
    url: "/api/area/list",
    params: {
      ownerId: id,
    },
  });
};
