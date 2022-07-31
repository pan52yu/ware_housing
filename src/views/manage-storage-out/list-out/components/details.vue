<template>
  <div>
    <el-card>
      <el-steps :active="active" finish-status="success">
        <el-step title="填写出库单基础信息"></el-step>
        <el-step title="填写承运商信息"></el-step>
        <el-step title="填写货品明细信息"></el-step>
      </el-steps>
      <!--   第一步：填写出库单基础信息   -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
        v-if="active === 0"
      >
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="出库单号" prop="code">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称" prop="warehouseId">
              <el-select
                clearable
                @change="searchReservoir"
                v-model="ruleForm.warehouseId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in this.areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区名称" prop="areaId">
              <el-select
                clearable
                @change="change"
                v-model="ruleForm.areaId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in this.ofList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第二行    -->
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="货主" prop="ownerName">
              <el-autocomplete
                style="width: 100%"
                clearable
                popper-class="my-autocomplete"
                v-model="ruleForm.ownerName"
                :fetch-suggestions="querySearch2"
                placeholder="请输入内容"
                @select="handleSelect2"
              >
                <i class="el-icon-search" slot="suffix"> </i>
                <template v-slot="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库类型" prop="type">
              <el-select
                clearable
                v-model="ruleForm.type"
                placeholder="请选择"
                value=""
              >
                <el-option label="B2B" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input
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
      <!--   第二步：填写货品明细信息   -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm2"
        label-width="100px"
        label-position="top"
        v-if="active === 1"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="运单单号" prop="billCode">
              <el-input v-model="ruleForm.billCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="承运商" prop="carrierId">
              <el-select
                clearable
                v-model="ruleForm.carrierId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in this.carrierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划出库时间" prop="deliveryName">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.planOutTime"
                prefix-icon="el-icon-date"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机姓名" prop="driverName">
              <el-input
                placeholder="请输入"
                v-model="ruleForm.driverName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第二行    -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="司机电话" prop="driverPhone">
              <el-input
                placeholder="请输入"
                v-model="ruleForm.driverPhone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号" prop="license">
              <el-input
                placeholder="请输入"
                v-model="ruleForm.license"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货人名称" prop="receiverName">
              <el-input
                placeholder="请输入"
                v-model="ruleForm.receiverName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="buttonBox">
            <el-button @click="active--" round>上一步</el-button>
            <el-button @click.native="next" type="warning" round
              >下一步
            </el-button>
          </div>
        </el-row>
      </el-form>
      <!--   第三步 ：填写货品明细信息  -->
      <div class="distributionTheReservoir" v-if="active === 2">
        <el-card style="margin: 30px 0 15px 0">
          <el-row>
            <el-button type="success" @click="addInventoryList" round
              >添加货品
            </el-button>
            <el-button round @click="cancellationDistribution"
              >删除货品
            </el-button>
          </el-row>
          <el-row v-show="multipleSelection.length">
            <div class="divTableTitle">
              <span class="divLabel">总计:</span>
              <span class="spanValue">{{ allPlanNum }}件</span>
              <span class="divLabel">总体积</span>
              <span class="spanValue">{{ allGoodsVolume }}m³</span>
            </div>
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
              prop="ownerName"
              label="货主名称"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsCode"
              label="货品编号"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsName"
              label="货品名称"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsTypeName"
              label="货品类型"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="货品单价(元)"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsGuaranteeDay"
              label="质保天数(天)"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsUnit"
              label="单位"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="goodsVolume"
              label="体积"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="planNum"
              label="到货数量"
              width="160"
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
            <p>暂无入库单</p>
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
            <el-col :span="6">
              <el-form-item label="货品" prop="goods">
                <el-input
                  placeholder="请输入名称/编码/条码"
                  v-model="queryInventoryList.goods"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货主" prop="owner">
                <el-input
                  placeholder="请输入名称/编码"
                  v-model="queryInventoryList.owner"
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
          <el-table-column prop="ownerName" label="货主名称" width="150">
          </el-table-column>
          <el-table-column prop="ownerCode" label="货品编码" width="150">
          </el-table-column>
          <el-table-column prop="name" label="货品名称" width="180">
          </el-table-column>
          <el-table-column prop="goodsTypeName" label="货品类型" width="120">
          </el-table-column>
          <el-table-column
            prop="price"
            label="货品单价(元)"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="guaranteeDay"
            label="质保天数(天)"
            width="120"
          ></el-table-column>
          <el-table-column prop="unit" label="单位" width="120">
          </el-table-column>
          <el-table-column prop="volume" label="体积(m³)" width="120">
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
        <el-button type="primary" @click="batchAddGoods">确认添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HPForNextEncode } from "@/api/codeFactory";
