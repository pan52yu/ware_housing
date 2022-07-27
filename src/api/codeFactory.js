import request from "@/utils/request";

// 获取下一个编码
export const forNextEncode = () => {
  return request({
    url: `/api/codeFactory/next/CK`,
  });
};

// 获取下一个编码
export const KQForNextEncode = () => {
  return request({
    url: `/api/codeFactory/next/KQ`,
  });
};

// 获取下一个编码
export const KWForNextEncode = () => {
  return request({
    url: `/api/codeFactory/next/KW`,
  });
};

export const HPForNextEncode = () => {
  return request({
    url: `/api/codeFactory/next/HP`,
  });
};
