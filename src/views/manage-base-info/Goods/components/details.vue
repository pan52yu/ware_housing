<template>
  <div>
    <el-card>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <!--    第一行    -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="货品编码" prop="code">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货品类型">
              <!--              <el-input clearable v-model="ruleForm.goodsTypeName"></el-input>-->
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="ruleForm.goodsTypeName"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              >
                <i class="el-icon-search" slot="suffix"> </i>
                <template v-slot="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货品名称" prop="name">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货品条码" prop="barCode">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.barCode"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--     第二行   -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="货主" prop="ownerName">
              <!--              <el-input v-model="ruleForm.ownerName"></el-input>-->
              <el-autocomplete
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
          <el-col :span="6">
            <el-form-item label="质检方式" prop="inspectionType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.inspectionType"
                placeholder="请选择"
                value=""
              >
                <el-option label="不质检" value="BCL"></el-option>
                <el-option label="全检" value="QJ"></el-option>
                <el-option label="抽检" value="CJ"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="温度要求" prop="temperatureType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.temperatureType"
                placeholder="请选择"
                value=""
              >
                <el-option label="常温" value="CW"></el-option>
                <el-option label="冷藏" value="LC"></el-option>
                <el-option label="恒温" value="HW"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="承重要求" prop="bearingType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.bearingType"
                placeholder="请选择"
                value=""
              >
                <el-option label="重型" value="ZX"></el-option>
                <el-option label="轻型" value="OX"></el-option>
                <el-option label="中型" value="BX"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第三行     -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="体积" prop="volume">
              <el-input placeholder="请输入" v-model="ruleForm.volume">
                <template #suffix>
                  <div class="suffix">m³</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="指定库区">
              <el-select
                style="width: 100%"
                v-model="ruleForm.areaId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  label="出库缓存区"
                  :value="specifyReservoir[0]?.id"
                ></el-option>
                <el-option
                  label="冻结区"
                  :value="specifyReservoir[1]?.id"
                ></el-option>
                <el-option
                  label="存储区"
                  :value="specifyReservoir[2]?.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单价">
              <el-input placeholder="请输入" v-model.trim="ruleForm.price">
                <template #suffix>
                  <div class="suffix">元</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.unit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第四行    -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="保质天数">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.guaranteeDay"
              >
                <template #suffix>
                  <div class="suffix">天</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    底部    -->
        <el-row>
          <div class="buttonBox">
            <el-button @click="$router.back()" round>返回</el-button>
            <el-button @click.native="submit" type="warning" round
              >提交
            </el-button>
          </div>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { HPForNextEncode } from "@/api/codeFactory";
import {
  queryGoods,
  modifyGoods,
  addGoods,
  fuzzyQueryItemType,
  fuzzyQueryOwner,
  queryReservoirByOwnerId,
} from "@/api/goods";

export default {
  name: "Details",
  data() {
    return {
      ruleForm: {
        code: "", // 库区编码
        name: "", // 库区名称
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入货品编码",
          },
        ],
        goodsTypeName: [
          {
            required: true,
            message: "请输入货品类型名称/货品类型编码",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入货品名称",
          },
        ],
        barCode: [
          {
            required: true,
            message: "请输入货品条码",
          },
        ],
        ownerName: [
          {
            required: true,
            message: "请输入货主名称/编码",
          },
        ],
        inspectionType: [
          {
            required: true,
            message: "请选择质检方式",
          },
        ],
        temperatureType: [
          {
            required: true,
            message: "请选择温度要求",
          },
        ],
        bearingType: [
          {
            required: true,
            message: "请选择承重要求",
          },
        ],
        volume: [
          {
            required: true,
            message: "请输入体积",
          },
        ],
      },
      itemTypeList: [], //货品类型
      qwneList: [], //货主类型
      specifyReservoir: [], //指定库区
      restaurants: [],
      restaurant2: [],
    };
  },
  created() {
    this.queryGoods();
    this.fuzzyQueryItemType();
    this.fuzzyQueryOwner();
  },
  methods: {
    querySearch(queryString, cb) {
      const restaurants = this.restaurants;
      const results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
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
    handleSelect(item) {
      this.ruleForm.goodsTypeId = item.address;
    },
    handleSelect2(item) {
      this.ruleForm.ownerId = item.address;
    },
    // 模糊查询货品类型 fuzzyQueryItemType
    async fuzzyQueryItemType() {
      const res = await fuzzyQueryItemType();
      this.itemTypeList = res.data.data;
      this.itemTypeList.forEach((item) => {
        if (item.id === this.ruleForm.goodsTypeId) {
          this.ruleForm.goodsTypeName = item.name;
        }
        this.restaurants.push({
          value: item.name,
          address: item.id,
        });
      });
    },
    //  模糊查询货主 fuzzyQueryOwner
    async fuzzyQueryOwner() {
      const res = await fuzzyQueryOwner();
      const { data } = await queryReservoirByOwnerId(res.data.data.id);
      this.specifyReservoir = data.data;
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
    // 查询仓库根据id 或 查询code
    async queryGoods() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryGoods(this.$route.params.id);
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
    async submit() {
      try {
        await this.$refs.ruleForm.validate();
        if (this.$route.params.id === "null") {
          await addGoods(this.ruleForm);
        } else {
          await modifyGoods(this.ruleForm);
        }
        this.$router.back();
        this.$message.success("恭喜你，提交成功！");
      } catch (e) {
        console.log(e);
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
    color: #000;
    background: #e7dfdf;
    border-radius: 0 6px 6px 0;
    padding: 0 10px;
    border: 0;
  }
}

/deep/ .tableNone {
  .el-form-item__label {
    opacity: 0;
  }
}
</style>
