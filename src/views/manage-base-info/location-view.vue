<template>
  <div class="location-view">
    <el-card>
      <div class="divLocationViewCondition">
        <p>库区选择</p>
        <el-select v-model="value" placeholder="请选择" value="">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-card class="rightBottom">
          <el-input
            placeholder="请输入库区的名称"
            v-model="AreaName"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <div v-if="currentLocation.length">
            <div
              :class="['btnDiv', { itemActive: index === currentIndex }]"
              v-for="(item, index) in LocationList"
              :key="item.id"
              @click="toggleLocation(index, item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="divAreaDetails" v-else>
            <div class="divNoArea">
              <div class="divFontDisplay">暂无库区</div>
              <el-button
                @click.native="
                  $router.push('/manage-base-info/area/details/null')
                "
                type="success"
                class="importantButton"
                round
                >新增库区
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="divDivision"></div>
      <div class="divLocationViewDisplay">
        <div class="divTop">
          <div class="divTitle">库区总览</div>
          <div class="divOverView">
            <div class="divItem">
              <span class="spanLabel"> 库存总计: </span>
              <span>{{ overviewList.total }}</span>
            </div>
            <div class="divItem">
              <div
                class="divSquare"
                style="
                  background-color: rgb(195, 195, 195);
                  width: 12px;
                  height: 12px;
                  border-radius: 3px;
                "
              ></div>
              <span class="spanLabel"> 停用库位: </span>
              <span>{{ overviewList.stop }}</span>
            </div>
            <div class="divItem">
              <div
                class="divSquare"
                style="
                  background-color: rgb(0, 190, 118);
                  width: 12px;
                  height: 12px;
                  border-radius: 3px;
                "
              ></div>
              <span class="spanLabel"> 占用库位: </span>
              <span>{{ overviewList.use }}</span>
            </div>
            <div class="divItem">
              <div
                class="divSquare"
                style="
                  background-color: rgb(178, 220, 204);
                  width: 12px;
                  height: 12px;
                  border-radius: 3px;
                "
              ></div>
              <span class="spanLabel"> 空闲库位: </span>
              <span>{{ overviewList.free }}</span>
            </div>
          </div>
        </div>
        <div class="divContent" v-if="this.overviewList.total !== 0">
          <el-popover
            placement="bottom"
            width="200"
            :visible-arrow="false"
            trigger="hover"
            v-for="(item, index) in useList"
            :key="index"
          >
            <template>
              <p>
                库位编号:<span>{{ item.areaCode }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.name }}</span>
              </p>
              <p>
                库位位置:<span
                  >{{ item.locationColumn }}排{{ item.locationLayer }}列{{
                    item.locationRow
                  }}层</span
                >
              </p>
              <p>
                库位状态:<span>{{ item.status === 0 ? "停用" : "空闲" }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.areaName }}</span>
              </p>
              <p>
                库位数量:<span>{{ item.goodsTotal }}</span>
              </p>
            </template>
            <el-button class="popoverBtnUse" slot="reference"></el-button>
          </el-popover>
          <el-popover
            placement="bottom"
            width="200"
            :visible-arrow="false"
            trigger="hover"
            v-for="(item, index) in stopList"
            :key="index"
          >
            <template>
              <p>
                库位编号:<span>{{ item.areaCode }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.name }}</span>
              </p>
              <p>
                库位位置:<span
                  >{{ item.locationColumn }}排{{ item.locationLayer }}列{{
                    item.locationRow
                  }}层</span
                >
              </p>
              <p>
                库位状态:<span>{{ item.status === 0 ? "停用" : "空闲" }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.areaName }}</span>
              </p>
              <p>
                库位数量:<span>{{ item.goodsTotal }}</span>
              </p>
            </template>
            <el-button class="popoverBtnFree" slot="reference"></el-button>
          </el-popover>
          <el-popover
            placement="bottom"
            width="200"
            :visible-arrow="false"
            trigger="hover"
            v-for="(item, index) in freeList"
            :key="index"
          >
            <template>
              <p>
                库位编号:<span>{{ item.areaCode }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.name }}</span>
              </p>
              <p>
                库位位置:<span
                  >{{ item.locationColumn }}排{{ item.locationLayer }}列{{
                    item.locationRow
                  }}层</span
                >
              </p>
              <p>
                库位状态:<span>{{ item.status === 0 ? "停用" : "空闲" }}</span>
              </p>
              <p>
                库位名称:<span>{{ item.areaName }}</span>
              </p>
              <p>
                库位数量:<span>{{ item.goodsTotal }}</span>
              </p>
            </template>
            <el-button class="popoverBtnFree" slot="reference"></el-button>
          </el-popover>
        </div>
        <div class="emptyTip" v-else>
          <span class="imgIcon"></span>
          <p>暂无库位</p>
          <el-button
            @click.native="
              $router.push('/manage-base-info/location/details/null')
            "
            type="success"
            class="importantButton"
            round
            >新增库位
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryAllWarehouse, queryTheOverview } from "@/api/area";
import { queryAllArea, queryAllLocation } from "@/api/location";

