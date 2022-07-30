import request from "@/utils/request";

// 汇总总数与总金额
export const andTotalAmountTotalSummary = () => {
  return request({
    url: "/ips/increaseDecrease/sum",
  });
};
