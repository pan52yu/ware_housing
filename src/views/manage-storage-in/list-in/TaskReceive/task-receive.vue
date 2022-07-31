<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="listFormLabel"
        ref="warehouseFormRef"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="任务编号" prop="code">
              <el-input
                placeholder="请输入"
                v-model="listFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="code">
              <el-input
                placeholder="请输入"
                v-model="listFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货状态" prop="status">
              <el-select
                v-model="listFormLabel.status"
                placeholder="请选择"
                value=""
              >
                <el-option label="待分配" value="1"></el-option>
                <el-option label="收货中" value="2"></el-option>
                <el-option label="收货完成" value="3"></el-option>
                <el-option label="已取消" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="submit" :span="6">
            <el-form-item>
              <el-button type="warning" @click.native="submitSearch" round
                >搜索
              </el-button>
              <el-button type="info" @click="resetFields" plain round
                >重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-row>
        <span style="width: 30px; display: inline-block; height: 100%"></span>
        <el-button type="success" @click="generateProfitsLossesTheSingle" round
          >收货完成
        </el-button>
      </el-row>
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
        :row-class-name="tableRowClassName"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="code"
          label="收货任务编号"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="receiptCode"
          label="入库单号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="createName"
          label="创建人"
          width="180"
        ></el-table-column>
        <el-table-column
          sortable
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="ownerName"
          label="货主名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="160">
        </el-table-column>
        <el-table-column prop="areaName" label="库区名称" width="160">
        </el-table-column>
        <el-table-column prop="planNum" label="预计到货数" width="160">
        </el-table-column>
        <el-table-column
          :filters="[
            { text: '待分配', value: 1 },
            { text: '收货中', value: 2 },
            { text: '收货完成', value: 3 },
            { text: '已取消', value: 4 },
          ]"
          :filter-method="filterStatus"
          prop="status"
          label="收货状态"
          width="160"
        >
          <template v-slot="scope">
            {{
              scope.row.status === 1
                ? "待分配"
                : scope.row.status === 2
                ? "收货中"
                : scope.row.status === 3
                ? "收货完成"
                : "已取消"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="receiverName" label="收货人" width="160">
        </el-table-column>
        <el-table-column prop="realNum" label="实收总数" width="160">
        </el-table-column>
        <el-table-column prop="differenceNum" label="收货差异" width="160">
        </el-table-column>
        <el-table-column
          sortable
          prop="completionTime"
          label="收货完成时间"
          width="160"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template v-slot="scope">
            <el-button
              @click="showDistribution(scope.row)"
              v-show="scope.row.status === 1"
              type="text"
              size="small"
            >
              分配
            </el-button>
            <el-button
              @click="
                $router.push(
                  `/manage-storage-in/list-in/task-receive/sure/${scope.row.masterId}`
                )
              "
              v-show="scope.row.status === 2"
              type="text"
              size="small"
            >
              收货录入
            </el-button>
            <el-button
              @click="showInventoryToComplete(scope.row)"
              v-show="scope.row.status === 2"
              type="text"
              size="small"
            >
              收货完成
            </el-button>

            <el-button
              v-show="scope.row.status !== 1 && scope.row.status !== 2"
              @click="
                $router.push(
                  `/manage-storage-in/list-in/task-receive/sure/${scope.row.masterId}`
                )
              "
              type="text"
              size="small"
            >
              查看详情
            </el-button>
            <el-button
              v-show="scope.row.status === 4"
              @click="lookTheProfitsLossesSubsidiary(scope.row)"
              type="text"
              size="small"
            >
              查看损益明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   没数据时显示的   -->
      <div class="emptyTip" v-else>
        <span class="imgIcon"></span>
        <p>暂无盘点单</p>
      </div>
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
    </el-card>
    <!--  生成损益单弹出框  profitLossSheet-->
    <el-dialog
      title="生成收货任务"
      :visible.sync="profitLossSheetDialogVisible"
      width="30%"
    >
      <div class="spanSubTitle">
        {{ profitLossSheetList.length }}个收货任务生成失败！
      </div>
      <div class="divFailureMsg">收货任务生成失败原因如下</div>
      <div class="divItemList">
        {{ profitLossSheetErrList }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="profitLossSheetDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--  生成复盘弹出框  analyse-->
    <el-dialog title="复盘" :visible.sync="analyseDialogVisible" width="30%">
      <div class="spanSubTitle">
        {{ analyseSheetList.length }}个复盘生成失败！
      </div>
      <div class="divFailureMsg">复盘生成失败原因如下</div>
      <div class="divItemList">
        {{ analyseSheetErrList }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="analyseDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--  人员分配对话框  peopleAssignmentDialog -->
    <el-dialog
      title="人员分配"
      :visible.sync="peopleAssignmentDialog"
      width="30%"
    >
      <div style="text-align: center">
        <span>负责人</span>
        <el-select
          style="width: 50%; margin-left: 5px"
          v-model="value"
          clearable
          placeholder="请选择"
          value=""
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="peopleAssignmentDialog = false">取 消</el-button>
        <el-button type="primary" @click="receivingAssignment">确 定</el-button>
      </span>
    </el-dialog>
    <!--  盘点完成对话框  -->
    <el-dialog
      title="提示"
      :visible.sync="inventoryToCompleteDialog"
      width="30%"
    >
      <p>确认盘点完成吗？</p>
      <p>完成后不能修改盘点结果</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inventoryToCompleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="inventoryToComplete">确 定</el-button>
      </span>
    </el-dialog>
    <!--  查看损益详情对话框  -->
    <el-dialog
      title="损益详情"
      :visible.sync="detailsOnProfitLossDialog"
      width="50%"
    >
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
        :data="profitLossDetailsList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="code" label="损益单号" width="120">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="120">
        </el-table-column>
        <el-table-column prop="areaName" label="库区名称" width="120">
        </el-table-column>
        <el-table-column prop="locationName" label="库位名称" width="120">
        </el-table-column>
        <el-table-column prop="ownerName" label="货主名称" width="120">
        </el-table-column>
        <el-table-column prop="goodsName" label="货品名称" width="120">
        </el-table-column>
        <el-table-column prop="idNum" label="损益数量" width="120">
        </el-table-column>
        <el-table-column prop="idMoney" label="损益金额" width="120">
        </el-table-column>
        <el-table-column prop="updateTime" label="处理时间" width="120">
        </el-table-column>
        <el-table-column prop="status" label="损益单状态" width="120">
          <template v-slot="scope">
            {{ scope.row.status === 1 ? "新建" : "已调整" }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsOnProfitLossDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAllArea } from "@/api/location";
import { pagingQueryLossesTheSingleDetail } from "@/api/listTask";
import {
  pagingQueryInventoryListDetails,
  receivingAssignment,
  goodsFinish,
} from "@/api/list-out";

export default {
  name: "ListTask",
  data() {
    return {
      listFormLabel: {
        current: 1,
        size: 10,
      },
      total: 0,
      tableData: [],
      cascaderList: [], // 盘点库区列表
      shipperList: [], // 货主列表
      multipleSelection: [],
      // 损益单
      profitLossSheetDialogVisible: false,
      profitLossSheetList: [],
      profitLossSheetErrList: "",
      // 复盘
      analyseSheetList: [],
      analyseSheetErrList: "",
      analyseDialogVisible: false,
      // 人员分配对话框
      peopleAssignmentDialog: false,
      value: "",
      queryDistribution: {
        id: "",
        personName: "",
      },
      options: [
        {
          value: "张文礼",
          label: "张文礼",
        },
        {
          value: "王千一",
          label: "王千一",
        },
        {
          value: "徐文",
          label: "徐文",
        },
        {
          value: "赵文谦",
          label: "赵文谦",
        },
      ],
      // 分配ID 当前ID
      currentId: "",
      // 完成盘点对话框
      inventoryToCompleteDialog: false,
      currentIdToComplete: "",
      detailsOnProfitLossDialog: false, //查看损益详情对话框
      profitLossDetailsList: [], // 损益详情列表
    };
  },
  created() {
    this.pagingQueryInventoryListDetails();
  },
  methods: {
    async lookTheProfitsLossesSubsidiary(args) {
      try {
        console.log(args.code);
        this.detailsOnProfitLossDialog = true;
        const res = await pagingQueryLossesTheSingleDetail({
          current: 1,
          size: 10,
          tackCode: args.code,
        });
        console.log(res.data.data.records);
        this.profitLossDetailsList = res.data.data.records;
      } catch (e) {
        console.log(e);
      }
    },
    // 生成损益单弹出框
    async generateProfitsLossesTheSingle() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请选择盘点任务");
      } else {
        const res = await goodsFinish(this.multipleSelection);
        this.profitLossSheetList = res.data.data.errors;
        this.profitLossSheetErrList = this.profitLossSheetList.join("、");
        this.profitLossSheetDialogVisible = true;
      }
    },
    // 显示收货完成对话框
    showInventoryToComplete(row) {
      this.currentIdtoComplete = row.id;
      this.inventoryToCompleteDialog = true;
    },
    // 收货完成
    async inventoryToComplete() {
      try {
        await goodsFinish([this.currentIdtoComplete]);
        this.$message.success("收货成功");
      } catch (e) {
        this.$message.error("收货失败");
      }
      this.inventoryToCompleteDialog = false;
    },
    // 分配
    async showDistribution(row) {
      this.peopleAssignmentDialog = true;
      this.currentId = row.id;
    },
    async receivingAssignment() {
      try {
        await receivingAssignment({
          id: this.currentId,
          personName: this.value,
        });
        this.$message.success("分配成功");
      } catch (e) {
        this.$message.error("分配失败");
      }
      await this.pagingQueryInventoryListDetails();
      this.peopleAssignmentDialog = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
      console.log(val);
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterReason(value, row) {
      return row.reason === value;
    },
    filterCheckNum(value, row) {
      return row.reason === value;
    },
    // 根据库位查询库区
    async queryAllArea(id) {
      const result = await queryAllArea({
        warehouseId: id,
        status: 1,
      });
      this.cascaderList.forEach((item, index) => {
        if (item.value === id) {
          result.data.data.forEach((i) => {
            this.cascaderList[index].children.push({
              value: i.id,
              label: i.name,
            });
          });
        }
      });
    },
    handleChange2(...args) {
      // 根据库位查询库区
      this.queryAllArea(args[0][0]);
    },
    // 删除
    deleteWarehouse() {
      this.$notify.info({
        title: "提示",
        duration: 3000,
        message: "演示系统，不支持此操作",
      });
    },
    // 搜索
    submitSearch() {
      if (this.listFormLabel.areaId) {
        this.listFormLabel.areaId = this.listFormLabel.areaId[1];
      }
      this.pagingQueryInventoryListDetails();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
      this.pagingQueryInventoryListDetails();
    },
    handleCurrentChange(newPage) {
      this.listFormLabel.current = newPage;
      this.pagingQueryInventoryListDetails();
    },
    handleSizeChange(newSize) {
      this.listFormLabel.size = newSize;
      this.pagingQueryInventoryListDetails();
    },
    // 分页查询仓库
    async pagingQueryInventoryListDetails() {
      try {
        const { data } = await pagingQueryInventoryListDetails(
          this.listFormLabel
        );
        console.log(2141214121);
        this.tableData = data.data.records;
        this.total = data.data.total - 0;
      } catch (e) {
        console.log(e);
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "";
      } else {
        return "statistics-warning-row2";
      }
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
