<template>
  <div class="about">
    <BackBtn :link="link"></BackBtn>

    <div class="headerbox">
      <div class="headerbox_link" @click="isEditable && (dialogVisible = true)">
        <img :src="headImg" alt />
      </div>
      <div class="explain">
        <p class="name text" @click="targetUserInformationPage">{{name}}</p>
        <p class="text">{{about}}</p>
      </div>
      <div class="quit_box">
        <img src="../assets/imgs/quit.svg" @click="targetLoginPage" alt />
      </div>
    </div>
    <!-- 修改头像弹窗 -->
    <div class="alert_box">
      <el-dialog :visible.sync="dialogVisible" width="70%">
        <div class="modify_box">
          <div class="modify">
            <div class="header_modify" v-for="(img,i) in imgList" :key="i">
              <div class="img_box" ref="imgBox" @click="modifyHeader(i)">
                <div class="box">
                  <img :src="img" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right_box">
          <img class="right_btn" src="../assets/imgs/right.svg" @click="selectedHead" alt />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BackBtn from "../components/BackBtn";
import { modifyUserMsg } from "../api/user";

export default {
  name: "about",
  data() {
    const imgList = [];
    for (let i = 1; i < 9; i++) {
      imgList.push(require(`../assets/imgs/header/header${i}.jpg`));
    }
    return {
      headImg: "",
      dialogVisible: false,
      user: JSON.parse(localStorage.getItem("user")),
      isEditable: true,
      name: "",
      about: "",
      link: "auto",
      imgList,
      isSelected: false,
      i: ""
    };
  },
  components: {
    BackBtn
  },
  created() {
    if (!this.user) {
      this.$router.push({ name: "home" });
      return;
    }
    this.searchUserMsg();
  },
  methods: {
    targetLoginPage() {
      this.$router.push({ name: "login" });
      localStorage.removeItem("user");
      localStorage.removeItem("article");
    },
    searchUserMsg() {
      const otheruser = this.$route.params.user;
      let user = this.user;
      if (otheruser) {
        this.isEditable = false;
        user = otheruser;
      }
      this.name = user.name || "用户" + user.num;
      this.about = user.about || "...";
      this.headImg = require(`../assets/imgs/header/header${user.headId}.jpg`);
    },
    modifyHeader(i) {
      for (let j = 0; j < 8; j++) {
        this.$refs.imgBox[j].style.backgroundColor = "#333";
      }
      this.$refs.imgBox[i].style.backgroundColor = "#ccc";
      this.i = i;
    },
    selectedHead() {
      this.dialogVisible = false;
      this.headImg = require(`../assets/imgs/header/header${this.i + 1}.jpg`);
      modifyUserMsg({
        headId: this.i + 1,
        account: this.user.account
      });
      this.user.headId = this.i + 1;
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    targetUserInformationPage() {
      if (!this.isEditable) return;
      this.$router.push({ name: "userInformation" });
    }
  }
};
</script>

<style lang="stylus">
.about {
  padding-top: 200px;

  .headerbox, .alert_box {
    .headerbox_link {
      width: 80px;
      height: 80px;
      margin: auto;
      border-radius: 100%;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 96px;
        height: 80px;
        margin-left: -8px;
      }
    }
  }

  .headerbox {
    margin: auto;
    width: 400px;

    .explain {
      margin-top: 20px;
      text-align: center;

      .text {
        color: #8a8a8a;
        margin-bottom: 10px;
      }

      .name {
        cursor: pointer;
      }
    }

    .quit_box {
      margin: 30px;
      text-align: center;

      img {
        width: 30px;
        cursor: pointer;
      }
    }
  }

  .alert_box {
    .el-dialog {
      .el-dialog__header {
        background-color: #111 !important;
      }

      .el-dialog__body {
        background-color: #111 !important;
      }

      .modify_box {
        .modify {
          display: flex;
          flex-wrap: wrap;
          margin-top: 40px;
          border-radius: 5px;

          .header_modify {
            width: 25%;
            margin-bottom: 40px;

            .img_box {
              margin: auto;
              width: 70px;
              height: 70px;
              border-radius: 100%;
              overflow: hidden;
              background-color: #333;
              cursor: pointer;

              .box {
                margin: 5px auto;
                width: 60px;
                height: 60px;
                border-radius: 100%;
                overflow: hidden;
                text-align: center;

                img {
                  width: 72px;
                  height: 60px;
                }
              }
            }
          }
        }
      }

      .right_box {
        padding-bottom: 20px;

        .right_btn {
          float: right;
          width: 30px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
