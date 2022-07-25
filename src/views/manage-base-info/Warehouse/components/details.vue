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
                <el-form-item label="仓库编码" prop="code">
                  <el-input disabled v-model="ruleForm.code"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="仓库名称" prop="name">
                  <el-input
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
        <!--    TODO：省市区    -->
        <el-row>
          <el-col :span="16">
            <el-form-item label="省市区" prop="name">
              <el-input placeholder="请输入" v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--    TODO    -->
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-form-item label="详细地址">
              <el-input
                placeholder="请输入"
                v-model="ruleForm.address"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仓库状态" prop="type">
              <template>
                <el-radio v-model="ruleForm.status" label="1">启用</el-radio>
                <el-radio v-model="ruleForm.status" label="0">禁用</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-form-item label="仓库面积">
                  <el-input placeholder="请输入" v-model="ruleForm.surface">
                    <template #suffix>
                      <div class="suffix">m³</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="仓库名称" prop="personName">
                  <el-input
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
                placeholder="请输入"
                v-model="ruleForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="buttonBox">
            <el-button round>返回</el-button>
            <el-button type="warning" round>提交</el-button>
          </div>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { forNextEncod } from "@/api/codeFactory";

export default {
  name: "Details",
  data() {
    return {
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
      rules: {
        name: [
          {
            required: true,
            message: "Name is required.",
          },
        ],
        type: [
          {
            required: true,
            message: "Name is required.",
          },
        ],
        personName: [
          {
            required: true,
            message: "Name is required.",
          },
        ],
      },
    };
  },
  created() {
    this.forNextEncod();
  },
  methods: {
    async forNextEncod() {
      const res = await forNextEncod();
      console.log(res);
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
