<template>
  <div class="area">
    <el-card>
      <el-form label-position="top" :model="areaFormLabel" ref="areaFormRef">
        <el-row>
          <el-col :span="6">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input
                placeholder="请输入"
                v-model="areaFormLabel.warehouseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库区名称" prop="name">
              <el-input
                placeholder="请输入"
                v-model="areaFormLabel.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库状态" prop="status">
              <el-select
                v-model="areaFormLabel.status"
                placeholder="请选择"
                value=""
              >
                <el-option label="全部" :value="null"></el-option>
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
      <el-row style="padding-left: 30px" type="flex" justify="space-between">
        <el-col :span="6">
          <el-button
            @click="$router.push('/manage-base-info/area/details/null')"
            type="success"
            round
            >新增库区
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button
            @click="exportOrderData"
            style="background-color: #f8f5f5"
            round
            >下载库区模板
          </el-button>
          <el-button
            @click="dialogVisible = true"
            style="background-color: #f8f5f5"
            round
            >导入库区模板
          </el-button>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table
        id="out-table"
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
        <el-table-column prop="warehouseName" label="所属仓库" width="150">
        </el-table-column>
        <el-table-column prop="code" label="仓库编号" width="150">
        </el-table-column>
        <el-table-column prop="name" label="库区名称" width="150">
        </el-table-column>
        <el-table-column prop="temperatureType" label="温度类型" width="250">
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
        <el-table-column prop="bearingType" label="配重类型" width="180">
          <template v-slot="scope">
            {{ scope.row.bearingType === "ZX" ? "重型" : "轻型" }}
          </template>
        </el-table-column>
        <el-table-column prop="useType" label="用途属性" width="120">
          <template v-slot="scope">
            {{
              scope.row.useType === "RKHCQ"
                ? "入库缓存区"
                : scope.row.useType === "CKHCQ"
                ? "出库缓存区"
                : scope.row.useType === "CCQ"
                ? "存储区"
                : scope.row.useType === "FJQ"
                ? "分拣区"
                : "质检区"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="库区状态" width="120">
          <template v-slot="scope">
            {{ scope.row.status === 0 ? "禁用" : "启用" }}
          </template>
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
        <el-table-column prop="includedNum" label="库区数量" width="120">
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
          :current-page="areaFormLabel.current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="areaFormLabel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
      <!--   导入对话框   -->
      <el-dialog title="导入库区" :visible.sync="dialogVisible" width="30%">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :on-change="changUpload"
          :on-success="successUpload"
          :on-error="errorUpload"
          drag
          accept=".xlsx,.xls"
          :auto-upload="false"
          :limit="1"
          :disabled="uploadIsDisabled"
          action="http://127.0.0.1:8888/api/area/importExcel"
        >
          <i style="color: #00be76" class="el-icon-upload"></i>
          <div class="el-upload__text">点击或将表格文件拖拽到这里上传</div>
          <div style="color: #b5abab">仅支持单个表单文件导入</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button
            style="background-color: #f8f5f5"
            round
            @click="cancelUpload"
            >取 消</el-button
          >
          <el-button
            style="background-color: #f8f5f5"
            round
            :disabled="btnIsDisabled"
            @click="submitUpload"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!--  上传成功对话框  -->
      <el-dialog
        class="successDialogVisible"
        title="导入库区"
        :visible.sync="successDialogVisible"
        width="30%"
      >
        <div class="success-dialog">
          <p>
            导入成功<span style="color: #13ce66">{{ uploadList.success }}</span
            >条，失败<span style="color: red">{{ uploadList.fail }}</span
            >条
          </p>
          <div>{{ promptInformation }}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            style="background: #ffb200; color: #332929"
            round
            type="primary"
            @click="successDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { modifyWarehouse } from "@/api/warehouse";
import { pagingQueryArea } from "@/api/area";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "Area",
  data() {
    return {
      dialogVisible: false,
      areaFormLabel: {
        warehouseName: "",
        status: undefined,
        name: "",
        current: 1,
        size: 10,
      },
      currentStatus: 0,
      total: 0,
      tableData: [],
      btnIsDisabled: true,
      uploadIsDisabled: false,
      successDialogVisible: false,
      uploadList: [],
    };
  },
  created() {
    this.pagingQueryArea();
  },
  computed: {
    promptInformation() {
      if (this.uploadList.message) {
        return this.uploadList.message.join(",");
      }
      return null;
    },
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
        await this.pagingQueryArea();
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
      this.pagingQueryArea();
    },
    // 重置表单
    resetFields() {
      this.$refs.areaFormRef.resetFields();
    },
    handleCurrentChange(newPage) {
      this.areaFormLabel.current = newPage;
      this.pagingQueryArea();
    },
    handleSizeChange(newSize) {
      this.areaFormLabel.size = newSize;
      this.pagingQueryArea();
    },
    // 分页查询仓库
    async pagingQueryArea() {
      const { data } = await pagingQueryArea(this.areaFormLabel);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleClick(row) {
      console.log(row);
      this.$router.push(`/manage-base-info/area/details/${row.id}`);
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "";
      } else {
        return "statistics-warning-row2";
      }
    },
    exportOrderData() {
      const xlsxParam = { raw: true };
      const wb = XLSX.utils.table_to_book(
        document.querySelector("#out-table"),
        xlsxParam
      );
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "库区信息.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 取消上传
    cancelUpload() {
      this.dialogVisible = false;
      this.$refs.uploadRef.clearFiles();
    },
    // 确认上传
    async submitUpload() {
      this.dialogVisible = false;
      this.$refs.uploadRef.submit();
    },
    // 上传文件改变时触发
    changUpload(...args) {
      console.log(args);
      if (args.length) {
        this.btnIsDisabled = false;
        this.uploadIsDisabled = true;
      }
    },
    //  成功时执行
    successUpload(...args) {
      console.log(args);
      this.uploadList = args[0].data;
      this.successDialogVisible = true;
    },
    //  上传失败执行
    errorUpload() {
      this.$message.error("导入失败");
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

/deep/ .upload-demo {
  .el-upload {
    width: 100%;
  }

  .el-upload-dragger {
    border: 1px solid #d9d9d9;
    background-color: #f9f9f9;
    width: 100%;
  }
}

/deep/ .successDialogVisible {
  .el-dialog__header {
    box-shadow: 0 0 6px 0 rgba(144, 142, 142, 0.17);
  }

  .el-dialog__footer {
    margin-top: -10px;
  }

  .success-dialog {
    padding: 12px 20px 20px;
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #eaeaea;
    color: #b5abab;
    line-height: 20px;
    max-height: 170px;
    overflow: auto;

    p {
      padding-top: 0;
      color: #332929;
      font-size: 16px;
      padding-bottom: 8px;
      text-align: center;
    }
  }
}
</style>
