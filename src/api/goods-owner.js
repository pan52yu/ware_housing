import request from "@/utils/request";

// 分页查询货主管理
export const pagingQueryGoodsOwner = (list) => {
  return request({
    url: "/api/owner/page",
    params: list,
  });
};

// 查询货主管理明细
export const queryGoodsOwner = (id) => {
  return request({
    url: `/api/owner/detail/${id}`,
  });
};

// 修改货主管理
export const modifyGoodsOwner = (queryList) => {
  return request({
    url: "/api/owner",
    method: "PUT",
    data: queryList,
  });
};

// 新增货主管理
export const addGoodsOwner = (data) => {
  return request({
    url: "/api/owner",
    method: "POST",
    data,
  });
};

// 分页查询货主-库位关联表 详细
export const queryOwnerAssociativeTableLocation = (list) => {
  return request({
    url: "/api/ownerLocation/pageDetail",
    params: list,
  });
};

// 查询库区库位树
export const queryTheTreeLocation = (id) => {
  return request({
    url: "/api/area/tree",
    params: {
      仓库id: id,
    },
  });
};

// 删除货主-库位关联表
export const deleteOwnerAssociativeTableLocation = (id) => {
  return request({
    url: "/api/ownerLocation",
    method: "DELETE",
    params: {
      ids: id,
    },
  });
};
// 货主批量关联库位
export const shipperBatchAssociatedLocation = (idStrArray, ownerId) => {
  return request({
    url: "/api/ownerLocation/batch",
    method: "POST",
    data: {
      idStrArray,
      ownerId,
    },
  });
};
