<template>
  <div>
    <el-card>
      <div class="login">
        <div class="loginTitleImg">
          <img src="@/assets/logintitle.png" alt="" />
        </div>
        <el-form
          :model="loginFrom"
          :rules="loginRules"
          ref="loginRuleForm"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input placeholder="请输入账号" v-model="loginFrom.username">
              <template #prepend>
                <i class="el-icon-mobile-phone"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              show-password
              type="password"
              v-model="loginFrom.password"
            >
              <template #prepend>
                <i class="el-icon-lock"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-row>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-row>
          <el-row>
            <el-button @click="goLogin" class="login-btn" type="warning"
              >立即登录
            </el-button>
          </el-row>
        </el-form>
      </div>
      <div class="contentBg"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "111111",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入账户",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
          },
        ],
      },
      checked: "",
    };
  },
  created() {},
  methods: {
    goLogin() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  width: 958px;
  height: 516px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgb(93 93 93 / 33%);
  background-color: #fff;
  border-radius: 40px;

  .login {
    width: 398px;
    height: 516px;
    background: #fff;
    border-radius: 34px 0 0 34px;
    margin: 0 auto;
  }

  .contentBg {
    background-repeat: no-repeat;
    background-size: cover;
    width: 560px;
    height: 516px;
    background-image: url(@/assets/contentBg.png);
  }
}

/deep/ .el-card__body {
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.loginTitleImg {
  margin-left: 124px;
  margin-top: 72px;

  img {
    width: 150px;
    height: 64px;
  }
}

/deep/ .login-form {
  padding: 40px 0 0 60px;

  .el-form-item {
    width: 280px;
    margin: 30px 0;

    input {
      height: 50px;
      background-color: #f8f5f5;
    }

    .el-input-group__prepend {
      background-color: #eae7e7;
    }

    .el-icon-lock,
    .el-icon-mobile-phone {
      font-size: 24px;
      padding-left: 10px;
    }

    .el-input-group__prepend {
      width: 50px;
      padding: 0;
    }
  }

  .login-btn {
    margin-top: 20px;
    width: 280px;
    height: 50px;
    background: #ffb200;
    border-radius: 8px;
    box-shadow: 0 2px 9px 1px rgb(255 178 0 / 47%);
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #332929;
    line-height: 22px;
  }
}
</style>
