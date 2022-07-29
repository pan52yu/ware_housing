<template>
  <div>
    <el-card class="table-card">
      <!--   表格区域   -->
      <el-table
        @selection-change="handleSelectionChange"
        v-if="tableData.length"
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
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="warehouseName"
          label="仓库名称"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="areaName"
          label="库区名称"
          width="160"
        ></el-table-column>
        <el-table-column prop="areaCode" label="库位编码" width="160">
        </el-table-column>
        <el-table-column
          sortable
          prop="locationName"
          label="库位名称"
          width="180"
        ></el-table-column>
        <el-table-column
          sortable
          prop="goodsName"
          label="货品名称"
          width="180"
        ></el-table-column>
        <el-table-column
          sortable
          prop="goodsCode"
          label="货品编码"
          width="180"
        ></el-table-column>
        <el-table-column prop="goodsBarCode" label="货品条码" width="160">
        </el-table-column>
        <el-table-column prop="ownerName" label="货主名称" width="160">
        </el-table-column>
        <el-table-column
          prop="stockNum"
          label="库存数量"
          width="160"
        ></el-table-column>
        <el-table-column prop="checkNum" label="实盘数量" width="160">
          <template v-slot="scope">
            <span v-if="$route.params.logicDel.split('&')[0] !== '2'">{{
              scope.row.checkNum
            }}</span>
            <el-row v-else type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-if="isShowInput"
                  v-model.number="scope.row.checkNum"
                ></el-input>
                <span v-else> {{ scope.row.checkNum }}</span>
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
        <el-table-column prop="differenceNum" label="差异" width="160">
          <template v-slot="scope">
            <span>{{ scope.row.checkNum - scope.row.stockNum }}</span>
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
          v-show="$route.params.logicDel.length <= 1"
          @click="$router.back()"
          style="background-color: #ffb200"
          round
          >提交
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { pagingQueryInventoryListingSubsidiary } from "@/api/list";
import { modifyInventoryList } from "@/api/listTask";

export default {
  name: "Details",
  data() {
    return {
      listFormLabel: {
        current: 1,
        size: 10,
        masterId: this.$route.params.id,
        status: this.$route.params.status,
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      isShowInput: false,
    };
  },
  created() {
    this.pagingQueryInventoryListingSubsidiary();
  },
  methods: {
    // 修改实盘数量
    async modifyFirmQuantity(row) {
      try {
        await modifyInventoryList({
          id: row.id,
          checkNum: row.checkNum,
        });
        this.$message.success("修改成功");
        this.isShowInput = false;
      } catch (e) {
        this.$message.error("修改失败");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
      console.log(val);
    },
    // 删除
    deleteWarehouse() {
      this.$notify.info({
        title: "提示",
        duration: 3000,
        message: "演示系统，不支持此操作",
      });
    },
    handleCurrentChange(newPage) {
      this.listFormLabel.current = newPage;
      this.pagingQueryInventoryListingSubsidiary();
    },
    handleSizeChange(newSize) {
      this.listFormLabel.size = newSize;
      this.pagingQueryInventoryListingSubsidiary();
    },
    // 分页查询仓库
    async pagingQueryInventoryListingSubsidiary() {
      const { data } = await pagingQueryInventoryListingSubsidiary(
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
</style>
