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
            <el-form-item label="类型编号" prop="code">
              <el-input
                placeholder="请输入"
                v-model="goodsTypeFormLabel.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型名称" prop="name">
              <el-input
                placeholder="请输入"
                v-model="goodsTypeFormLabel.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="visibility: hidden">占位</el-col>
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
        <el-button type="success" @click="addGoodsType" round
          >新增货品类型
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
        <el-table-column prop="code" label="货品类型编号"></el-table-column>
        <el-table-column prop="name" label="货品类型名称"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
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
          :current-page="goodsTypeFormLabel.current"
          :page-sizes="[5, 10, 30, 40]"
          :page-size="goodsTypeFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog title="添加货品类型" :visible.sync="dialogVisible" width="30%">
      <el-form
        label-position="top"
        :model="addItemType"
        ref="addItemTypeRef"
        :rules="addItemRef"
      >
        <el-form-item label="货品类型编码" prop="code">
          <el-input
            disabled
            placeholder="请输入"
            v-model="addItemType.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="货品类型名称" prop="name">
          <el-input placeholder="请输入" v-model="addItemType.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickOnAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HPForNextEncode } from "@/api/codeFactory";
import {
  addGoodsType,
  pagingQueryGoodsType,
  putGoodsType,
  queryItemTypeManagement,
} from "@/api/goodsType";

export default {
  name: "goodsType",
  data() {
    return {
      goodsTypeFormLabel: {
        code: "",
        name: "",
        descs: "createTime",
        current: 1,
        size: 5,
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      addItemType: {
        code: "",
        name: "",
      },
      addItemRef: {
        code: [{ required: true, message: "请输入货品类型编码" }],
        name: [{ required: true, message: "请输入货品类型名称" }],
      },
      currentId: null,
    };
  },
  created() {
    this.pagingQueryGoodsType();
  },
  methods: {
    async clickOnAdd() {
      try {
        if (this.currentId === null) {
          //  新增
          await addGoodsType(this.addItemType);
          this.$message.success("新增货品类型成功！");
        } else {
          //  修改
          await putGoodsType(this.addItemType);
          this.$message.success("修改货品类型成功！");
        }
      } catch (e) {
        this.$message.error("操作失败！");
      }
      this.dialogVisible = false;
      await this.pagingQueryGoodsType();
    },
    // 点击新增按钮触发
    addGoodsType() {
      this.HPForNextEncode();
      this.currentId = null;
      this.dialogVisible = true;
    },
    // 获取货品code
    async HPForNextEncode() {
      const res = await HPForNextEncode();
      this.addItemType.code = res.data.data;
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
      this.pagingQueryGoodsType();
    },
    // 重置表单
    resetFields() {
      this.$refs.warehouseFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.goodsTypeFormLabel.current = newPage;
      this.pagingQueryGoodsType();
    },
    handleSizeChange(newSize) {
      this.goodsTypeFormLabel.size = newSize;
      this.pagingQueryGoodsType();
    },
    // 分页查询仓库
    async pagingQueryGoodsType() {
      const { data } = await pagingQueryGoodsType(this.goodsTypeFormLabel);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    async handleClick(row) {
      console.log(row);
      this.currentId = row.id;
      const res = await queryItemTypeManagement(row.id);
      this.addItemType = res.data.data;
      this.dialogVisible = true;
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
