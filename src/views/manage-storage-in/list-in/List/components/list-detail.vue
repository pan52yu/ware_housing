<template>
  <div class="detail">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1">
          <!--     已取消时显示     -->
          <el-steps
            :active="goodsOwnerList?.status"
            finish-status="finish"
            v-if="this.goodsOwnerList?.status === 3"
          >
            <el-step
              title="新建"
              :description="goodsOwnerList?.timeArray[0]"
            ></el-step>
            <el-step
              title="已取消"
              :description="goodsOwnerList?.timeArray[1]"
            ></el-step>
          </el-steps>
          <!--     不取消时显示     -->
          <el-steps
            :active="goodsOwnerList.status"
            finish-status="finish"
            v-else
          >
            <el-step
              title="新建"
              :description="goodsOwnerList.timeArray[0]"
            ></el-step>
            <el-step
              title="收货中"
              :description="goodsOwnerList.timeArray[1]"
            ></el-step>
            <el-step
              title="收货完成"
              :description="goodsOwnerList.timeArray[2]"
            ></el-step>
            <el-step
              title="上架中"
              :description="goodsOwnerList.timeArray[3]"
            ></el-step>
            <el-step
              title="上架完成"
              :description="goodsOwnerList.timeArray[4]"
            ></el-step>
          </el-steps>
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>入库单号</p>
                  <span>{{ goodsOwnerList?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>创建时间</p>
                  <span>{{ goodsOwnerList?.createTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>计划到达时间</p>
                  <span>{{ goodsOwnerList?.planArrivalTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>仓库名称</p>
                  <span>{{ goodsOwnerList?.warehouseName }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card v-show="goodsOwnerList.status !== 3">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="货主信息">
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>货主编号</p>
                  <span>{{ goodsOwnerList?.owner?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>货主名称</p>
                  <span>{{ goodsOwnerList?.owner?.name }}</span>
                </el-col>
                <el-col :span="6">
                  <p>联系人</p>
                  <span>{{ goodsOwnerList?.owner?.personName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>联系电话</p>
                  <span>{{ goodsOwnerList?.owner?.phone }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card v-show="goodsOwnerList.status !== 3">
      <el-collapse>
        <el-collapse-item title="货品信息">
          <div class="infoTip">
            总计：{{ goodsOwnerList?.planNum }}个 总体积{{ goodsTotal }}m³
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
              prop="ownerName"
              label="货主名称"
            ></el-table-column>
            <el-table-column
              prop="goodsCode"
              label="货品编号"
            ></el-table-column>
            <el-table-column
              prop="goodsName"
              label="货品名称"
            ></el-table-column>
            <el-table-column
              prop="goodsCode"
              label="货品类型"
            ></el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="货品单价（元）"
            ></el-table-column>
            <el-table-column
              prop="goodsGuaranteeDay"
              label="质保天数（天）"
            ></el-table-column>
            <el-table-column prop="goodsUnit" label="单位"></el-table-column>
            <el-table-column
              prop="goodsVolume"
              label="体积（m³）"
            ></el-table-column>
            <el-table-column
              prop="planNum"
              label="预计到货数"
            ></el-table-column>
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
    <el-card v-show="goodsOwnerList.status !== 3">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="运输信息">
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>运单编号</p>
                  <span>{{ goodsOwnerList?.billCode }}</span>
                </el-col>
                <el-col :span="6">
                  <p>承运商</p>
                  <span>{{ goodsOwnerList?.carrierName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>计划到达时间</p>
                  <span>{{ goodsOwnerList?.planArrivalTime }}</span>
                </el-col>
                <el-col :span="6">
                  <p>发货人姓名</p>
                  <span>{{ goodsOwnerList?.shipperName }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>送货人姓名</p>
                  <span>{{ goodsOwnerList?.deliveryName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>送货人电话</p>
                  <span>{{ goodsOwnerList?.deliveryPhone }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card v-show="goodsOwnerList.status !== 3">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="盘点任务">
          <div class="infoTip">收货任务</div>
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>任务编号</p>
                  <span>{{ goodsOwnerList?.receivingEntity?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>任务状态</p>
                  <span>{{ goodsOwnerList?.receivingEntity?.status }}</span>
                </el-col>
                <el-col :span="6">
                  <p>收货人</p>
                  <span>{{
                    goodsOwnerList?.receivingEntity?.receiverName
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>开始时间</p>
                  <span>{{ goodsOwnerList?.receivingEntity?.createTime }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>完成时间</p>
                  <span>{{
                    goodsOwnerList?.receivingEntity?.completionTime
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>实收数量</p>
                  <span>{{ goodsOwnerList?.receivingEntity?.realNum }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="infoTip">上架任务</div>
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>任务编号</p>
                  <span>{{ goodsOwnerList?.groundingEntity?.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>任务状态</p>
                  <span>{{ goodsOwnerList?.groundingEntity?.status }}</span>
                </el-col>
                <el-col :span="6">
                  <p>上架人</p>
                  <span>{{ goodsOwnerList?.groundingEntity?.personName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>开始时间</p>
                  <span>{{ goodsOwnerList?.groundingEntity?.createTime }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>完成时间</p>
                  <span>{{
                    goodsOwnerList?.groundingEntity?.completionTime
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>实上数量</p>
                  <span>{{ goodsOwnerList?.groundingEntity?.planNum }}</span>
                </el-col>
                <el-col :span="6">
                  <p>差异合计</p>
                  <span>{{
                    goodsOwnerList?.groundingEntity?.differenceNum
                  }}</span>
                </el-col>
                <el-col :span="6">
                  <p>损益合计</p>
                  <span>{{ goodsOwnerList?.idMoney }}</span>
                </el-col>
              </el-row>
              <el-row>损益明细</el-row>
              <!--   表格区域   -->
              <el-table
                :data="goodsOwnerList.idList"
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
                  prop="code"
                  label="损益单号"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="warehouseName"
                  label="仓库名称"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="locationName"
                  label="库位名称"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="ownerName"
                  label="货主名称"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="货品名称"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="idNum"
                  label="损益明细"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="idMoney"
                  label="损益金额(元)"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="updateTime"
                  label="处理时间"
                  width="80"
                ></el-table-column>
                <el-table-column prop="status" label="损益单状态" width="80">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import {
  forDetails,
  pagingQueryInventoryListingSubsidiary,
} from "@/api/list-in";

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
      timeList: [],
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
      if (this.goodsOwnerList.status !== 3) {
        console.log(2222);
        const { data } = await pagingQueryInventoryListingSubsidiary(
          this.queryList
        );
        this.tableData = data.data.records;
        this.total = data.data.total - 0;
      }
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

.el-card {
  margin-top: 20px;
}
</style>
