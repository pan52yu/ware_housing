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
          <el-col :span="16">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item label="仓库编码">
                  <el-input disabled v-model="ruleForm.code"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="仓库名称" prop="name">
                  <el-input
                    clearable
                    placeholder="请输入"
                    v-model="ruleForm.name"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仓库类型" prop="type">
              <el-select
                style="width: 100%"
                v-model="ruleForm.type"
                placeholder="请选择"
                value=""
              >
                <el-option label="中转仓" value="ZZ"></el-option>
                <el-option label="加工仓" value="JG"></el-option>
                <el-option label="储存仓" value="CB"></el-option>
                <el-option label="冷藏仓" value="LC"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    省市区    -->
        <el-row>
          <el-col :span="16">
            <el-form-item label="省市区" prop="location">
              <el-cascader
                size="large"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                v-model="ruleForm.location"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-form-item label="详细地址">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.address"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仓库状态" prop="status">
              <el-radio v-model="ruleForm.status" :label="1">启用</el-radio>
              <el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item label="仓库面积">
                  <el-input
                    clearable
                    placeholder="请输入"
                    v-model="ruleForm.surface"
                  >
                    <template #suffix>
                      <div class="suffix">m³</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="负责人" prop="personName">
                  <el-input
                    clearable
                    placeholder="请输入"
                    v-model="ruleForm.personName"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7">
            <el-form-item label="联系电话">
              <el-input
                clearable
                placeholder="请输入"
                v-model="ruleForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { forNextEncode } from "@/api/codeFactory";
import { addWarehouse, modifyWarehouse, queryWarehouse } from "@/api/warehouse";
import { regionDataPlus, CodeToText } from "element-china-area-data";

export default {
  name: "Details",
  data() {
    return {
      options: regionDataPlus,
      ruleForm: {
        code: "22222", // 仓库编码
        name: "", // 仓库名称
        type: "", // 仓库类型
        address: "", // 详细地址
        surface: "", // 仓库面积
        personName: "", // 负责人
        phone: "", // 联系电话
        status: 1, // 仓库状态
      },
      ceshi: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入仓库名称",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择仓库类型",
          },
        ],
        location: [
          {
            required: true,
            message: "请选择省市区",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
          },
        ],
        personName: [
          {
            required: true,
            message: "请选择负责人",
          },
        ],
      },
      value: [],
    };
  },
  created() {
    this.queryWarehouse();
  },
  methods: {
    // 查询仓库根据id 或 查询code
    async queryWarehouse() {
      try {
        // 不是新增就是编辑 发查询请求
        if (this.$route.params.id !== "null") {
          const res = await queryWarehouse(this.$route.params.id);
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
          this.ceshi = [
            CodeToText[this.ruleForm.province],
            CodeToText[this.ruleForm.city],
            CodeToText[this.ruleForm.area],
          ].join("/");
        } else {
          // 是新增 查询code
          const res = await forNextEncode();
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
          await addWarehouse(this.ruleForm);
        } else {
          await modifyWarehouse(this.ruleForm);
        }
        this.$router.back();
        this.$message.success("恭喜你，提交成功！");
      } catch (e) {
        console.log(e);
      }
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
