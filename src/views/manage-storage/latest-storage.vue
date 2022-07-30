<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="latestStorageFormLabel"
        ref="warehouseFormRef"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select
                clearable
                style="width: 100%"
                @change="warehouseChange"
                v-model="latestStorageFormLabel.warehouseId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in allWarehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库区" prop="areaId">
              <el-select
                clearable
                style="width: 100%"
                @change="areaChange"
                v-model="latestStorageFormLabel.areaId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库位" prop="locationId">
              <el-select
                clearable
                style="width: 100%"
                v-model="latestStorageFormLabel.locationId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in locationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
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
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="货主名称" prop="ownerName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="latestStorageFormLabel.ownerName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货品名称" prop="goodsName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="latestStorageFormLabel.goodsName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-card">
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
        <el-table-column prop="warehouseName" label="仓库名称" width="150">
        </el-table-column>
        <el-table-column prop="locationCode" label="库区编号" width="150">
        </el-table-column>
        <el-table-column prop="areaName" label="库区名称" width="150">
        </el-table-column>
        <el-table-column prop="locationName" label="库位名称" width="150">
        </el-table-column>
        <el-table-column prop="ownerCode" label="货主编码" width="150">
        </el-table-column>
        <el-table-column prop="ownerName" label="货主名称" width="120">
        </el-table-column>
        <el-table-column prop="goodsCode" label="货品编码" width="120">
        </el-table-column>
        <el-table-column prop="goodsBarCode" label="货品条码" width="120">
        </el-table-column>
        <el-table-column prop="goodsName" label="货品名称" width="120">
        </el-table-column>
        <el-table-column prop="goodsUnit" label="单位" width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="total"
          label="总库存数"
          width="150"
        >
        </el-table-column>
        <el-table-column fixed="right" prop="free" label="可用库存" width="150">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="frozen"
          label="冻结库存"
          width="150"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template v-slot="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >库存日志
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
          :current-page="latestStorageFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="latestStorageFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!--  库存日志弹出框  -->
    <el-dialog
      style="min-width: 1000px"
      title="库存日志"
      :visible.sync="dialogVisible"
      width="68%"
    >
      <span>日期</span>
      <el-row>
        <el-col :span="18">
          <el-date-picker
            prefix-icon="el-icon-date"
            v-model="value1"
            @change="change"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="warning" @click.native="search" round
            >搜索
          </el-button>
          <el-button type="info" @click="reset" plain round>重置</el-button>
        </el-col>
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
        :data="stockRecordList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="type" label="任务类型" width="130">
        </el-table-column>
        <el-table-column prop="original" label="原始总库存" width="130">
        </el-table-column>
        <el-table-column prop="originalFree" label="原始可用库存" width="130">
        </el-table-column>
        <el-table-column prop="way" label="变动方式" width="130">
        </el-table-column>
        <el-table-column prop="alteration" label="操作库存" width="130">
        </el-table-column>
        <el-table-column prop="result" label="操作后库存" width="130">
        </el-table-column>
        <el-table-column prop="resultFree" label="操作后可用库存" width="130">
        </el-table-column>
        <el-table-column prop="locationName" label="库位名称" width="130">
        </el-table-column>
        <el-table-column prop="updateName" label="更新人员" width="130">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="250">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { pagingQueryDetailedInventory } from "@/api/list";
import { queryAllWarehouse } from "@/api/area";
import { queryAllArea, queryAllLocation } from "@/api/location";
import { pagingQueryStockRecord } from "@/api/stockRecord";

export default {
  name: "latestStorage",
  data() {
    return {
      latestStorageFormLabel: {
        // 查询条件
        ownerName: "",
        goodsName: "",
        descs: "createTime",
        current: 1,
        size: 10,
      },
      total: 0,
      tableData: [], // 渲染表格数据
      allWarehouseList: [], // 仓库列表
      areaList: [], // 库区列表
      locationList: [], // 库位列表
      dialogVisible: false, //库存日志弹出框
      queryStock: {
        descs: "updateTime",
        current: 1,
        size: 10,
        locationId: "",
      },
      stockRecordList: [],
      value1: "",
    };
  },
  created() {
    this.pagingQueryDetailedInventory();
    this.queryAllWarehouse();
  },
  methods: {
    search() {},
    reset() {},
    change(args) {
      this.queryStock.le_createTime = args[0]; // 开始时间
      this.queryStock.ge_createTime = args[1]; //结束时间
    },
    async warehouseChange(id) {
      console.log(id);
      const { data } = await queryAllArea({
        warehouseId: id,
      });
      this.areaList = data.data;
    },
    async areaChange(id) {
      console.log(id);
      const { data } = await queryAllLocation({
        areaId: id,
      });
      this.locationList = data.data;
    },
    // 查询全部仓库列表
    async queryAllWarehouse() {
      const { data } = await queryAllWarehouse();
      this.allWarehouseList = data.data;
    },
    // 搜索
    submitSearch() {
      this.pagingQueryDetailedInventory();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
      this.pagingQueryDetailedInventory();
    },
    handleCurrentChange(newPage) {
      this.latestStorageFormLabel.current = newPage;
      this.pagingQueryDetailedInventory();
    },
    handleSizeChange(newSize) {
      this.latestStorageFormLabel.size = newSize;
      this.pagingQueryDetailedInventory();
    },
    // 分页查询仓库
    async pagingQueryDetailedInventory() {
      const { data } = await pagingQueryDetailedInventory(
        this.latestStorageFormLabel
      );
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    async handleClick(row) {
      this.queryStock.locationId = row.locationId;
      this.dialogVisible = true;
      const { data } = await pagingQueryStockRecord(this.queryStock);
      console.log(data);
      this.stockRecordList = data.data.records.map((item) => {
        return {
          locationName: row.locationName,
          ...item,
        };
      });
    },
    // 隔行自定义颜色
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
