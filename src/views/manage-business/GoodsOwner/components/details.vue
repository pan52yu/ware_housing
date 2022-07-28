<template>
  <div>
    <el-card>
      <el-steps :active="active" finish-status="finish">
        <el-step title="基础信息"></el-step>
        <el-step title="分配库位"></el-step>
      </el-steps>
      <!--   第一步：新增或者编辑货主   -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
        v-if="active === 0"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="货主编号" prop="code">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主名称" prop="name">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人" prop="personName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.personName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人电话" prop="phone">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第二行    -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="联系人邮箱">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.email"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="省/市/区" prop="location">
              <el-cascader
                style="width: 100%"
                size="large"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                v-model="ruleForm.location"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.address"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第三行    -->
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input
                clearable
                type="textarea"
                placeholder="请输入"
                v-model="ruleForm.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="buttonBox">
            <el-button @click="$router.back()" round>返回</el-button>
            <el-button @click.native="next" type="warning" round
              >下一步
            </el-button>
          </div>
        </el-row>
      </el-form>
      <!--   第二步 ：分配库位  -->
      <div class="distributionTheReservoir" v-else>
        <el-row>
          <el-button type="success" @click="dialogVisible = true" round
            >分配库位
          </el-button>
          <el-button round @click="unassignAll">取消分配</el-button>
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
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库名称"
          ></el-table-column>
          <el-table-column prop="areaName" label="库区名称"></el-table-column>
          <el-table-column
            prop="locationCode"
            label="库位编号"
          ></el-table-column>
          <el-table-column
            prop="locationName"
            label="库位名称"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="cancellationDistribution(scope.row)"
                size="small"
              >
                取消分配
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
            :current-page="queryList.current"
            :page-sizes="[5, 10, 30, 40]"
            :page-size="queryList.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-row>
        <el-row>
          <div class="buttonBox" style="text-align: center">
            <el-button @click="active--" round>上一步</el-button>
            <el-button @click.native="next" type="warning" round
              >提交
            </el-button>
          </div>
        </el-row>
      </div>
    </el-card>
    <!--  分配库区对话框  -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-cascader
        clearable
        v-model="value"
        :options="treeList"
        :props="{ multiple: true }"
        @change="handleChange2"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionTheReservoir"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--  取消分配对话框  -->
    <el-dialog
      title="取消分配确认"
      :visible.sync="cancelAssignmentDialogBox"
      width="30%"
    >
      <span>确认取消货主的库位：{{ currentList.locationName }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAssignmentDialogBox = false">取 消</el-button>
        <el-button type="primary" @click="unassign">确 定</el-button>
      </span>
    </el-dialog>
    <!--  取消所有分配对话框  -->
    <el-dialog
      title="取消分配确认"
      :visible.sync="cancelAssignmentDialogBoxAll"
      width="30%"
    >
      <span>确认要取消分配吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAssignmentDialogBoxAll = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="delAll">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HZForNextEncode } from "@/api/codeFactory";
import {
  queryGoodsOwner,
  modifyGoodsOwner,
  addGoodsOwner,
  queryOwnerAssociativeTableLocation,
  queryTheTreeLocation,
  deleteOwnerAssociativeTableLocation,
  shipperBatchAssociatedLocation,
} from "@/api/goods-owner";
// 引入省市区
import { regionDataPlus, CodeToText } from "element-china-area-data";
import { queryAllWarehouse } from "@/api/area";

