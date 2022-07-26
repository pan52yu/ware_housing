import Vue from "vue";
import VueRouter from "vue-router";
import "@/styles/css/element-#FFB200/index.css";
// import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";

Vue.use(ElementUI);
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/Login"),
  },
  {
    path: "/home",
    component: () => import("@/views/dashboard"),
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/dashboard"),
      },
      {
        path: "/manage-base-info",
        component: () => import("@/views/manage-base-info"),
        children: [
          {
            path: "warehouse",
            component: () =>
              import("@/views/manage-base-info/Warehouse/warehouse"),
          },
          {
            path: "warehouse/details/:id",
            component: () =>
              import("@/views/manage-base-info/Warehouse/components/details"),
          },
          {
            path: "area",
            component: () => import("@/views/manage-base-info/Area/area"),
          },
          {
            path: "area/details.vue/:id",
            component: () =>
              import("@/views/manage-base-info/Area/components/details"),
          },
          {
            path: "location",
            component: () =>
              import("@/views/manage-base-info/Location/location"),
          },
          {
            path: "location/details.vue/:id",
            component: () =>
              import("@/views/manage-base-info/Location/components/details"),
          },
          {
            path: "location-view",
            component: () =>
              import("@/views/manage-base-info/LocationView/location-view"),
          },
          {
            path: "goods",
            component: () => import("@/views/manage-base-info/Goods/goods"),
          },
          {
            path: "/manage-base-info/goods/details/:id",
            component: () =>
              import("@/views/manage-base-info/Goods/components/details"),
          },
          {
            path: "goods-type",
            component: () =>
              import("@/views/manage-base-info/GoodsType/goods-type"),
          },
        ],
      },
      {
        path: "/manage-business",
        component: () => import("@/views/manage-business/index"),
        children: [
          {
            path: "goods-owner",
            component: () =>
              import("@/views/manage-business/GoodsOwner/goods-owner"),
          },
          {
            path: "goods-owner/details/:id",
            component: () =>
              import("@/views/manage-business/GoodsOwner/components/details"),
          },
          {
            path: "goods-owner/detail/:id",
            component: () =>
              import("@/views/manage-business/GoodsOwner/components/detail"),
          },
          {
            path: "task-picking",
            component: () => import("@/views/manage-business/task-picking"),
          },
        ],
      },
      {
        path: "/manage-storage",
        component: () => import("@/views/manage-storage"),
        children: [
          {
            path: "list",
            component: () => import("@/views/manage-storage/List/list"),
          },
          {
            path: "list/details/:id",
            component: () =>
              import("@/views/manage-storage/List/components/details"),
          },
          {
            path: "list/list-detail/:id",
            component: () =>
              import("@/views/manage-storage/List/components/list-detail"),
          },
          {
            path: "list-task",
            component: () =>
              import("@/views/manage-storage/ListTask/list-task"),
          },
          {
            path: "list-task/details/:id&:status&:logicDel",
            component: () =>
              import("@/views/manage-storage/ListTask/components/details"),
          },
          {
            path: "storage-lose-profit",
            component: () =>
              import("@/views/manage-storage/storage-lose-profit"),
          },
          {
            path: "latest-storage",
            component: () => import("@/views/manage-storage/latest-storage"),
          },
        ],
      },
      {
        path: "/manage-storage-in",
        component: () => import("@/views/manage-storage-in"),
        children: [
          {
            path: "list-in/list",
            component: () =>
              import("@/views/manage-storage-in/list-in/List/list"),
          },
          {
            path: "list-in/list/list-detail/:id",
            component: () =>
              import(
                "@/views/manage-storage-in/list-in/List/components/list-detail"
              ),
          },
          {
            path: "list-in/list/details/:id",
            component: () =>
              import(
                "@/views/manage-storage-in/list-in/List/components/details"
              ),
          },
          {
            path: "list-in/task-receive",
            component: () =>
              import(
                "@/views/manage-storage-in/list-in/TaskReceive/task-receive"
              ),
          },
          {
            path: "list-in/task-receive/sure/:id",
            component: () =>
              import(
                "@/views/manage-storage-in/list-in/TaskReceive/components/sure"
              ),
          },
          {
            path: "list-in/task-add",
            component: () =>
              import("@/views/manage-storage-in/list-in/TaskAdd/task-add"),
          },
          {
            path: "list-in/task-add/sure/:id/:detail",
            component: () =>
              import(
                "@/views/manage-storage-in/list-in/TaskAdd/components/sure"
              ),
          },
        ],
      },
      {
        path: "/manage-storage-out",
        component: () => import("@/views/manage-storage-out/index"),
        children: [
          {
            path: "list-out",
            component: () =>
              import("@/views/manage-storage-out/list-out/list-out"),
          },
          {
            path: "list-out/details/:id",
            component: () =>
              import("@/views/manage-storage-out/list-out/components/details"),
          },
          {
            path: "task-picking",
            component: () =>
              import("@/views/manage-storage-out/TaskPicking/task-picking"),
          },
          {
            path: "task-picking/sure/:id/:detail",
            component: () =>
              import("@/views/manage-storage-out/TaskPicking/components/sure"),
          },
          {
            path: "manage-task-transfer",
            component: () =>
              import("@/views/manage-storage-out/manage-task-transfer"),
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
