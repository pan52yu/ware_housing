<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>
<style lang="less">
.el-table--scrollable-x .el-table__body-wrapper {
  padding-bottom: 5px;
  margin-bottom: 5px;
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  padding-bottom: 5px;
  margin-bottom: 5px;
}

/* Scroll bar slider */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #efebea;
  //-webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background: #e0d8d6;
}
</style>
