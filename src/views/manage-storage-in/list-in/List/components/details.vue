<template>
  <div>
    <el-card>
      <el-steps :active="active" finish-status="success">
        <el-step title="填写基础信息"></el-step>
        <el-step title="填写盘点清单"></el-step>
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
            <el-form-item label="盘点单号" prop="code">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="盘点原因" prop="reason">
              <el-select
                clearable
                v-model="ruleForm.reason"
                placeholder="请选择"
                value=""
              >
                <el-option label="规划" value="GH"></el-option>
                <el-option label="货主" value="HZ"></el-option>
                <el-option label="差异" value="CY"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="盘点维度" prop="dimension">
              <el-select
                clearable
                v-model="ruleForm.dimension"
                placeholder="请选择"
                value=""
              >
                <el-option label="库位" value="KW"></el-option>
                <el-option label="货品" value="HP"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="盘点类型" prop="type">
              <el-select
                clearable
                v-model="ruleForm.type"
                placeholder="请选择"
                value=""
              >
                <el-option label="随机盘点" value="SJPD"></el-option>
                <el-option label="计划盘点" value="JHPD"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第二行    -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item
              label="库区"
              v-show="ruleForm.dimension === 'KW' || !ruleForm.dimension"
            >
              <el-cascader
                clearable
                v-model="ruleForm.areaId"
                :options="treeList"
                @change="handleChange2"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="货主"
              prop="ownerId"
              v-show="ruleForm.dimension === 'HP' || !ruleForm.dimension"
            >
              <el-select
                clearable
                v-model="ruleForm.ownerId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in ownerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划时间" prop="address">
              <el-date-picker
                v-model="ruleForm.planCheckTime"
                prefix-icon="el-icon-date"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="选择日期时间"
              >
              </el-date-picker>
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
        <el-card style="margin: 30px 0 15px 0">
          <el-row>
            <el-button type="success" @click="addInventoryList" round
              >添加盘点清单
            </el-button>
            <el-button round @click="cancellationDistribution"
              >删除盘点清单
            </el-button>
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
              <template>
                <el-button
                  type="text"
                  @click="cancellationDistribution"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--   没数据时显示的   -->
          <div class="emptyTip" v-else>
            <span class="imgIcon"></span>
            <p>暂无盘点清单</p>
          </div>
          <!--   分页   -->
          <el-row type="flex" justify="center" v-if="tableData.length">
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
        </el-card>
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
    <!--  添加盘点清单对话框  -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-card>
        <el-form
          label-position="top"
          :model="queryInventoryList"
          ref="ListFormRef"
        >
          <el-row :gutter="30">
            <el-col :span="6" v-show="ruleForm.dimension === 'KW'">
              <el-form-item label="库位名称" prop="locationName">
                <el-input
                  placeholder="请输入"
                  v-model="queryInventoryList.locationName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="ruleForm.dimension === 'KW'">
              <el-form-item label="库位编号" prop="locationCode">
                <el-input
                  placeholder="请输入"
                  v-model="queryInventoryList.locationCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <!--            货品名称-->
            <el-col :span="12" v-show="ruleForm.dimension === 'HP'">
              <el-form-item label="货品名称" prop="goodsName">
                <el-input
                  placeholder="请输入"
                  v-model="queryInventoryList.goodsName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="submit" :span="6">
              <el-form-item>
                <el-button @click="addInventoryList" type="warning" round
                  >搜索
                </el-button>
                <el-button type="info" @click="resetFields" plain round
                  >重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          v-if="tableDataList.length"
          :data="tableDataList"
          @selection-change="ListSelectionChange"
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
          <el-table-column prop="locationName" label="仓库名称" width="150">
          </el-table-column>
          <el-table-column prop="areaName" label="库区名称" width="150">
          </el-table-column>
          <el-table-column prop="locationCode" label="库位编号" width="180">
          </el-table-column>
          <el-table-column prop="locationName" label="库位名称" width="120">
          </el-table-column>
          <el-table-column
            prop="goodsTypeName"
            label="货品名称"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="goodsCode"
            label="货品编号"
            width="120"
          ></el-table-column>
          <el-table-column prop="goodsBarCode" label="货品条码" width="120">
          </el-table-column>
          <el-table-column prop="ownerName" label="货主名称" width="120">
          </el-table-column>
          <el-table-column prop="total" label="库存数量" width="120">
          </el-table-column>
        </el-table>
        <!--   分页   -->
        <el-row type="flex" justify="center" v-if="tableDataList.length">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="queryInventoryList.current"
            :page-sizes="[5, 10, 30, 40]"
            :page-size="queryInventoryList.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          >
          </el-pagination>
        </el-row>
        <div class="emptyTip" v-else>
          <span class="imgIcon"></span>
          <p>暂无库存</p>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchAddList">确认添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PDForNextEncode } from "@/api/codeFactory";
