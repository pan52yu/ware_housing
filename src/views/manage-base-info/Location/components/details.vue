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
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="库区">
              <el-cascader
                v-model="ruleForm.areaId"
                :options="cascaderList"
                @change="handleChange"
                @expand-change="handleChange2"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库位编号">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库位名称" prop="name">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="温度类型" prop="temperatureType">
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
        </el-row>
        <el-row :gutter="30">
          <!--    承重类型      -->
          <el-col :span="6">
            <el-form-item label="承重类型" prop="bearingType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.bearingType"
                placeholder="请选择"
                value=""
              >
                <el-option label="重型" value="ZX"></el-option>
                <el-option label="轻型" value="QX"></el-option>
                <el-option label="中型" value="BX"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          用途属性-->
          <el-col :span="6">
            <el-form-item label="用途属性" prop="useType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.useType"
                placeholder="请选择"
                value=""
              >
                <el-option label="入库缓存区" value="RKHCQ"></el-option>
                <el-option label="出库缓存区" value="CKHCQ"></el-option>
                <el-option label="存储区" value="CCQ"></el-option>
                <el-option label="分拣区" value="FJQ"></el-option>
                <el-option label="质检区" value="ZJQ"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="停用状态" prop="status">
              <el-radio v-model="ruleForm.status" :label="1">启用</el-radio>
              <el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第三行     -->
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="承重体积" prop="maxVolume">
              <el-input
                placeholder="请输入"
                v-model.number="ruleForm.maxVolume"
              >
                <template #suffix>
                  <div class="suffix">m³</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="承重上限">
              <el-input placeholder="请输入" v-model.number="ruleForm.maxNum">
                <template #suffix>
                  <div class="suffix">↑</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="承重重量">
              <el-input
                placeholder="请输入"
                v-model.number="ruleForm.maxWeight"
              >
                <template #suffix>
                  <div class="suffix">Kg</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第四行    -->
        <el-row :gutter="30">
          <el-col :span="4">
            <el-form-item label="库位排/列/层" prop="e">
              <el-input
                palceholder="请输入"
                v-model="ruleForm.locationRow"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="tableNone" label="列" prop="e">
              <el-input
                palceholder="请输入"
                v-model="ruleForm.locationColumn"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="tableNone" label="层" prop="e">
              <el-input
                palceholder="请输入"
                v-model="ruleForm.locationLayer"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="库位长/宽/高">
              <el-input
                @input="limitInput($event, 'locationLength')"
                placeholder="请输入"
                v-model.trim="ruleForm.locationLength"
              >
                <template #suffix>
                  <div class="suffix">cm</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="tableNone" label="宽">
              <el-input
                placeholder="请输入"
                v-model.number="ruleForm.locationWidth"
              >
                <template #suffix>
                  <div class="suffix">cm</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="tableNone" label="高">
              <el-input
                placeholder="请输入"
                v-model.number="ruleForm.locationHigh"
              >
                <template #suffix>
                  <div class="suffix">cm</div>
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
import { KWForNextEncode } from "@/api/codeFactory";
import { queryAllWarehouse } from "@/api/area";
import {
  queryLocation,
  modifyLocation,
  queryAllArea,
  addLocation,
} from "@/api/location";

export default {
  name: "Details",
  data() {
    return {
      ruleForm: {
        code: "", // 库区编码
        name: "", // 库区名称
        personName: "", // 负责人
        phone: "", // 联系电话
        status: 1, // 库区状态
      },
      rules: {
        areaId: [
          {
            required: true,
            message: "请输入库区",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入库位名称",
          },
        ],
        temperatureType: [
          {
            required: true,
            message: "请选择温度类型",
          },
        ],
        bearingType: [
          {
            required: true,
            message: "请选择承重类型",
          },
        ],
        useType: [
          {
            required: true,
            message: "请选择用途类型",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择库区状态",
          },
        ],
        maxVolume: [
          {
            required: true,
            message: "请选择承重体积",
          },
        ],
      },
      value: [],
      // 获取全部信息
      list: [],
      cascaderList: [],
    };
  },
  created() {
    this.queryLocation();
    this.queryAllWarehouse();
  },
  methods: {
    handleChange2(...args) {
      this.queryAllArea(args[0][0]);
    },
    handleChange(...args) {
      console.log(args);
      this.ruleForm.location = args[0];
      this.ruleForm.warehouseId = args[0][0];
    },
    limitInput(value, name) {
      this.ruleForm[name] =
        ("" + value)
          .replace(/[^\d^.]+/g, "")
          .replace(/^0+(\d)/, "$1")
          .replace(/^\./, "0.")
          .match(/^\d*(\.?\d{0,2})/g)[0] || "";
    },
    async queryAllWarehouse() {
      const res = await queryAllWarehouse();
      this.list = res.data.data;
      this.list.forEach((item) => {
        this.cascaderList.push({
          value: item.id,
          label: item.name,
          children: [],
        });
      });
    },
    // 根据库位查询库区
    async queryAllArea(id) {
      const result = await queryAllArea({
        warehouseId: id,
        status: 1,
      });
      this.cascaderList.forEach((item, index) => {
        if (item.value === id) {
          result.data.data.forEach((i) => {
            this.cascaderList[index].children.push({
              value: i.id,
              label: i.name,
            });
          });
        }
      });
    },
    // 查询仓库根据id 或 查询code
    async queryLocation() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryLocation(this.$route.params.id);
          this.ruleForm = res.data.data;
          await this.queryAllArea(this.ruleForm.warehouseId);
        } else {
          // 是新增 查询code
          const res = await KWForNextEncode();
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
          this.ruleForm.areaId = this.ruleForm.areaId[1];
          await addLocation(this.ruleForm);
        } else {
          await modifyLocation(this.ruleForm);
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
