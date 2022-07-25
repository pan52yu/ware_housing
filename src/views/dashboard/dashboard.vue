<template>
  <div>
    <div class="divStatic">
      <div class="divLeft">
        <div class="banner">
          <img
            class="img-left"
            src="@/assets/dashboard-banner-left.png"
            alt=""
          />
          <img
            class="img-right"
            src="@/assets/dashboard-banner-right.png"
            alt=""
          />
          <img class="user-header" src="@/assets/avatar.png" />
          <p class="user-title">仓储管理员</p>
          <p class="subject-title">我不是为了输赢，我就是认真！</p>
          <p class="subject-author">—— 罗永浩</p>
          <div class="site">
            <p class="title">北京总仓</p>
          </div>
        </div>

        <el-card class="backlog">
          <p class="title">待办信息</p>
          <el-row>
            <el-col v-for="(item, index) in backlogList" :key="index" :span="8">
              <a href="javascript:void(0)" class="">
                <div class="backlog-item">
                  <div
                    class="icon"
                    :class="{
                      bule: index === 0,
                      yellow: index === 1,
                      orange: index === 2,
                    }"
                  >
                    <i :class="backlogListIcon[index]"></i>
                  </div>
                  <div class="title">{{ item.name }}</div>
                  <div class="bottom">
                    <span class="spanlabel">新增</span>
                    <span class="spanValue">{{ item.value1 }}</span>
                    <span class="spanlabel">待审核</span>
                    <span
                      class="spanValue"
                      :class="{
                        bule: index === 0,
                        yellow: index === 1,
                        orange: index === 2,
                      }"
                      >{{ item.value2 }}</span
                    >
                  </div>
                </div>
              </a>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <el-card class="divRight">
        <div class="subject">通知/公告</div>
        <div class="item" v-for="item in 5" :key="item">
          <div class="hr"></div>
          <div class="title">紧急盘点通知</div>
          <div class="time">2020.12.30 18:23:14</div>
        </div>
      </el-card>
    </div>
    <el-card class="tasks">
      <p class="title">任务导航</p>
      <el-row>
        <el-col>
          <div class="icon" style="background: #0076ff">
            <i class="el-icon-shopping-cart-full"></i>
          </div>
          <div class="title">收货任务</div>
        </el-col>
        <el-col>
          <div class="icon" style="background: #52d4f3">
            <i class="el-icon-upload"></i>
          </div>
          <div class="title">上架任务</div>
        </el-col>
        <el-col>
          <div class="icon" style="background: #ff7100">
            <i class="el-icon-shopping-cart-full"></i>
          </div>
          <div class="title">盘点任务</div>
        </el-col>
        <el-col>
          <div class="icon" style="background: #ff609e">
            <i class="el-icon-s-data"></i>
          </div>
          <div class="title">拣货任务</div>
        </el-col>
        <el-col>
          <div class="icon" style="background: #ffb200">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="title">交接任务</div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="inout-charts">
      <el-row type="flex" justify="space-between">
        <el-col style="font-weight: 600">入库/出库信息</el-col>
        <el-col :span="6">
          <el-radio-group v-model="radio">
            <el-radio-button
              :label="item"
              v-for="(item, index) in radioLabel"
              :key="index"
            ></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <div id="main"></div>
    </el-card>
    <el-row class="libs" type="flex" justify="space-between">
      <el-col :span="8">
        <el-card>
          <el-row>库存使用情况</el-row>
          <div id="pieChartTwo" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card>
          <el-row>库区使用情况</el-row>
          <div id="pieChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getInformation,
  getForInformation,
  getstockUseStatus,
  getAreaUseStatus,
} from "@/api/dashboard";
import * as echarts from "echarts";
import { options, option2, option3 } from "@/utils/echartsInfo";

