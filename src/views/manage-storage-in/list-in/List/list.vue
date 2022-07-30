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
            <el-form-item label="入库单号" prop="code">
              <el-input
                placeholder="请输入"
                v-model="listFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运单编号" prop="billCode">
              <el-input
                placeholder="请输入"
                v-model="listFormLabel.billCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="ownerName">
              <el-input
                placeholder="请输入"
                v-model="listFormLabel.ownerName"
              ></el-input>
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
        <el-button
          @click="
            $router.push({
              path: '/manage-storage-in/list-in/list/details/null',
            })
          "
          type="success"
          round
          >新增入库单
        </el-button>
        <el-button
          @click="generateReceivingTask"
          style="background-color: #f8f5f5"
          round
          >生成收货任务
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
          label="入库单号"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="billCode"
          label="运单编号"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="planArrivalTime"
          label="计划到达时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="ownerCode"
          label="货主编号"
          width="160"
        ></el-table-column>
        <el-table-column
          sortable
          prop="ownerName"
          label="货主名称"
          width="160"
        ></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="160">
        </el-table-column>
        <el-table-column prop="license" label="车牌号" width="160">
        </el-table-column>
        <el-table-column prop="deliveryName" label="送货人名称" width="160">
        </el-table-column>
        <el-table-column prop="deliveryPhone" label="送货人电话" width="160">
        </el-table-column>
        <el-table-column prop="status" label="入库单状态" width="160">
          <template v-slot="scope">
            {{
              scope.row.status === 1
                ? "新建"
                : scope.row.status === 2
                ? "收货中"
                : scope.row.status === 3
                ? "已取消"
                : scope.row.status === 4
                ? "收货完成"
                : scope.row.status === 5
                ? "上架中"
                : "上架完成"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="planNum" label="预计到货数" width="160">
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="160">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template v-slot="scope">
            <el-button
              type="text"
              @click="
                $router.push(
                  `/manage-storage-in/list-in/list/list-detail/${scope.row.id}`
                )
              "
              size="small"
            >
              查看详情
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
    <!--  生成表单任务弹出框  -->
    <el-dialog title="盘点任务生成" :visible.sync="dialogVisible" width="30%">
      <div class="spanSubTitle">
        {{ countingTaskList.length }}个盘点任务生成失败！
      </div>
      <div class="divFailureMsg">盘点任务生成失败原因如下</div>
      <div class="divItemList">
        {{ errList }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAllOwnersManagement } from "@/api/list";
import { queryAllWarehouse } from "@/api/area";
import { queryAllArea } from "@/api/location";
import { pagingQueryListIn, generateReceivingTask } from "@/api/list-in";

export default {
  name: "List",
  data() {
    return {
      listFormLabel: {
        code: "",
        billCode: "",
        ownerName: "",
        current: 1,
        size: 10,
      },
      total: 0,
      tableData: [],
      cascaderList: [], // 盘点库区列表
      shipperList: [], // 货主列表
      multipleSelection: [],
      dialogVisible: false,
      countingTaskList: [],
      errList: "",
    };
  },
  created() {
    this.pagingQueryListIn();
    this.queryAllOwnersManagement();
    this.queryAllWarehouse();
  },
  methods: {
    click(row) {
      console.log(row);
    },
    // 生成盘点任务
    async generateReceivingTask() {
      if (!this.multipleSelection.length) {
        this.$message.error("请选择入库单");
      } else {
        const res = await generateReceivingTask(this.multipleSelection);
        this.countingTaskList = res.data.data.errors;
        this.errList = this.countingTaskList.join("、");
        this.dialogVisible = true;
        await this.pagingQueryListIn();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
      console.log(val);
    },
    async queryAllWarehouse() {
      const res = await queryAllWarehouse();
      this.list = res.data.data;
      this.list.forEach((item) => {
        this.cascaderList.push({
          value: item.id,
          label: item.name,
          children: [],
        });
      });
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
    // 查询全部货主管理
    async queryAllOwnersManagement() {
      const res = await queryAllOwnersManagement();
      console.log("全部货主管理", res);
      res.data.data.forEach((item) => {
        this.shipperList.push({
          id: item.id,
          name: item.name,
        });
      });
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
      this.pagingQueryListIn();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
      this.pagingQueryListIn();
    },
    handleCurrentChange(newPage) {
      this.listFormLabel.current = newPage;
      this.pagingQueryListIn();
    },
    handleSizeChange(newSize) {
      this.listFormLabel.size = newSize;
      this.pagingQueryListIn();
    },
    // 分页查询仓库
    async pagingQueryListIn() {
      const { data } = await pagingQueryListIn(this.listFormLabel);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
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
