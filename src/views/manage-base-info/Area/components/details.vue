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
        <el-row type="flex" justify="space-between">
          <el-col :span="5">
            <el-form-item label="库区编号" prop="code">
              <el-input disabled v-model="ruleForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所属仓库" prop="warehouseId">
              <el-select
                style="width: 100%"
                v-model="ruleForm.warehouseId"
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="库区名称" prop="name">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
        <el-row type="flex" justify="space-between">
          <!--    承重类型      -->
          <el-col :span="5">
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
          <el-col :span="5">
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
          <el-col :span="5">
            <el-form-item label="负责人" prop="personName">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.personName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系电话">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    第三行 库区状态    -->
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-form-item label="仓库状态" prop="status">
              <el-radio v-model="ruleForm.status" :label="1">启用</el-radio>
              <el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
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
import { KQForNextEncode } from "@/api/codeFactory";
import {
  queryAllWarehouse,
  queryWarehouse,
  modifyArea,
  addArea,
} from "@/api/area";

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
      ceshi: [],
      rules: {
        code: [
          {
            required: true,
            message: "请输入库区编号",
          },
        ],
        warehouseId: [
          {
            required: true,
            message: "请选择仓库类型",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入库区名称",
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
        personName: [
          {
            required: true,
            message: "请输入负责人",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择库区状态",
          },
        ],
      },
      value: [],
      list: [],
    };
  },
  created() {
    this.queryWarehouse();
    this.queryAllWarehouse();
  },
  methods: {
    async queryAllWarehouse() {
      const res = await queryAllWarehouse();
      this.list = res.data.data;
    },
    // 查询仓库根据id 或 查询code
    async queryWarehouse() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryWarehouse(this.$route.params.id);
          this.ruleForm = res.data.data;
        } else {
          // 是新增 查询code
          const res = await KQForNextEncode();
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
          await addArea(this.ruleForm);
        } else {
          await modifyArea(this.ruleForm);
        }
        this.$router.back();
        this.$message.success("恭喜你，提交成功！");
      } catch (e) {
        console.log(e);
      }
    },
    handleChange(value) {
      console.log(value);
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
    background: #e7dfdf;
    border-radius: 0 6px 6px 0;
    padding: 0 10px;
    border: 0;
  }
}
</style>
