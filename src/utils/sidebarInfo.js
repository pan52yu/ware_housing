export const sidebarInfo = [
  {
    title: "基本信息管理",
    index: "/manage-base-info",
    icon: "el-icon-postcard",
    submenu: [
      {
        title: "仓库管理",
        path: "/manage-base-info/warehouse",
        children: [
          {
            title: "新增仓库",
            path: "/manage-base-info/warehouse/details",
          },
        ],
      },
      {
        title: "库区管理",
        path: "/manage-base-info/area",
        children: [
          {
            title: "新增仓库",
            path: "/manage-base-info/warehouse/details",
          },
        ],
      },
      { title: "库位管理", path: "/manage-base-info/location" },
      { title: "库位视图", path: "/manage-base-info/location-view" },
      { title: "货品管理", path: "/manage-base-info/goods" },
      { title: "货品类型管理", path: "/manage-base-info/goods-type" },
    ],
  },
  {
    title: "商务管理",
    index: "/manage-business",
    icon: "el-icon-suitcase",
    submenu: [
      { title: "货主管理", path: "/manage-business/goods-owner" },
      { title: "承运商管理", path: "/manage-business/task-picking" },
    ],
  },
  {
    title: "库内管理",
    index: "/manage-storage",
    icon: "el-icon-house",
    submenu: [
      { title: "盘点单", path: "/manage-storage/list" },
      { title: "盘点任务", path: "/manage-storage/list-task" },
      { title: "库存损益", path: "/manage-storage/storage-lose-profit" },
      { title: "实时库存", path: "/manage-storage/latest-storage" },
    ],
  },
  {
    title: "入库管理",
    index: "/manage-storage-in",
    icon: "el-icon-sell",
    submenu: [
      { title: "入库单", path: "/manage-storage-in/list-in/list" },
      { title: "收货任务", path: "/manage-storage-in/list-in/task-receive" },
      { title: "上架任务", path: "/manage-storage-in/list-in/task-add" },
    ],
  },
  {
    title: "出库管理",
    index: "/manage-storage-out",
    icon: "el-icon-sold-out",
    submenu: [
      { title: "出货单", path: "/manage-storage-out/list-out" },
      { title: "拣货任务", path: "/manage-storage-out/task-picking" },
      { title: "交接任务", path: "/manage-storage-out/manage-task-transfer" },
    ],
  },
];
