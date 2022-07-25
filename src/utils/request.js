import axios from "axios";
// 导入进度条插件
import NProgress from "nprogress";
// 导入进度条样式
import "nprogress/nprogress.css";

const request = axios.create();
// 通过axios拦截器添加token验证
request.interceptors.request.use((config) => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start();
  config.headers.Authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNTJlYWUxMS0yYWZiLTQwYjUtODg3NC01OTEwOGU0YjI0NjUiLCJzdWIiOiJ7XCJyb2xlXCI6XCJST0xFX0FETUlOXCIsXCJ0eXBlXCI6XCIyXCIsXCJ1c2VybmFtZVwiOlwiYWRtaW5cIn0iLCJpc3MiOiJhZG1pbiIsImlhdCI6MTYwNjM3MTA3NiwiZXhwIjoxNjA2OTc1ODc2fQ.pCl45pY_v2w8rZU8l60UI4cQx-Ufl7DRw0rZqhY8zeE";
  return config;
});
request.interceptors.response.use((config) => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done();
  return config;
});
// request.defaults.baseURL = "http://www-wms-java.itheima.net/api";
export default request;
