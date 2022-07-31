<template>
  <div>
    <el-card class="table-card">
      <el-row>
        <div class="infoTip">
          计划数量：<span>{{ sum.goodsTotal }}</span> 实拣：<span>{{
            sum.pickingTotal
          }}</span>
        </div>
      </el-row>
      <div class="main">
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
          <el-table-column prop="goodsCode" label="货品编码"></el-table-column>
          <el-table-column prop="goodsBarCode" label="货品条码" width="160">
          </el-table-column>
          <el-table-column prop="goodsName" label="货品名称" width="160">
          </el-table-column>
          <el-table-column
            prop="goodsTypeName"
            label="货品类型"
          ></el-table-column>
          <el-table-column prop="areaName" label="库区"></el-table-column>
          <el-table-column prop="locationName" label="库位"></el-table-column>
          <el-table-column prop="outboundNum" label="拣货数量">
          </el-table-column>
          <el-table-column prop="pickingNum" label="实拣数量">
            <template v-slot="scope">
              <span v-if="$route.params.detail !== 'null'">{{
                scope.row.pickingNum
              }}</span>
              <el-row v-else type="flex" justify="space-between">
                <el-col :span="20">
                  <el-input
                    v-if="isShowInput"
                    v-model.number="scope.row.pickingNum"
                  ></el-input>
                  <span v-else> {{ scope.row.pickingNum }}</span>
                </el-col>
                <el-col :span="4">
                  <div @click="isShowInput = true" v-if="!isShowInput">
                    <i
                      style="color: #ffbd25; font-size: 20px"
                      class="el-icon-edit-outline"
                    ></i>
                  </div>
                  <div v-else>
                    <i
                      @click="modifyFirmQuantity(scope.row)"
                      style="color: #ffbd25; font-size: 20px"
                      class="el-icon-check"
                    ></i>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="differenceNum" label="差异数">
            <template v-slot="scope">
              {{ scope.row.outboundNum - scope.row.pickingNum }}
            </template>
          </el-table-column>
        </el-table>
        <!--   分页   -->
        <el-row type="flex" justify="center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listFormLabel.current"
            :page-sizes="[5, 10, 30, 40]"
            :page-size="listFormLabel.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button @click="$router.back()" round>返回</el-button>
          <el-button
            v-show="$route.params.detail === 'null'"
            @click="$router.back()"
            style="background-color: #ffb200"
            round
            >提交
          </el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  aggregateInformationQuery,
  modifyPicking,
  pagingQueryOutboundListingSubsidiary,
} from "@/api/list-out";

export default {
  name: "Sure",
  data() {
    return {
      listFormLabel: {
        current: 1,
        size: 10,
        masterId: this.$route.params.id,
      },
      total: 0,
      tableData: [],
      sum: [],
      isShowInput: false,
    };
  },
  created() {
    this.pagingQueryOutboundListingSubsidiary();
    this.aggregateInformationQuery();
  },
  methods: {
    // 修改实盘数量
    async modifyFirmQuantity(row) {
      try {
        await modifyPicking({
          id: row.id,
          pickingNum: row.pickingNum,
        });
        this.$message.success("修改成功");
        this.isShowInput = false;
      } catch (e) {
        this.$message.error("修改失败");
      }
    },
    async aggregateInformationQuery() {
      try {
        const { data } = await aggregateInformationQuery(this.$route.params.id);
        console.log(data);
        this.sum = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    handleCurrentChange(newPage) {
      this.listFormLabel.current = newPage;
      this.pagingQueryOutboundListingSubsidiary();
    },
    handleSizeChange(newSize) {
      this.listFormLabel.size = newSize;
      this.pagingQueryOutboundListingSubsidiary();
    },
    // 分页查询仓库
    async pagingQueryOutboundListingSubsidiary() {
      const { data } = await pagingQueryOutboundListingSubsidiary(
        this.listFormLabel
      );

      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}

.el-form {
  /deep/ .el-form-item__label {
    color: #887e7e;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: -10px;
  }

  /deep/ .el-input__inner {
    border-radius: 10px;
    background-color: #f8f5f5 !important;
  }

  .el-input {
    /deep/ input {
      border-radius: 10px;
      background-color: #f8f5f5 !important;
    }
  }

  .submit {
    padding: 40px 0 0 60px;
  }
}

/deep/ .table-card {
  margin-top: 20px;

  .el-card__body {
    padding: 20px 0 0 0 !important;
  }

  .el-table {
    margin-top: 20px;
    text-align: center;
  }
}

/deep/ .el-table .statistics-warning-row2 {
  background-color: #fdfcf9;
}

/deep/ .el-table tbody tr:hover > td {
  background-color: #fff6e2;
}

.el-pagination {
  margin: 20px 0;
}

.emptyTip {
  border-top: 1px solid #f5efee;
  padding: 100px 0;
  margin: 0 auto;
  color: #b5abab;
  font-size: 14px;
  text-align: center;

  .imgIcon {
    width: 160px;
    height: 160px;
    display: inline-block;
    background: url(@/assets/empty.png) no-repeat;
    background-size: contain;
  }
}

.el-dialog__body {
  background: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 23px;
  padding: 21px 20px 14px 21px;

  .spanSubTitle {
    height: 24px;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    color: #332929;
    line-height: 24px;
  }

  .divFailureMsg {
    color: red;
  }

  .divItemList {
    overflow: auto;
    position: relative;
    height: 70px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #b5abab;
    line-height: 22px;
    padding-right: 10px;
  }
}

.infoTip {
  display: inline-block;
  height: 32px;
  line-height: 30px;
  background: #fff9eb;
  border: 1px solid #ffb200;
  padding: 0 25px;

  span {
    color: #ffb200;
  }
}
</style>
