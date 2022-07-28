<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="goodsTypeFormLabel"
        ref="warehouseFormRef"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="承运商编号">
              <el-input
                placeholder="请输入"
                v-model="goodsTypeFormLabel.like_code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="承运商名称" prop="like_name">
              <el-input
                placeholder="请输入"
                v-model="goodsTypeFormLabel.like_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人" prop="like_personName">
              <el-input
                placeholder="请输入"
                v-model="goodsTypeFormLabel.like_personName"
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
        <el-table-column prop="code" label="承运商编号"></el-table-column>
        <el-table-column prop="name" label="承运商名称"></el-table-column>
        <el-table-column prop="personName" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系人电话"></el-table-column>
        <el-table-column prop="email" label="联系人邮箱"></el-table-column>
        <el-table-column prop="location" label="省/市/区"></el-table-column>
        <el-table-column prop="address" label="详细地址"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
          :current-page="goodsTypeFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="goodsTypeFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { pagingQueryCarrier } from "@/api/taskPicking";

export default {
  name: "task-picking",
  data() {
    return {
      goodsTypeFormLabel: {
        like_code: "",
        like_name: "",
        like_personName: "",
        current: 1,
        size: 5,
      },
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.pagingQueryCarrier();
  },
  methods: {
    // 搜索
    submitSearch() {
      this.pagingQueryCarrier();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.goodsTypeFormLabel.current = newPage;
      this.pagingQueryCarrier();
    },
    handleSizeChange(newSize) {
      this.goodsTypeFormLabel.size = newSize;
      this.pagingQueryCarrier();
    },
    // 分页查询仓库
    async pagingQueryCarrier() {
      const { data } = await pagingQueryCarrier(this.goodsTypeFormLabel);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
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
    padding: 0 0 0 0 !important;
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
