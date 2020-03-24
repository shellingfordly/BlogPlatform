<template>
  <div class="userInformation">
    <BackBtn :link="link"></BackBtn>
    <div class="container clearfix">
      <div class="form_box">
        <p class="title">基础信息</p>
        <iframe name="hidden" style="display:none;"></iframe>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          target="hidden"
        >
          <el-form-item label="账号" class="clearfix" prop="account">
            <el-input v-model="ruleForm.account" disabled></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="签名" prop="signature">
            <el-input v-model="ruleForm.signature"></el-input>
          </el-form-item>
          <el-form-item label="关于我" prop="about">
            <el-input type="textarea" v-model="ruleForm.about"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <button class="btn" @click="submitForm('ruleForm')">确定</button>
              <button class="btn" @click="cancel">取消</button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="other_box">
        <p class="title">其他信息 (可不填)</p>
        <el-form
          :model="ruleForm2"
          :rules="rules2"
          ref="ruleForm2"
          class="demo-ruleForm"
          label-width="100px"
          target="hidden"
        >
          <el-form-item label="微博" prop="weibo">
            <el-input v-model="ruleForm2.weibo" placeholder="http://xxx.xxx.xxx"></el-input>
          </el-form-item>
          <el-form-item label="博客" prop="boke">
            <el-input v-model="ruleForm2.boke" placeholder="http://xxx.xxx.xxx"></el-input>
          </el-form-item>
          <el-form-item label="github" prop="github">
            <el-input v-model="ruleForm2.github" placeholder="http://xxx.xxx.xxx"></el-input>
          </el-form-item>
          <el-form-item label="bilibili" prop="bilibili">
            <el-input v-model="ruleForm2.bilibili" placeholder="http://xxx.xxx.xxx"></el-input>
          </el-form-item>
          <el-form-item>
            <button id="hideBtn" style="display: none" @click="submitForm2('ruleForm2')">确定</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackBtn from "../components/BackBtn";

export default {
  name: "userInformation",
  components: {
    BackBtn
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入昵称"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validateWeibo = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (value.match(/^(http(s)?:\/\/).+\.com\/.+$/g) === null) {
        callback(new Error("请输入正确链接(或不填)"));
      } else {
        callback();
      }
    };
    return {
      link: "about",
      check: false,
      ruleForm: {
        name: "",
        password: "",
        account: "",
        signature: "",
        about: ""
      },
      rules: {
        password: [{ validator: validatePassword, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }]
      },
      ruleForm2: {
        weibo: "",
        boke: "",
        github: "",
        bilibili: ""
      },
      rules2: {
        weibo: [{ validator: validateWeibo, trigger: "blur" }],
        boke: [{ validator: validateWeibo, trigger: "blur" }],
        github: [{ validator: validateWeibo, trigger: "blur" }],
        bilibili: [{ validator: validateWeibo, trigger: "blur" }]
      }
    };
  },
  created() {
    this.searchUserMsg();
  },
  methods: {
    searchUserMsg() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        this.$router.push({ name: "home" });
        return;
      }
      this.ruleForm.account = user.account;
      this.ruleForm.password = user.password;
      this.ruleForm.name = user.name || "用户" + user.num;
      this.ruleForm.signature = user.signature || "暂无签名";
      this.ruleForm.about = user.about || "...";
      // this.ruleForm.other = user.other;
    },
    submitForm(formName) {
      var e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("hideBtn").dispatchEvent(e);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.check) this.alert();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm2(formName2) {
      this.$refs[formName2].validate(valid => {
        if (valid) {
          this.check = true;
        } else {
          this.check = false;
          return false;
        }
      });
    },
    cancel() {
      this.$router.push({ name: "about" });
    },
    alert() {
      this.$confirm("确定修改吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.modifyInformation();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    modifyInformation() {
      let user = this.ruleForm;
      user.other = this.ruleForm2;
      axios.post("http://localhost:3000/modifyUserMsg", user).then(res => {
        if (res.code)
          this.$message({
            type: "info",
            message: "修改成功!"
          });
        localStorage.setItem("user", JSON.stringify(res.msg));
        this.$router.push({ name: "about" });
      });
    }
  }
};
</script>

<style lang="stylus">
@import '../assets/css/information.styl';

.userInformation {
  display: flex;
  align-items: center;
  height: 100%;

  .container {
    .form_box, .other_box {
      .title {
        padding: 10px 0 20px 100px;
        color: #555;
        font-weight: bold;
      }
    }

    .form_box {
      float: left;
      margin-right: 20px;
    }

    .el-form {
      .el-textarea__inner {
        background-color: #222;
        resize: none;
        border: 0;
        color: #ccc;
      }
    }

    .btn {
      display: inline-block;
      background-color: #222;
      width: 50px;
      height: 30px;
      margin-right: 20px;
      border: 0;
      outline: none;
      color: #8a8a8a;
      cursor: pointer;
    }

    .btn:hover {
      color: #ccc;
    }

    .other_box {
      float: right;
      width: 300px;
    }
  }
}
</style>