import { queryTheTreeLocation } from "@/api/goods-owner";
import { queryAllWarehouse } from "@/api/area";
import {
  queryInventoryListById,
  modifyList,
  addList,
  queryAllOwnersManagement,
  pagingQueryInventoryListingSubsidiary,
  pagingQueryDetailedInventory,
  batchAddList,
} from "@/api/list";

export default {
  name: "Details",
  data() {
    return {
      active: 0,
      ruleForm: {
        code: "", // 仓库编码
        status: 1,
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
        masterId: "",
      },
      // 分页查询明细库存
      queryInventoryList: {
        current: 1,
        locationCode: "", // 库位编码
        locationName: "", //库位名称
        size: 10,
        needFree: 1,
        areaId: "",
      },
      tableDataList: [],
      total: 0,
      total2: 0,
      dialogVisible: false,
      treeList: [],
      // 选中的库位数组
      multipleSelection: [],
      cancelAssignmentDialogBoxAll: false,
      // 当前的库位
      currentList: [],
      cancelAssignmentDialogBox: false,
      ownerList: [],
      addBatchList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
    };
  },
  created() {
    this.queryInventoryListById();
    this.queryAllWarehouse();
    this.queryAllOwnersManagement();
  },
  methods: {
    // 批量新增盘点清单
    async batchAddList() {
      if (this.addBatchList.length <= 0) {
        return this.$message.error("请勾选商品");
      }
      try {
        await batchAddList({
          masterId: this.queryList.masterId,
          stockIds: this.addBatchList,
        });
        this.dialogVisible = false;
        this.addBatchList = [];
        this.$message.success("添加成功");
        await this.addInventoryList();
      } catch (e) {
        console.log(e);
      }
    },
    // 重置表单
    resetFields() {
      this.$refs.ListFormRef.resetFields();
      this.addInventoryList();
    },
    async addInventoryList() {
      this.dialogVisible = true;
      const { data } = await pagingQueryDetailedInventory(
        this.queryInventoryList
      );
      this.tableDataList = data.data.records;
      this.total2 = data.data.total - 0;
    },
    async queryAllOwnersManagement() {
      const res = await queryAllOwnersManagement();
      console.log(res);
      res.data.data.forEach((item) => {
        this.ownerList.push({
          id: item.id,
          name: item.name,
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    ListSelectionChange(val) {
      this.addBatchList = [];
      val.forEach((item) => {
        this.addBatchList.push(item.id);
      });
    },
    // 对话框变化
    handleChange2(...args) {
      this.ruleForm.warehouseId = args[0][0];
      this.ruleForm.areaId = args[0][1];
    },
    // 点击每行取消分配
    cancellationDistribution() {
      this.$message.error("演示系统，不支持此操作");
    },
    async queryInventoryListById() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryInventoryListById(this.$route.params.id);
          this.ruleForm = res.data.data;
        } else {
          // 是新增 查询code
          const res = await PDForNextEncode();
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
        try {
          await this.$refs.ruleForm.validate();
          if (this.$route.params.id === "null") {
            const { data } = await addList(this.ruleForm);
            this.queryList.masterId = data.data.id;
            this.queryInventoryList.areaId = data.data.areaId;
          } else {
            if (this.ruleForm.dimension === "KW") {
              this.ruleForm.ownerId = null;
            } else {
              this.ruleForm.areaId = null;
              this.ruleForm.warehouseId = null;
            }
            const { data } = await modifyList(this.ruleForm);
            this.queryList.masterId = data.data.id;
            this.queryInventoryList.areaId = data.data.areaId;
          }
          this.$message.success("恭喜你，提交成功！");
          this.active++;
          await this.pagingQueryInventoryListingSubsidiary();
        } catch (e) {
          console.log(e);
        }
      } else {
        //   第二步 ：分配库位
        await this.$router.push("/manage-storage/list");
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
      if (this.active === 0) {
        for (let i = 0; i < res.data.data.length; i++) {
          const { data } = await queryTheTreeLocation(res.data.data[i].id);
          data.data.forEach((item) => {
            delete item.children;
            this.treeList[i].children.push(item);
          });
        }
      }
    },
    // 库位列表
    async pagingQueryInventoryListingSubsidiary() {
      const { data } = await pagingQueryInventoryListingSubsidiary(
        this.queryList
      );
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleSizeChange(newPage) {
      this.queryList.size = newPage;
      this.pagingQueryInventoryListingSubsidiary();
    },
    handleCurrentChange(newSize) {
      this.queryList.current = newSize;
      this.pagingQueryInventoryListingSubsidiary();
    },
    handleSizeChange2(newPage) {
      this.queryInventoryList.size = newPage;
      this.pagingQueryInventoryListingSubsidiary();
    },
    handleCurrentChange2(newSize) {
      this.queryInventoryList.current = newSize;
      this.pagingQueryInventoryListingSubsidiary();
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
  margin: 50px 0;
}

.el-pagination {
  margin-bottom: 30px;
}

.el-select,
el-cascader {
  width: 100%;
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
