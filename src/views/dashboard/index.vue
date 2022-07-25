<template>
  <div class="dashboard">
    <el-container>
      <!--   侧边栏   -->
      <el-aside width="200px">
        <!--    头部logo    -->
        <div class="bgTitle">
          <img src="@/assets/logintitle.png" alt="" />
        </div>
        <!--    侧边导航    -->
        <el-row>
          <el-col>
            <el-menu
              router
              unique-opened
              :default-active="$route.path"
              class="el-menu-vertical-demo"
            >
              <el-menu-item index="/dashboard" @click="changCountVal(0)">
                <i class="el-icon-menu"></i>
                <span slot="title">工作台</span>
              </el-menu-item>
              <!-----  一级菜单 ---->
              <el-submenu
                v-for="item in sidebarInfo"
                :key="item.index"
                :index="item.index"
              >
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <!----  二级菜单S  ---->
                <el-menu-item
                  v-for="(itemTwo, indexTwo) in item.submenu"
                  :key="indexTwo"
                  @click="addTab(itemTwo)"
                  :index="itemTwo.path"
                  >{{ itemTwo.title }}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
        <!--    底部用户信息    -->
        <div class="sidebar-tools">
          <img class="img" src="@/assets/avatar.png" alt="" />
          <div class="title">admin</div>
          <div class="divSplit"></div>
          <img class="tc" src="@/assets/tc.png" alt="" />
        </div>
      </el-aside>

      <el-container>
        <!--   头部   -->
        <el-header>
          <div class="tags">
            <el-tag
              :class="{ yellow: countVal === index }"
              v-for="(item, index) in tabList"
              :key="index"
              :closable="index !== 0"
              @close="handleClose(index)"
              @click="toggleTab(index)"
              effect="plain"
              >{{ item.title }}
            </el-tag>
          </div>
          <el-dropdown @command="handleCommand">
            <i class="el-icon-arrow-down el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in dropdownList"
                :key="index"
                :command="index"
                :icon="item.icon"
                >{{ item.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!--    内容区域    -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { sidebarInfo } from "@/utils/sidebarInfo";
import { mapMutations, mapState } from "vuex";
import { removeLocal, setLocal } from "@/utils/storage";

export default {
  name: "Dashboard",
  data() {
    return {
      sidebarInfo,
      dropdownList: [
        { icon: "el-icon-back", title: "关闭左侧" },
        { icon: "el-icon-right", title: "关闭右侧" },
        { icon: "el-icon-close", title: "关闭其他" },
        { icon: "el-icon-error", title: "关闭全部" },
      ],
    };
  },
  mounted() {
    this.setCurrentIndex(this.$route.path);
    this.countVals();
  },
  beforeDestroy() {
    removeLocal("tabList");
  },
  watch: {
    countVal(val) {
      removeLocal("tabList");
      if (val !== 0) {
        setLocal(
          "tabList",
          this.tabList.slice(this.countVal, this.countVal + 1)
        );
      }
      this.$router.push({ path: this.tabList[val].path }).catch((err) => {
        return err;
      });
    },
    $route(to) {
      console.log("route", to);
      this.addTabs(to);
      this.sidebarInfo.forEach((item) => {
        item.submenu.forEach((i) => {
          if (i.path === to.path) {
            this.addTabs(i);
          }
        });
      });
    },
  },
  computed: {
    ...mapState(["tabList", "countVal", "currentIndex"]),
  },
  methods: {
    ...mapMutations([
      "addTabs",
      "deleteTabs",
      "changCountVal",
      "setCurrentIndex",
      "countVals",
    ]),
    addTab(item) {
      console.log("addTab", item);
      this.setCurrentIndex(item.path);
      this.addTabs(item);
    },
    toggleTab(index) {
      this.changCountVal(index);
    },
    handleClose(index) {
      this.deleteTabs(index);
    },
    handleCommand(command) {
      console.log(command);
    },
  },
};
</script>

<style lang="less" scoped>
.bg {
  background-color: pink;
}

.dashboard {
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1300px;
  margin: 0 auto;
}

.el-row {
  margin-right: -20px;
  height: calc(100% - 163px);
  overflow: auto;
  overflow-y: scroll;
}

.bgTitle {
  position: relative;
  width: 100%;
  height: 100px;
  line-height: 100px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    display: block;
    width: 150px;
    height: 64px;
  }
}

.sidebar-tools {
  height: 62px;
  width: 226px;
  background-color: #fff;
  border-top: 1px solid #f5efee;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;

  .img {
    width: 32px;
    height: 32px;
    margin-left: 41px;
    margin-right: 14px;
  }

  .title {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #332929;
    line-height: 20px;
  }

  .divSplit {
    height: 17px;
    border-left: 1px solid #d9d0cf;
    border-right: 0;
    margin-left: 17px;
    margin-right: 17px;
  }

  .tc {
    width: 21px;
    height: 21px;
    cursor: pointer;
  }
}

/deep/ .el-header {
  display: flex;
  align-items: center;

  .tags {
    .el-tag {
      color: #b5abab;
      font-size: 13px;
      border: none;
      margin-left: 10px;
    }

    i {
      color: #b5abab;
    }

    .yellow {
      color: #ffb200;
    }
  }

  .el-dropdown {
    position: absolute !important;
    right: 34px;
    top: 14px;
    border-radius: 6px;
    background-color: #fff;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      margin: 0;
      color: #1f2d3d;
    }
  }
}
</style>
