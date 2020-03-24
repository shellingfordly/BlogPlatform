<template>
  <div class="login">
    <BackBtn :link="link"></BackBtn>

    <div class="container">
      <p class="title">
        <button class="title-btn" @click="switchTitle">{{ title? "登录" : "注册" }}</button>
      </p>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="account">
          <div class="el-i">
            <i class="el-icon-user-solid"></i>
          </div>
          <el-input type="text" v-model.number="ruleForm.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <div class="el-i">
            <i class="el-icon-lock"></i>
          </div>
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="密码"
            @keyup.native.enter="keyLogin('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-box">
            <i class="el-icon-circle-check i-btn" @click="submitForm('ruleForm')" title="登录/注册"></i>
            <i class="el-icon-refresh-right i-btn" @click="resetForm('ruleForm')" title="重置"></i>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackBtn from "../components/BackBtn";

export default {
  name: "login",
  components: {
    BackBtn
  },
  data() {
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      link: "auto",
      title: true,
      ruleForm: {
        pass: "",
        account: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    switchTitle() {
      this.title = !this.title;
    },
    login() {
      if (this.title) {
        // 登录
        axios
          .post("http://localhost:3000/login", {
            account: this.ruleForm.account,
            password: this.ruleForm.pass
          })
          .then(res => {
            if (res.code == 1) {
              this.$message("登录成功");
              localStorage.setItem("user", JSON.stringify(res.msg));
              this.$router.push({ name: "home" });
            } else if (res.code == 2) {
              this.$message("密码错误");
            } else {
              this.$message("用户不存在");
            }
          });
      } else {
        // 注册
        axios
          .post("http://localhost:3000/logon", {
            account: this.ruleForm.account,
            password: this.ruleForm.pass
          })
          .then(res => {
            if (res.code) {
              this.$message("注册成功，自动登录");
              localStorage.setItem("user", JSON.stringify(res.msg));
              this.$router.push({ name: "home" });
            } else {
              this.$message("账号已存在，请重新注册");
            }
          });
      }
    },
    keyLogin(ruleForm) {
      this.submitForm(ruleForm);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="stylus" >
.login {
  display: flex;
  align-items: center;
  height: 100%;

  .container {
    margin: auto;

    .title {
      text-align: center;
      margin-bottom: 20px;

      .title-btn {
        cursor: pointer;
        background-color: #000;
        border: 0;
        color: #bbb;
        font-size: 20px;
        outline: 0;
      }
    }

    .el-form {
      .el-form-item__content {
        position: relative;
        padding-left: 30px;

        .el-i {
          position: absolute;
          top: 0;
          left: 0;
          line-height: 40px;

          i {
            font-size: 18px;
            color: #8a8a8a;
          }
        }

        .el-input {
          .el-input__inner {
            background-color: #222;
            border: 0;
            color: #ccc;
          }

          input::-webkit-input-placeholder { /* WebKit browsers */
            color: #666;
          }

          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #666;
          }

          input::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #666;
          }

          input:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #666;
          }
        }

        .el-input__suffix {
          .el-input__validateIcon {
            color: #ccc;
          }
        }

        .el-form-item__error {
          padding-left: 30px;
          color: #8a8a8a;
        }
      }

      .el-form-item__content {
        .btn-box {
          width: 70px;
          margin-left: 50px;

          .i-btn:first-of-type {
            margin-right: 20px;
          }

          .i-btn {
            margin-top: 20px;
            color: #8a8a8a;
            font-size: 25px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
