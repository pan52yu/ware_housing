import request from "@/utils/request";
// 分页查询库位详细信息
export const pagingQueryLocation = (list) => {
  return request({
    url: "/api/location/pageDetail",
    params: list,
  });
};

// 修改库位
export const modifyLocation = (queryList) => {
  return request({
    url: "/api/location",
    method: "PUT",
    data: queryList,
  });
};

// 查询仓库根据id
export const queryLocation = (id) => {
  return request({
    url: `/api/location/${id}`,
  });
};

// 查询全部库区
export const queryAllArea = (queryList) => {
  return request({
    url: "/api/area/list",
    params: queryList,
  });
};

// 新增库位
export const addLocation = (data) => {
  return request({
    url: "/api/location",
    method: "POST",
    data,
  });
};