export default {
  name: "Dashboard",
  data() {
    return {
      // 待办信息列表
      backlogList: [],
      backlogListIcon: [
        "el-icon-s-fold",
        "el-icon-s-unfold",
        "el-icon-s-operation",
      ],
      radioLabel: ["本周", "本月", "全年"],
      radio: "本周",
      dimension: "w",
      options,
      option2,
      option3,
    };
  },
  watch: {
    radio: {
      immediate: true,
      async handler(newVal) {
        if (newVal === "本周") {
          this.dimension = "w";
        } else if (newVal === "本月") {
          this.dimension = "e";
        } else {
          this.dimension = "c";
        }
        await this.getForInformation();
      },
    },
    options: {
      deep: true,
      handler() {
        this.getMyChart();
      },
    },
    option2: {
      deep: true,
      handler() {
        this.getPieChartTwo();
      },
    },
  },
  created() {
    this.getInformation();
    this.getForInformation();
    this.getstockUseStatus();
    this.getAreaUseStatus();
  },
  mounted() {
    this.getMyChart();
    this.getPieChartTwo();
    this.getPieChart();
  },
  methods: {
    // 获取 库区使用情况
    async getAreaUseStatus() {
      await getAreaUseStatus();
      // console.log("getAreaUseStatus", data);
    },
    // 获取库存使用情况
    async getstockUseStatus() {
      try {
        const res = await getstockUseStatus();
        this.option2.series[0].data = res.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    // 获取待办信息
    async getInformation() {
      try {
        const data = await getInformation();
        this.backlogList = data.data.data;
        if (data.status !== 200) {
          return this.$message.error("获取代办信息失败！");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取出库入库信息
    async getForInformation() {
      try {
        const { data } = await getForInformation(this.dimension);
        this.forInformationList = data.data;
        this.options.dataset.source = [];
        this.options.dataset.source[0] = [];
        this.options.dataset.source[0].length =
          this.forInformationList.x.length + 1;
        this.options.dataset.source[0] = ["product", "入库", "出库"];
        this.forInformationList.x.forEach((item, index) => {
          this.options.dataset.source[index + 1] = [];
          this.options.dataset.source[index + 1].push(item);
        });
        this.forInformationList.data[0].data.forEach((item, index) => {
          this.options.dataset.source[index + 1].push(item);
        });
        this.forInformationList.data[1].data.forEach((item, index) => {
          this.options.dataset.source[index + 1].push(item);
        });
      } catch (error) {
        console.log(error);
      }
    },
    getMyChart() {
      const myChart = echarts.init(document.getElementById("main"));
      myChart.setOption(this.options);
    },
    getPieChartTwo() {
      const myChart = echarts.init(document.getElementById("pieChartTwo"));
      myChart.setOption(this.option2);
    },
    getPieChart() {
      const myChart = echarts.init(document.getElementById("pieChart"));
      myChart.setOption(this.option3);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .divStatic {
  width: 100%;
  height: 451px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .divLeft {
    width: calc(100% - 261px);
    padding-right: 30px;

    .banner {
      position: relative;
      width: 100%;
      height: 148px;
      background: linear-gradient(270deg, #ffc771, #ffa634);
      box-shadow: 0 0 6px 0 rgba(188, 151, 69, 0.12);
      border-radius: 12px;

      .img-left,
      .img-right {
        position: absolute;
        top: 0;
        left: 0;
        height: 148px;
      }

      .user-header {
        position: absolute;
        top: 31px;
        left: 43px;
        height: 62px;
      }

      .user-title {
        position: absolute;
        left: 36px;
        bottom: 15px;
        font-size: 16px;
        font-weight: 500;
        color: #332929;
        line-height: 22px;
      }

      .subject-title {
        position: absolute;
        font-weight: 500;
        color: #fff;
        line-height: 25px;
        top: 36px;
        left: 200px;
        font-size: 18px;
      }

      .subject-author {
        top: 76px;
        left: 400px;
        font-size: 16px;
        position: absolute;
        font-weight: 500;
        color: #fff;
        line-height: 25px;
      }

      .site {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 147px;
        height: 40px;
        background: #f8f5f5;
        border-radius: 6px;
        opacity: 0.79;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        .title {
          font-size: 14px;
          font-weight: 500;
          color: #332929;
          line-height: 20px;
        }
      }
    }

    .backlog {
      margin-top: 20px;
      height: 282px;
      background: #fff;
      box-shadow: 0 0 6px 0 rgba(144, 142, 142, 0.17);
      border-radius: 12px;
      padding: 25px;

      .el-card__body {
        padding: 0;
      }

      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #332929;
        line-height: 22px;
      }

      .el-row {
        margin-left: -15px;
        margin-right: -15px;
        margin-top: 30px;

        .el-col {
          padding-left: 15px;
          padding-right: 15px;
          width: 33%;

          a {
            background-color: transparent;
            color: inherit;
            outline: none;
            text-decoration: none;

            .backlog-item {
              position: relative;
              height: 186px;
              background: #fbf7f7;
              border-radius: 8px;
              padding: 20px;
              cursor: pointer;

              &:hover {
                background-color: transparent;
                border: 1px solid #ccc;
              }

              .icon {
                width: 49px;
                height: 49px;

                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                font-size: 32px;
                color: #f8f5f5;

                &.bule {
                  background: #0076ff;
                }

                &.yellow {
                  background: rgb(255, 178, 0);
                }

                &.orange {
                  background: rgb(255, 113, 0);
                }
              }

              .title {
                position: absolute;
                top: 34px;
                left: 85px;
                font-size: 16px;
                font-weight: 500;
                color: #332929;
                line-height: 22px;
              }

              .bottom {
                position: absolute;
                bottom: 20px;

                .spanlabel {
                  font-size: 14px;
                  font-weight: 400;
                  color: #887e7e;
                  margin-right: 10px;
                  vertical-align: super;
                }

                .spanValue {
                  font-size: 36px;
                  font-weight: 500;
                  color: #332929;
                  margin-right: 15px;

                  &.bule {
                    color: rgb(0, 118, 255);
                  }

                  &.yellow {
                    color: rgb(255, 178, 0);
                  }

                  &.orange {
                    color: rgb(255, 113, 0);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .divRight {
    width: 261px;
    height: 441px;
    padding: 30px;
    border-radius: 12px;

    .subject {
      font-size: 16px;
      font-weight: 600;
      color: #332929;
      line-height: 22px;
    }

    .item {
      margin-top: 15px;

      .hr {
        width: 201px;
        height: 1px;
        background-color: #f5efee;
      }

      .title {
        width: 195px;
        height: 18px;
        font-size: 13px;
        font-weight: 400;
        color: #332929;
        line-height: 18px;
        margin-top: 15px;
      }

      .time {
        width: 115px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #887e7e;
        line-height: 17px;
        margin-top: 10px;
      }
    }
  }
}

.tasks {
  margin-top: 75px;
  border-radius: 15px;

  .title {
    margin: 0;
  }

  .el-row {
    margin-top: 20px;
    margin-left: -15px;
    margin-right: -15px;
    width: 103%;

    .el-col {
      width: 17%;
      height: 100px;
      display: flex;
      align-items: center;
      border-radius: 15px;
      background-color: #fbf7f7;
      margin: 0 15px;

      &:hover {
        background-color: transparent;
        border: 1px solid #ccc;
      }

      .icon {
        width: 50px;
        height: 50px;
        margin: 0 20px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        i {
          font-size: 28px;
          color: #f8f5f5;
        }
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #332929;
        line-height: 22px;
      }
    }
  }
}

.inout-charts {
  margin-top: 20px;
  height: 500px;
  border-radius: 15px;
  background: #fff;

  #main {
    height: 430px;
    width: 100%;
  }
}

.libs {
  margin-top: 20px;

  .el-card {
    border-radius: 15px;
    height: 354px;

    .el-row {
      font-weight: 600;
    }

    .chart {
      width: 100%;
      height: 280px;
    }
  }
}
</style>
