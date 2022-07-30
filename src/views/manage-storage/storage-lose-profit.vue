<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="StorageLoseProfitFormLabel"
        ref="warehouseFormRef"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="损益单号" prop="code">
              <el-input
                clearable
                placeholder="请输入"
                v-model="StorageLoseProfitFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="损益单状态" prop="status">
              <el-select
                clearable
                style="width: 100%"
                v-model="StorageLoseProfitFormLabel.status"
                placeholder="请选择"
                value=""
              >
                <el-option label="新建" value="1"></el-option>
                <el-option label="已调整" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="ownerName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="StorageLoseProfitFormLabel.ownerName"
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
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="货品名称" prop="goodsName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="StorageLoseProfitFormLabel.goodsName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-row>
        <span style="width: 30px; display: inline-block; height: 100%"></span>
        <span class="divTableTitle">
          <span class="spanLabel">合计</span>
          <span class="spanValue">{{ sum.total }}个</span>
          <span class="spanValue">{{ sum.money }}元</span>
        </span>
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
        <el-table-column prop="code" label="损益单号" width="150">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="150">
        </el-table-column>
        <el-table-column prop="areaName" label="库区名称" width="150">
        </el-table-column>
        <el-table-column prop="locationName" label="库位名称" width="150">
        </el-table-column>
        <el-table-column sortable prop="ownerName" label="货主名称" width="150">
        </el-table-column>
        <el-table-column sortable prop="goodsName" label="货品名称" width="120">
        </el-table-column>
        <el-table-column prop="idNum" label="损益数量" width="120">
        </el-table-column>
        <el-table-column sortable prop="idMoney" label="损益金额" width="120">
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="120">
        </el-table-column>
        <el-table-column
          sortable
          prop="createTime"
          label="创建时间"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="idSource" label="损益来源" width="120">
          <template v-slot="scope">
            {{
              scope.row.idSource === "PD"
                ? "盘点"
                : scope.row.idSource === "SJ"
                ? "上架"
                : "拣货"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="taskCode" label="任务编号" width="120">
        </el-table-column>
        <el-table-column prop="status" label="损益单状态" width="120">
          <template v-slot="scope">
            {{ scope.row.status === 1 ? "新建" : "已调整" }}
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="处理人" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template v-slot="scope">
            <el-button
              @click="showAdjustInventory(scope.row)"
              v-show="scope.row.status === 1"
              type="text"
              size="small"
              >调整库存
            </el-button>
            <el-button
              @click="cancelAdjustment(scope.row.id)"
              v-show="scope.row.status === 1"
              type="text"
              size="small"
              >取消调整
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   没数据时显示的   -->
      <div class="emptyTip" v-else>
        <span class="imgIcon"></span>
        <p>暂无仓库</p>
      </div>
      <!--   分页   -->
      <el-row type="flex" justify="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="StorageLoseProfitFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="StorageLoseProfitFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
      <!--   调整库存   -->
      <el-dialog title="调整库存" :visible.sync="invaVisible" width="30%">
        <p>确认调整库存吗？</p>
        <p>库存将从94调整成93</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="invaVisible = false" round>取 消</el-button>
          <el-button type="primary" @click="adjustInventory" round
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  adjustStock,
  cancelAdjustment,
  pagingQueryLossesTheSingleDetail,
} from "@/api/listTask";
import { andTotalAmountTotalSummary } from "@/api/StorageLoseProfit";

export default {
  name: "warehouse",
  data() {
    return {
      StorageLoseProfitFormLabel: {
        code: "",
        ownerName: "",
        goodsName: "",
        current: 1,
        size: 10,
      },
      currentId: 0,
      total: 0,
      tableData: [],
      sum: {},
      invaVisible: false,
    };
  },
  created() {
    this.pagingQueryLossesTheSingleDetail();
  },
  methods: {
    // 弹出调整库存
    showAdjustInventory(row) {
      console.log(row);
      this.currentId = row.id;
      this.invaVisible = true;
    },
    // 调整库存
    async adjustInventory() {
      try {
        this.invaVisible = false;
        await adjustStock(this.currentId);
        this.$message.success("调整库存成功");
      } catch (e) {
        this.$message.error("调整库存失败");
      }
      await this.pagingQueryLossesTheSingleDetail();
    },
    // 取消调整
    async cancelAdjustment(id) {
      try {
        const flags = await this.$confirm(
          "此操作将取消调整库存, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch(() => this.$message.warning("已取消操作"));
        if (flags === "confirm") {
          await cancelAdjustment(id);
          this.$message.success("取消调整库存成功");
        }
      } catch (e) {
        this.$message.error("取消调整库存失败");
      }
    },
    // 搜索
    submitSearch() {
      this.pagingQueryLossesTheSingleDetail();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.StorageLoseProfitFormLabel.current = newPage;
      this.pagingQueryLossesTheSingleDetail();
    },
    handleSizeChange(newSize) {
      this.StorageLoseProfitFormLabel.size = newSize;
      this.pagingQueryLossesTheSingleDetail();
    },
    // 分页查询仓库
    async pagingQueryLossesTheSingleDetail() {
      const { data } = await pagingQueryLossesTheSingleDetail(
        this.StorageLoseProfitFormLabel
      );
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
      const res = await andTotalAmountTotalSummary();
      this.sum = res.data.data;
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
.divTableTitle {
  background: #fff9eb;
  border: 1px solid #ffb200;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  padding-left: 9px;

  .spanLabel {
    color: #332929;
    margin-right: 9px;
  }

  .spanValue {
    padding-right: 18px;
    color: #ffb200;
  }
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
</style>
