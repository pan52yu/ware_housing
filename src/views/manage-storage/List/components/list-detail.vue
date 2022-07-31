<template>
  <div class="detail">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1">
          <el-steps
            :active="goodsOwnerList?.status"
            finish-status="finish"
            v-if="goodsOwnerList?.status !== 6"
          >
            <el-step
              title="新建"
              :description="goodsOwnerList?.createTime"
            ></el-step>
            <el-step
              title="一盘中"
              :description="goodsOwnerList?.createTime"
            ></el-step>
            <el-step title="一盘完成"></el-step>
            <el-step title="复盘中"></el-step>
            <el-step title="复盘完成"></el-step>
          </el-steps>
          <el-steps
            v-else
            :active="goodsOwnerList?.status"
            finish-status="finish"
          >
            <el-step
              title="新建"
              :description="goodsOwnerList?.createTime"
            ></el-step>
            <el-step
              title="已取消"
              :description="goodsOwnerList?.createTime"
            ></el-step>
          </el-steps>
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>盘点单号</p>
                  <span>{{ goodsOwnerList?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>创建时间</p>
                  <span>{{ goodsOwnerList?.createTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>计划盘点时间</p>
                  <span>{{ goodsOwnerList?.planCheckTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点原因</p>
                  <span>{{
                    goodsOwnerList?.reason === "GH"
                      ? "规划"
                      : goodsOwnerList?.reason === "HZ"
                      ? "货主"
                      : "差异"
                  }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>盘点维度</p>
                  <span>
                    {{
                      goodsOwnerList?.dimension === "KW" ? "库位" : "货品"
                    }}</span
                  >
                </el-col>
                <el-col :span="6">
                  <p>盘点类型</p>
                  <span>{{
                    goodsOwnerList?.type === "SJPD" ? "随机盘点" : "计划盘点"
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点仓库</p>
                  <span>{{ goodsOwnerList?.warehouseName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点库区</p>
                  <span>{{ goodsOwnerList?.areaName }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-collapse>
        <el-collapse-item title="盘点清单">
          <div class="infoTip">
            总计：{{ total }}个库位 {{ goodsTotal }}个 货品
          </div>
          <!--   表格区域   -->
          <el-table
            :data="tableData"
            :header-cell-style="{
              'text-align': 'center',
              'background-color': '#f9f6ee',
            }"
            :cell-style="{
              'text-align': 'center',
              padding: '6px',
              'font-size': '13px',
            }"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
            ></el-table-column>
            <el-table-column prop="areaName" label="库区名称"></el-table-column>
            <el-table-column
              prop="locationName"
              label="库位名称"
            ></el-table-column>
            <el-table-column
              prop="goodsCode"
              label="货品编码"
            ></el-table-column>
            <el-table-column
              prop="goodsBarCode"
              label="货品条码"
            ></el-table-column>
            <el-table-column
              prop="goodsName"
              label="货品名称"
            ></el-table-column>
            <el-table-column prop="stockNum" label="库存数量"></el-table-column>
          </el-table>
          <!--   分页   -->
          <el-row type="flex" style="margin-top: 20px" justify="center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryList.current"
              :page-sizes="[5, 10, 30, 40]"
              :page-size="queryList.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="盘点任务">
          <div class="infoTip">
            {{ goodsOwnerList?.checkTaskEntity2 === null ? "一盘" : "复盘" }}
          </div>
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>任务编号</p>
                  <span>{{ goodsOwnerList?.checkTaskEntity1?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点次数</p>
                  <span>{{ goodsOwnerList?.checkNum }}</span>
                </el-col>
                <el-col :span="6">
                  <p>任务状态</p>
                  <span>{{
                    goodsOwnerList?.status === 1
                      ? "待分配"
                      : goodsOwnerList?.status === 2
                      ? "盘点中"
                      : goodsOwnerList?.status === 3
                      ? "盘点已完成"
                      : "已生成损益"
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>开始时间</p>
                  <span>{{ goodsOwnerList?.planCheckTime }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>完成时间</p>
                  <span>{{ goodsOwnerList?.updateTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点人</p>
                  <span>{{ goodsOwnerList?.ownerName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>盘点数量</p>
                  <span>{{ goodsOwnerList?.checkTotal }}</span>
                </el-col>
                <el-col :span="6">
                  <p>损益合计</p>
                  <span>{{
                    goodsOwnerList?.id1Money + goodsOwnerList?.id2Money
                  }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { forDetails, pagingQueryInventoryListingSubsidiary } from "@/api/list";

export default {
  name: "list-detail",
  data() {
    return {
      activeNames: ["1"],
      tableData: [],
      total: 0,
      goodsTotal: 0,
      goodsOwnerList: [],
      queryList: {
        current: 1,
        size: 10,
        masterId: this.$route.params.id,
        status: 1,
      },
    };
  },
  created() {
    this.forDetails();
    this.pagingQueryInventoryListingSubsidiary();
  },
  methods: {
    async forDetails() {
      console.log(this.$route);
      const { data } = await forDetails(this.$route.params.id);
      this.goodsOwnerList = data.data;
      this.goodsTotal = data.data.goodsTotal;
    },
    async pagingQueryInventoryListingSubsidiary() {
      const { data } = await pagingQueryInventoryListingSubsidiary(
        this.queryList
      );
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleCurrentChange(newPage) {
      this.queryList.current = newPage;
      this.pagingQueryInventoryListingSubsidiary();
    },
    handleSizeChange(newSize) {
      this.queryList.size = newSize;
      this.pagingQueryInventoryListingSubsidiary();
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  width: 70%;
  margin: 30px auto;
}

.main {
  padding: 20px 0 0;

  .baseInfo {
    background: #fdfcf9;
    border: 1px solid #f7f2f1;
    padding: 25px 30px;
  }
}

.infoTip {
  display: inline-block;
  height: 32px;
  line-height: 30px;
  background: #fff9eb;
  border: 1px solid #ffb200;
  padding: 0 25px;
  margin: 20px 0;
}
</style>
