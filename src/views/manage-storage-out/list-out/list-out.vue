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
            <el-form-item label="出库单号" prop="code">
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
              path: '/manage-storage-out/list-out/details/null',
            })
          "
          type="success"
          round
          >新增出库单
        </el-button>
      </el-row>
      <!--   表格区域   -->
      <el-table
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
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="code"
          label="出库单号"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="billCode"
          label="货主运单编号"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="ownerName"
          label="货主名称"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="warehouseName"
          label="出库仓库"
          width="280"
        ></el-table-column>
        <el-table-column prop="areaName" label="出库库区" width="280">
        </el-table-column>
        <el-table-column
          sortable
          prop="license"
          label="计划出库时间"
          width="160"
        >
        </el-table-column>
        <el-table-column sortable prop="goodsNum" label="货品数量" width="160">
        </el-table-column>
        <el-table-column
          :filters="[
            { text: '新建', value: 1 },
            { text: '收货中', value: 2 },
            { text: '已取消', value: 3 },
            { text: '收货完成', value: 4 },
            { text: '上架中', value: 5 },
            { text: '上架完成', value: 6 },
          ]"
          :filter-method="filterStatus"
          prop="status"
          label="出库单状态"
          width="160"
        >
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
        <el-table-column prop="createName" label="创建人" width="160">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template v-slot="scope">
            <el-button
              @click="
                $router.push({
                  path: `/manage-storage-out/list-out/details/${scope.row.id}`,
                })
              "
              type="text"
              size="small"
              v-show="scope.row.status === 1"
              >修改详情
            </el-button>
            <el-button
              @click="generatePickingTask(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.status === 1"
              >生成拣货任务
            </el-button>
            <el-button
              @click="cancel(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.status === 1"
              >取消
            </el-button>
            <el-button
              v-show="scope.row.status !== 1"
              type="text"
              size="small"
              @click="
                $router.push(
                  `/manage-storage-in/list-in/list/list-detail/${scope.row.id}`
                )
              "
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   没数据时显示的   -->
      <div class="emptyTip" v-else>
        <span class="imgIcon"></span>
        <p>暂无出库单</p>
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
    <el-dialog title="生成拣货任务" :visible.sync="dialogVisible" width="30%">
      <div class="spanSubTitle">
        {{ countingTaskList.length }}个拣货任务生成失败！
      </div>
      <div class="divFailureMsg">拣货任务生成失败原因如下</div>
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
import {
  pagingQueryListOut,
  generatePickingTask,
  cancelOutboundOrder,
} from "@/api/list-out";

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
      dialogVisible: false,
      countingTaskList: [],
      errList: "",
    };
  },
  created() {
    this.pagingQueryListOut();
  },
  methods: {
    filterStatus(value, row) {
      return row.status === value;
    },
    async cancel(row) {
      try {
        const flags = await this.$confirm(
          `确认取消出库单号为${row.code}的出库单吗？`,
          "取消确认",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (flags === "confirm") {
          await cancelOutboundOrder(row.id);
          this.$message.success("取消成功");
        }
      } catch (e) {
        this.$message.error("出错啦~");
      }
    },
    // 生成拣货任务
    async generatePickingTask(row) {
      try {
        const res = await generatePickingTask([row.id]);
        this.countingTaskList = res.data.data.errors;
        this.errList = this.countingTaskList.join("、");
        this.dialogVisible = true;
        await this.pagingQueryListOut();
      } catch (e) {
        this.$message.error("出错啦~");
      }
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
      this.pagingQueryListOut();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
      this.pagingQueryListOut();
    },
    handleCurrentChange(newPage) {
      this.listFormLabel.current = newPage;
      this.pagingQueryListOut();
    },
    handleSizeChange(newSize) {
      this.listFormLabel.size = newSize;
      this.pagingQueryListOut();
    },
    // 分页查询仓库
    async pagingQueryListOut() {
      const { data } = await pagingQueryListOut(this.listFormLabel);
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