import { queryAllWarehouse } from "@/api/area";
import { fuzzyQueryOwner } from "@/api/goods";
import { batchAddGoods } from "@/api/list-in";
import { pagingQueryDetailedInventory } from "@/api/list";
import { queryAllArea } from "@/api/location";
import {
  queryAllShippers,
  addOutboundOrder,
  modifyOutboundOrder,
  queryOutboundOrderListById,
  pagingQueryOutboundListingSubsidiary,
} from "@/api/list-out";

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
            message: "请输入入库单号",
          },
        ],
        billCode: [
          {
            required: true,
            message: "请输入运单编号",
          },
        ],
        planArrivalTime: [
          {
            required: true,
            message: "请输入计划到达时间",
          },
        ],
        ownerName: [
          {
            required: true,
            message: "请输入货主名称/编码",
          },
        ],
        warehouseId: [
          {
            required: true,
            message: "请选择仓库",
          },
        ],
        shipperName: [
          {
            required: true,
            message: "请输入发货人姓名",
          },
        ],
        deliveryName: [
          {
            required: true,
            message: "请输入送货人姓名",
          },
        ],
        deliveryPhone: [
          {
            required: true,
            message: "请输入送货人电话",
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
        goods: "",
        current: 1,
        size: 10,
        areaId: "",
      },
      tableDataList: [],
      total: 0,
      total2: 0,
      dialogVisible: false,
      // 选中的库位数组
      multipleSelection: [],
      areaList: [],
      cancelAssignmentDialogBoxAll: false,
      // 当前的库位
      currentList: [],
      cancelAssignmentDialogBox: false,
      addBatchList: [],
      restaurant2: [],
      ofList: [], //库区列表
      carrierList: [], //承运商列表
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
    };
  },
  created() {
    this.queryOutboundOrderListById();
    this.fuzzyQueryOwner();
    this.queryAllWarehouse();
  },
  computed: {
    allGoodsVolume() {
      let sum = 0;
      this.multipleSelection.forEach((item) => (sum += item.goodsVolume - 0));
      return sum;
    },
    allPlanNum() {
      let sum = 0;
      this.multipleSelection.forEach((item) => (sum += item.planNum - 0));
      return sum;
    },
  },
  methods: {
    change(id) {
      console.log(id);
    },
    // 根据仓库找库区
    async searchReservoir(id) {
      console.log(id);
      const { data } = await queryAllArea({
        warehouseId: id,
      });
      console.log(data);
      this.ofList = data.data;
    },
    async queryAllWarehouse() {
      const { data } = await queryAllWarehouse();
      console.log(data);
      this.areaList = data.data;
    },
    querySearch2(queryString, cb) {
      const restaurants = this.restaurant2;
      const results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 找仓库
    async handleSelect2(item) {
      console.log(item);
      this.ruleForm.ownerId = item.address;
      this.ruleForm.ownerName = item.value;
    },
    //  模糊查询货主 fuzzyQueryOwner
    async fuzzyQueryOwner() {
      console.log(1131241221421);
      const res = await fuzzyQueryOwner();
      this.qwneList = res.data.data;
      this.qwneList.forEach((item) => {
        if (item.id === this.ruleForm.ownerId) {
          this.ruleForm.ownerName = item.name;
        }
        this.restaurant2.push({
          value: item.name,
          address: item.id,
        });
      });
    },
    // 批量新增盘点清单
    async batchAddGoods() {
      if (this.addBatchList.length <= 0) {
        return this.$message.error("请勾选商品");
      }
      try {
        await batchAddGoods({
          masterId: this.queryList.masterId,
          goodsIds: this.addBatchList,
        });
        this.addBatchList = [];
        this.$message.success("添加成功");
        await this.addInventoryList();
      } catch (e) {
        console.log(e);
      }
      this.dialogVisible = false;
    },
    // 重置表单
    resetFields() {
      this.$refs.ListFormRef.resetFields();
      this.addInventoryList();
    },
    async addInventoryList() {
      this.dialogVisible = true;
      console.log(this.ruleForm.areaId);
      const { data } = await pagingQueryDetailedInventory({
        ...this.queryInventoryList,
        ownerId: this.ruleForm.ownerId,
        areaId: this.ruleForm.areaId,
      });
      this.tableDataList = data.data.records;
      this.total2 = data.data.total - 0;
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
    // 点击每行取消分配
    cancellationDistribution() {
      this.$message.error("演示系统，不支持此操作");
    },
    async queryOutboundOrderListById() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryOutboundOrderListById(this.$route.params.id);
          this.ruleForm = res.data.data;
        } else {
          // 是新增 查询code
          const res = await HPForNextEncode();
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
          if (this.$route.params.id === "null") {
            await this.$refs.ruleForm.validate();
            const { data } = await queryAllShippers();
            console.log(data);
            this.carrierList = data.data;
          }
        } catch (e) {
          console.log(e);
        }
        this.active++;
        // 第二步：填写货品明细信息
      } else if (this.active === 1) {
        try {
          if (this.$route.params.id === "null") {
            const { data } = await addOutboundOrder(this.ruleForm);
            this.queryList.masterId = data.data.id;
            this.queryInventoryList.areaId = data.data.areaId;
          } else {
            if (this.ruleForm.dimension === "KW") {
              this.ruleForm.ownerId = null;
            } else {
              this.ruleForm.warehouseId = null;
            }
            const { data } = await modifyOutboundOrder(this.ruleForm);
            this.queryList.masterId = data.data.id;
            this.queryInventoryList.areaId = data.data.areaId;
          }
          this.$message.success("恭喜你，提交成功！");
          await this.pagingQueryOutboundListingSubsidiary();
        } catch (e) {
          console.log(e);
        }
        this.active++;
      } else {
        // 第三步 ：填写货品明细信息
        await this.$router.push("/manage-storage-out/list-out");
      }
    },
    // 入库清单明细
    async pagingQueryOutboundListingSubsidiary() {
      console.log(1112211124);
      const { data } = await pagingQueryOutboundListingSubsidiary(
        this.queryList
      );
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleSizeChange(newPage) {
      this.queryList.size = newPage;
      this.pagingQueryOutboundListingSubsidiary();
    },
    handleCurrentChange(newSize) {
      this.queryList.current = newSize;
      this.pagingQueryOutboundListingSubsidiary();
    },
    handleSizeChange2(newPage) {
      this.queryInventoryList.size = newPage;
      this.pagingQueryDetailedInventory();
    },
    handleCurrentChange2(newSize) {
      this.queryInventoryList.current = newSize;
      this.pagingQueryDetailedInventory();
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
  width: 50%;
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

.divTableTitle {
  background: #fff9eb;
  border: 1px solid #ffb200;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  padding-left: 9px;
  width: 220px;
  margin-top: 15px;

  .spanValue {
    padding-right: 18px;
    color: #ffb200;
  }
}
</style>
