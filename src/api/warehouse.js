import request from "@/utils/request";

// 分页查询仓库
export const pagingQueryWarehouse = (list) => {
  return request({
    url: "/api/warehouse/page",
    params: list,
  });
};

// 删除仓库
export const removeWarehouse = (id) => {
  return request({
    url: "/api/warehouse",
    method: "DELETE",
    params: {
      "ids[]": id,
    },
  });
};

// 修改仓库
export const modifyWarehouse = (queryList) => {
  return request({
    url: "/api/warehouse",
    method: "PUT",
    data: queryList,
  });
};

// 查询仓库根据id
export const queryWarehouse = (id) => {
  return request({
    url: `/api/warehouse/${id}`,
  });
};

// 新增仓库
export const addWarehouse = (data) => {
  return request({
    url: "/api/warehouse",
    method: "POST",
    data,
  });
};
