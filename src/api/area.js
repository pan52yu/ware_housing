// 分页查询库区详细信息
import request from "@/utils/request";

export const pagingQueryArea = (list) => {
  return request({
    url: "/api/area/pageDetail",
    params: list,
  });
};

// 查询仓库根据id
export const queryWarehouse = (id) => {
  return request({
    url: `/api/area/${id}`,
  });
};

// 查询全部仓库列表
export const queryAllWarehouse = () => {
  return request({
    url: `/api/warehouse/list`,
    params: {
      status: 1,
    },
  });
};

// 修改库区
export const modifyArea = (queryList) => {
  return request({
    url: "/api/area",
    method: "PUT",
    data: queryList,
  });
};

// 新增库区
export const addArea = (data) => {
  return request({
    url: "/api/area",
    method: "POST",
    data,
  });
};