export default {
  name: "location-view",
  data() {
    return {
      options: [],
      value: "",
      AreaName: "",
      LocationList: [],
      currentIndex: 0, // 控制按钮高亮
      currentLocation: [],
      overviewList: [],
      stopList: [],
      freeList: [],
      useList: [],
    };
  },
  watch: {
    value: {
      handler(newValue) {
        this.queryAllArea(newValue, null);
      },
    },
    AreaName: {
      handler(newValue) {
        this.queryAllArea(this.value, newValue);
      },
    },
  },
  created() {
    this.queryAllWarehouse();
  },
  methods: {
    // 查询全部仓库列表
    async queryAllWarehouse() {
      const { data } = await queryAllWarehouse();
      data.data.forEach((item) => {
        this.options.push({
          value: item.id,
          label: item.name,
        });
      });
      this.value = this.options[0].value;
    },
    // 库区列表
    async queryAllArea(id, name) {
      const { data } = await queryAllArea({
        warehouseId: id,
        status: 1,
        like_name: name,
      });
      this.LocationList = data.data;
      if (this.LocationList.length) {
        await this.toggleLocation(this.currentIndex, this.LocationList[0].id);
      } else {
        this.currentLocation = [];
        this.stopList = [];
        this.useList = [];
        this.freeList = [];
        this.overviewList = {
          free: 0,
          stop: 0,
          total: 0,
          use: 0,
        };
      }
    },
    async toggleLocation(index, id) {
      this.currentIndex = index;
      const { data } = await queryAllLocation({
        areaId: id,
      });
      this.currentLocation = data.data;
      this.stopList = data.data.filter((item) => item.useStatus === 2) || [];
      this.useList = data.data.filter((item) => item.useStatus === 1) || [];
      this.freeList = data.data.filter((item) => item.useStatus === 0) || [];
      const result = await queryTheOverview(id);
      this.overviewList = result.data.data;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .popoverBtnFree {
  margin-right: 10px;
  background-color: rgb(178, 220, 204);
  width: 36px;
  padding: 0;
  height: 36px;
  border-radius: 3px;
}

.popoverBtnUse {
  margin-right: 10px;
  background-color: rgb(0, 190, 118);
  width: 36px;
  padding: 0;
  height: 36px;
  border-radius: 3px;
}

.popoverBtnStop {
  margin-right: 10px;
  background-color: rgb(195, 195, 195);
  width: 36px;
  padding: 0;
  height: 36px;
  border-radius: 3px;
}

/deep/ .el-card__body {
  height: 550px;
  display: flex;
  padding: 0;

  .rightBottom {
    .el-card__body {
      display: unset;
    }

    .divAreaDetails {
      height: calc(100vh - 360px);
      position: relative;

      .divNoArea {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .divFontDisplay {
          width: 56px;
          height: 20px;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          color: #b5abab;
          line-height: 20px;
          margin: 0 auto 19px;
        }

        .importantButton {
          width: 126px;
        }
      }
    }

    .btnDiv {
      width: 140px;
      height: 40px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 0 6px 0 rgb(255 178 0 / 40%);
      margin: 0 auto;
      margin-top: 20px;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      color: #ffb200;
      line-height: 40px;
      cursor: pointer;

      &.itemActive {
        background: #ffb200;
        color: #332929;
      }
    }
  }

  .divLocationViewCondition {
    width: 263px;
    padding: 27px 19px 27px 25px;

    p {
      margin-top: 0;
    }

    .el-select {
      width: 100%;

      .el-input__inner {
        background-color: #f8f5f5;
      }
    }

    .rightBottom {
      margin: 20px 0;
      height: 400px;
      background: #fdfcf9;
      border: 1px solid #f7f2f1;
      border-radius: 6px;
      padding: 30px 29px 0 26px;

      .el-input-group {
        height: 40px;

        .el-button {
          padding: 12px;
        }
      }
    }
  }

  .divDivision {
    width: 10px;
    height: 100%;
    background: linear-gradient(
      270deg,
      hsla(0, 0%, 100%, 0),
      rgba(99, 97, 96, 0.1)
    );
  }

  .divLocationViewDisplay {
    padding: 27px 19px 27px 20px;
    height: 100%;
    flex: 1;

    .divTop {
      margin-bottom: 21px;
      height: 22px;

      .divTitle {
        width: 64px;
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        color: #332929;
        line-height: 22px;
        float: left;
        margin-right: 103px;
      }

      .divOverView {
        float: left;

        .divItem {
          float: left;
          margin-right: 43px;

          .spanLabel {
            float: left;
            margin-right: 4px;
            width: 70px;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #424250;
          }

          .divSquare {
            float: left;
            margin-top: 5px;
            margin-right: 7px;
          }
        }
      }
    }

    .divContent {
      width: 100%;
      height: calc(100% - 43px);
      overflow-y: auto;
    }

    .emptyTip {
      border-top: 1px solid #f5efee;
      padding: 100px 0;
      margin: 0 auto;
      color: #b5abab;
      text-align: center;
      font-size: 14px;

      .imgIcon {
        width: 160px;
        height: 160px;
        display: inline-block;
        background: url(@/assets/empty.png) no-repeat;
        background-size: contain;
      }

      p {
        padding: 5px 0 0;
      }

      .importantButton {
        margin-top: 20px;
      }
    }
  }
}
</style>