export default {
  name: "Details",
  data() {
    return {
      active: 0,
      options: regionDataPlus, // 省市区
      ruleForm: {
        code: "", // 仓库编码
        name: "", // 仓库名称
        phone: "", // 联系电话
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入货主编号",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入仓库名称",
          },
        ],
        personName: [
          {
            required: true,
            message: "请输入联系人",
          },
        ],
        location: [
          {
            required: true,
            message: "请选择省市区",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系人电话",
          },
        ],
      },
      value: [],
      tableData: [],
      // 查询库位
      queryList: {
        current: 1,
        size: 10,
        ownerId: this.$route.params.id,
      },
      total: 0,
      dialogVisible: false,
      treeList: [],
      // 选中的库位数组
      multipleSelection: [],
      cancelAssignmentDialogBoxAll: false,
      // 当前的库位
      currentList: [],
      cancelAssignmentDialogBox: false,
    };
  },
  created() {
    this.queryGoodsOwner();
    this.queryList.ownerId = this.$route.params.id;
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 对话框变化
    handleChange2() {
      this.value.forEach((item, index) => {
        this.value[index] = item.join(",");
      });
    },
    // 分配库区
    async distributionTheReservoir() {
      try {
        await shipperBatchAssociatedLocation(this.value, this.$route.params.id);
        this.$message.success("分配成功");
      } catch (e) {
        console.log(e);
      }
      this.dialogVisible = false;
    },
    // 点击每行取消分配
    cancellationDistribution(row) {
      this.currentList = row;
      this.cancelAssignmentDialogBox = true;
    },
    async unassign() {
      this.cancelAssignmentDialogBox = false;
      const res = await deleteOwnerAssociativeTableLocation([
        this.currentList.id,
      ]);
      console.log(res);
    },
    unassignAll() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择要取消的数据");
      } else {
        this.cancelAssignmentDialogBoxAll = true;
      }
    },
    async delAll() {
      let allListId = [];
      this.multipleSelection.forEach((item) => {
        allListId.push(item.id);
      });
      const res = await deleteOwnerAssociativeTableLocation(allListId);
      console.log(res);
      this.cancelAssignmentDialogBoxAll = false;
      await this.queryOwnerAssociativeTableLocation();
    },
    async queryGoodsOwner() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryGoodsOwner(this.$route.params.id);
          this.ruleForm = res.data.data;
          if (
            this.ruleForm.city === "119900" ||
            this.ruleForm.city === "129900"
          ) {
            this.ruleForm.city = (this.ruleForm.city - 9800).toString();
          }
          this.ruleForm.location = [
            this.ruleForm.province,
            this.ruleForm.city,
            this.ruleForm.area,
          ];
        } else {
          // 是新增 查询code
          const res = await HZForNextEncode();
          if (res.status !== 200) {
            return this.$message.error("获取code失败");
          }
          this.ruleForm.code = res.data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async next() {
      // 第一步提交新增或者编辑货主
      if (this.active === 0) {
        this.$set(
          this.ruleForm,
          "location",
          [
            CodeToText[this.ruleForm.province],
            CodeToText[this.ruleForm.city],
            CodeToText[this.ruleForm.area],
          ].join("/")
        );
        try {
          if (this.$route.params.id === "null") {
            await addGoodsOwner(this.ruleForm);
          } else {
            await modifyGoodsOwner(this.ruleForm);
          }
          this.$message.success("恭喜你，提交成功！");
          this.active++;
          await this.queryOwnerAssociativeTableLocation();
          await this.queryAllWarehouse();
        } catch (e) {
          console.log(e);
        }
      } else {
        //   第二步 ：分配库位
      }
    },
    // 查询全部仓库列表
    async queryAllWarehouse() {
      const res = await queryAllWarehouse();
      console.log(res);
      this.treeList = [];
      res.data.data.forEach((item) => {
        this.treeList.push({
          value: item.id,
          label: item.name,
          children: [],
        });
      });
      for (let i = 0; i < res.data.data.length; i++) {
        const { data } = await queryTheTreeLocation(res.data.data[i].id);
        this.treeList[i].children = data.data;
      }
    },
    // 库位列表
    async queryOwnerAssociativeTableLocation() {
      const { data } = await queryOwnerAssociativeTableLocation(this.queryList);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleSizeChange(newPage) {
      this.queryList.size = newPage;
      this.queryOwnerAssociativeTableLocation();
    },
    handleCurrentChange(newSize) {
      this.queryList.current = newSize;
      this.queryOwnerAssociativeTableLocation();
    },
    handleChange(value) {
      //value代表每个地方的区域码
      this.ruleForm.province = value[0];
      this.ruleForm.city = value[1];
      this.ruleForm.area = value[2];
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin: 30px 0;
}

.el-pagination {
  margin-bottom: 30px;
}

.el-steps {
  width: 35%;
  margin: 0 auto;
  margin-top: 56px;
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

    padding-right: 5px;
  }

  .buttonBox {
    padding: 25px 0 0;
    margin: 0 -30px -5px;
    border-top: 1px solid #f5efee;
    text-align: center;

    .el-button {
      width: 170px;
      color: #333333;
    }
  }

  .suffix {
    width: 40px;
    height: 40px;
    background: #e7dfdf;
    border-radius: 0 6px 6px 0;
    padding: 0 10px;
    border: 0;
  }
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
