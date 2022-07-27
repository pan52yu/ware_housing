<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="goodsFormLabel"
        ref="warehouseFormRef"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="货品编号" prop="code">
              <el-input
                placeholder="请输入"
                v-model="goodsFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货品名称" prop="name">
              <el-input
                placeholder="请输入"
                v-model="goodsFormLabel.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="owner">
              <el-input
                placeholder="请输入"
                v-model="goodsFormLabel.owner"
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
              path: '/manage-base-info/goods/details/null',
            })
          "
          type="success"
          round
          >新增货品
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
        <el-table-column prop="goodsTypeName" label="货品类型名称" width="150">
        </el-table-column>
        <el-table-column prop="code" label="货品编号" width="150">
        </el-table-column>
        <el-table-column prop="barCode" label="货品条码" width="150">
        </el-table-column>
        <el-table-column prop="name" label="货品名称" width="150">
        </el-table-column>
        <el-table-column prop="ownerName" label="货主名称" width="150">
        </el-table-column>
        <el-table-column prop="inspectionType" label="质检方式" width="150">
          <template v-slot="scope">
            {{
              scope.row.inspectionType === "BCL"
                ? "不处理"
                : scope.row.inspectionType === "QJ"
                ? "全检"
                : "抽检"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="temperatureType" label="温度要求" width="150">
          <template v-slot="scope">
            {{
              scope.row.temperatureType === "CW"
                ? "常温"
                : scope.row.temperatureType === "LC"
                ? "冷藏"
                : "恒温"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="bearingType" label="承重要求" width="120">
          <template v-slot="scope">
            {{
              scope.row.bearingType === "ZX"
                ? "重型"
                : scope.row.bearingType === "QX"
                ? "轻型"
                : "中型"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="指定库区" width="120">
        </el-table-column>
        <el-table-column prop="volume" label="体积m³" width="120">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单价（元）"
          width="120"
        ></el-table-column>
        <el-table-column prop="unit" label="单位" width="120">
        </el-table-column>
        <el-table-column prop="guaranteeDay" label="保质天数（天）" width="120">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template v-slot="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >编辑
            </el-button>
            <el-button
              @click="deleteWarehouse(scope.row)"
              type="text"
              size="small"
              >删除
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
          :current-page="goodsFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="goodsFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { pagingQueryGoods } from "@/api/goods";

export default {
  name: "goods",
  data() {
    return {
      goodsFormLabel: {
        code: "",
        name: "",
        owner: "",
        current: 1,
        size: 5,
      },
      currentStatus: 0,
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.pagingQueryGoods();
  },
  methods: {
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
      this.pagingQueryGoods();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.goodsFormLabel.current = newPage;
      this.pagingQueryGoods();
    },
    handleSizeChange(newSize) {
      this.goodsFormLabel.size = newSize;
      this.pagingQueryGoods();
    },
    // 分页查询仓库
    async pagingQueryGoods() {
      const { data } = await pagingQueryGoods(this.goodsFormLabel);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleClick(row) {
      console.log(row);
      this.$router.push(`/manage-base-info/goods/details/${row.id}`);
    },
    // 表格隔行颜色
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
    width: 80%;

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
