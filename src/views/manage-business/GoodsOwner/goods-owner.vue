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
            <el-form-item label="货主编号" prop="like_code">
              <el-input
                placeholder="请输入"
                v-model="warehouseFormLabel.like_code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="like_name">
              <el-input
                placeholder="请输入"
                v-model="warehouseFormLabel.like_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人" prop="like_personName">
              <el-input
                placeholder="请输入"
                v-model="warehouseFormLabel.like_personName"
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
              path: '/manage-business/goods-owner/details/null',
            })
          "
          type="success"
          round
          >新增货主
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
        <el-table-column prop="code" label="货主" width="150">
        </el-table-column>
        <el-table-column prop="name" label="货主名称" width="150">
        </el-table-column>
        <el-table-column
          prop="personName"
          label="联系人"
          width="120"
        ></el-table-column>

        <el-table-column
          prop="phone"
          label="联系电话"
          width="120"
        ></el-table-column>
        <el-table-column prop="email" label="联系邮箱" width="250">
        </el-table-column>
        <el-table-column prop="location" label="省/市/区" width="250">
        </el-table-column>
        <el-table-column prop="address" label="详细地址" width="180">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template v-slot="scope">
            <el-button
              type="text"
              @click="
                $router.push(
                  `/manage-business/goods-owner/detail/${scope.row.id}`
                )
              "
              size="small"
            >
              查看详情
            </el-button>
            <el-button
              @click="
                $router.push(
                  `/manage-business/goods-owner/details/${scope.row.id}`
                )
              "
              type="text"
              size="small"
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
import { pagingQueryGoodsOwner } from "@/api/goods-owner";

export default {
  name: "GoodsOwner",
  data() {
    return {
      warehouseFormLabel: {
        like_code: "",
        like_name: "",
        like_personName: "",
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
    this.pagingQueryGoodsOwner();
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
      this.pagingQueryGoodsOwner();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
      this.pagingQueryGoodsOwner();
    },
    handleCurrentChange(newPage) {
      this.warehouseFormLabel.current = newPage;
      this.pagingQueryGoodsOwner();
    },
    handleSizeChange(newSize) {
      this.warehouseFormLabel.size = newSize;
      this.pagingQueryGoodsOwner();
    },
    // 分页查询仓库
    async pagingQueryGoodsOwner() {
      const { data } = await pagingQueryGoodsOwner(this.warehouseFormLabel);
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
