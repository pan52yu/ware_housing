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
            path: "area/details/:id",
            component: () =>
              import("@/views/manage-base-info/Area/components/details"),
          },
          {
            path: "location",
            component: () =>
              import("@/views/manage-base-info/Location/location"),
          },
          {
            path: "location/details/:id",
            component: () =>
              import("@/views/manage-base-info/Location/components/details"),
          },
          {
            path: "location-view",
            component: () => import("@/views/manage-base-info/location-view"),
          },
          {
            path: "goods",
            component: () => import("@/views/manage-base-info/goods"),
          },
          {
            path: "goods-type",
            component: () => import("@/views/manage-base-info/goods-type"),
          },
        ],
      },
      {
        path: "/manage-storage",
        component: () => import("@/views/manage-storage"),
        children: [
          {
            path: "list",
            component: () => import("@/views/manage-storage/list"),
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
