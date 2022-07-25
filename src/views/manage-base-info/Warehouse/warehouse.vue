<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="warehouseFormLabel"
        ref="warehouseFormRef"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="仓库编号" prop="like_code">
              <el-input
                placeholder="请输入"
                v-model="warehouseFormLabel.like_code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库名称" prop="like_name">
              <el-input
                placeholder="请输入"
                v-model="warehouseFormLabel.like_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库状态" prop="status">
              <el-select
                v-model="warehouseFormLabel.status"
                placeholder="请选择"
                value=""
              >
                <el-option label="全部" value=" "></el-option>
                <el-option label="停用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
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
        <el-button
          @click="$router.push('/manage-base-info/warehouse/details/null')"
          type="success"
          round
          >新增仓库
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
        <el-table-column prop="code" label="仓库编码" width="150">
        </el-table-column>
        <el-table-column prop="name" label="仓库名称" width="150">
        </el-table-column>
        <el-table-column prop="type" label="仓库类型" width="150">
          <template v-slot="scope">
            {{
              scope.row.type === "ZZ"
                ? "中转仓"
                : scope.row.type === "JG"
                ? "加工仓"
                : scope.row.type === "CB"
                ? "储备仓"
                : "冷藏仓"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="省/市/区" width="250">
        </el-table-column>
        <el-table-column prop="address" label="详细地址" width="180">
        </el-table-column>
        <el-table-column prop="status" label="仓库状态" width="120">
          <template v-slot="scope">
            {{ scope.row.status === 0 ? "停用" : "启用" }}
          </template>
        </el-table-column>
        <el-table-column prop="surface" label="仓库面积m²" width="120">
        </el-table-column>
        <el-table-column prop="includedNum" label="库区数量" width="120">
        </el-table-column>
        <el-table-column
          prop="personName"
          label="负责人"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          width="120"
        ></el-table-column>
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
            <el-button type="text" @click="isStatus(scope.row)" size="small">
              {{ scope.row.status === 0 ? "启用" : "停用" }}
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
          :current-page="warehouseFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="warehouseFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { modifyWarehouse, pagingQueryWarehouse } from "@/api/warehouse";

export default {
  name: "warehouse",
  data() {
    return {
      warehouseFormLabel: {
        like_code: "",
        like_name: "",
        status: "",
        descs: "createTime",
        current: 1,
        size: 5,
      },
      currentStatus: 0,
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.pagingQueryWarehouse();
  },
  methods: {
    // 修改状态
    async isStatus(row) {
      let status = null;
      status = row.status === 0 ? "启用" : "停用";
      try {
        const result = await this.$confirm(
          `确定要${status}：${row.name}吗？`,
          `确认${status}`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        ).catch((error) => error);
        console.log(result);
        if (result !== "confirm") {
          return this.$message.info("已取消修改状态");
        }
        row.status = row.status === 0 ? 1 : 0;
        const res = await modifyWarehouse({ ...row });
        console.log(res);
        await this.pagingQueryWarehouse();
        this.$message.success("状态改变成功");
      } catch (e) {
        console.log(e);
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
      this.pagingQueryWarehouse();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.warehouseFormLabel.current = newPage;
      this.pagingQueryWarehouse();
    },
    handleSizeChange(newSize) {
      this.warehouseFormLabel.size = newSize;
      this.pagingQueryWarehouse();
    },
    // 分页查询仓库
    async pagingQueryWarehouse() {
      const { data } = await pagingQueryWarehouse(this.warehouseFormLabel);
      console.log(data);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleClick(row) {
      console.log(row);
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
