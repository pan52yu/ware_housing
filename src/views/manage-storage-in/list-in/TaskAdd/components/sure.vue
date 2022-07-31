<template>
  <div>
    <el-card class="table-card">
      <el-row>
        <el-col :span="2">
          <span>上架进度</span>
        </el-col>
        <el-col :span="7">
          <el-progress
            style="width: 300px"
            :percentage="progressOf"
          ></el-progress>
        </el-col>
        <el-col :span="4"
          ><span
            >{{ sumList.goodsGroundingTotal }}/{{
              sumList.goodsRealTotal
            }}</span
          ></el-col
        >
      </el-row>
      <!--   表格区域   -->
      <el-table
        @selection-change="handleSelectionChange"
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
          prop="goodsCode"
          label="货品编号"
          width="160"
        ></el-table-column>
        <el-table-column prop="goodsName" label="货品名称" width="160">
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="货品类型"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="ownerName"
          label="货主名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="warehouseName"
          label="仓库"
          width="180"
        ></el-table-column>
        <el-table-column prop="realNum" label="货品数量" width="160">
        </el-table-column>
        <el-table-column prop="groundingNum" label="实上数量" width="160">
        </el-table-column>
        <el-table-column
          prop="groundingDifferenceNum"
          label="差异数"
          width="160"
        >
        </el-table-column>
        <!--        <el-table-column prop="realNum" label="实收总数" width="160">
                  <template v-slot="scope">
                    <span v-if="$route.params.id !== 'null'">{{
                      scope.row.realNum
                    }}</span>
                    <el-row v-else type="flex" justify="space-between">
                      <el-col :span="20">
                        <el-input
                          v-if="isShowInput"
                          v-model.number="scope.row.realNum"
                        ></el-input>
                        <span v-else> {{ scope.row.realNum }}</span>
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
                </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="220">
          <template v-slot="scope">
            <el-button
              @click="checkInformationOn(scope.row)"
              type="text"
              size="small"
            >
              查看上架信息
            </el-button>
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
          v-show="$route.params.id === 'null'"
          @click="$router.back()"
          style="background-color: #ffb200"
          round
          >提交
        </el-button>
      </el-row>
    </el-card>
    <el-dialog
      style="min-width: 1080px"
      title="查看上架信息"
      :visible.sync="dialogVisible"
      width="65%"
    >
      <el-row>
        <el-col :span="4">
          <span>货品编号</span>
          <p>{{ currentList[0]?.goodsCode }}</p>
        </el-col>
        <el-col :span="4"
          ><span>货品名称</span>
          <p>{{ currentList[0]?.goodsName }}</p></el-col
        >
        <el-col :span="4"
          ><span>货品类型</span>
          <p>{{ currentList[0]?.goodsTypeName }}</p></el-col
        >
        <el-col :span="4"
          ><span>货品数量</span>
          <p>{{ currentList[0]?.realNum }}</p></el-col
        >
        <el-col :span="4"
          ><span>货主名称</span>
          <p>{{ currentList[0]?.ownerName }}</p></el-col
        >
      </el-row>
      <el-table
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#f9f6ee',
        }"
        :cell-style="{
          'text-align': 'center',
          padding: '6px',
          'font-size': '13px',
        }"
        :data="currentList"
        border
        style="width: 100%"
      >
        <el-table-column label="实上库位">
          <template v-slot="scope">
            <!--            :options="options"-->
            <!--            @change="handleChange"-->
            <el-cascader disabled v-model="scope.row.ownerId"></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="groundingNum" label="实上数量">
          <template v-slot="scope">
            <el-input-number
              disabled
              v-model="scope.row.groundingNum"
              controls-position="right"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  aggregateInformationQuery,
  pagingQueryInventoryListingSubsidiary,
} from "@/api/list-in";
import { modifyInventoryList } from "@/api/listTask";
import { queryAllWarehouse } from "@/api/list-in";

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
      multipleSelection: [],
      isShowInput: false,
      sumList: [],
      dialogVisible: false,
      currentList: [],
      options: {}, // 实上库位
    };
  },
  created() {
    this.pagingQueryInventoryListingSubsidiary();
    this.aggregateInformationQuery();
  },
  computed: {
    progressOf() {
      return Math.floor(
        (this.sumList.goodsGroundingTotal / this.sumList.goodsRealTotal) * 100
      );
    },
  },
  methods: {
    async checkInformationOn(row) {
      this.dialogVisible = true;
      this.currentList = [{ ...row }];
      const { data } = await queryAllWarehouse(row.ownerId);
      console.log(data);
      this.options;
    },
    async aggregateInformationQuery() {
      const { data } = await aggregateInformationQuery(this.$route.params.id);
      this.sumList = data.data;
    },
    // 修改实盘数量
    async modifyFirmQuantity(row) {
      try {
        await modifyInventoryList({
          id: row.id,
          realNum: row.realNum,
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
