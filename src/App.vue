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
::-webkit-scrollbar {
  background-color: #efebea;
  border-radius: 10px;
  width: 10px; //y轴滚动条宽度
  height: 10px; //x轴滚动条高度
}

/*定义滑块 内阴影*/
::-webkit-scrollbar-thumb {
  border-radius: 10px; //滚动条的圆角
  background: #efebea; //滚动条的背景颜色
}

/*定义滚动条轨道 内阴影*/
::-webkit-scrollbar-track {
  border-radius: 10px; //滚动条的背景区域的圆角
  background: #fff; //滚动条的背景颜色
}
</style>
