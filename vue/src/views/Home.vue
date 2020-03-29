<template>
  <div class="home">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headerbox">
        <the-time />
        <div class="headerbox-sentence box">
          <p class="sentence">{{sentence}}</p>
        </div>
        <div class="headerbox-mid box">
          <div class="iconBtn_box" @click="targetUserPage">
            <i class="el-icon-user"></i>
            <span class="prompt">{{ user ? user.name :"点击登录/注册" }}</span>
          </div>
        </div>
        <div class="headerbox-bot box" v-show="typeList.length">
          <router-link
            class="type"
            tag="span"
            :to="'/type/'+type"
            v-for="(type,i) in typeList"
            :key="i"
          >{{type}}</router-link>
        </div>
      </div>
      <div class="content">
        <AriticleList :type="type" />
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from "../components/BackBtn";
import TheTime from "../components/TheTime";
import AriticleList from "../components/AriticleList";
import { getEverydaySentence } from "../api/other";
import { getAllType } from "../api/article";

export default {
  name: "home",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      showArticles: [],
      type: { page: "home", type: "" },
      link: "initial",
      sentence: "",
      typeList: []
    };
  },
  components: {
    BackBtn,
    TheTime,
    AriticleList
  },
  created() {
    this.initialHomePage();
  },
  methods: {
    // 获取每日一句
    async initialHomePage() {
      this.typeList = await getAllType();
      let result = await getEverydaySentence();
      let arr = result.match(/[\u4e00-\u9fa5]+/g);
      this.sentence = arr[0] + "，" + arr[1];
    },
    // 跳转到用户个人页面/或者登录页面
    targetUserPage() {
      let name = "user";
      if (!this.user) name = "login";
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/css/iconfont.css';
@import '../assets/css/common.styl';

.home {
  .container {
    .headerbox {
      .headerbox-sentence {
        padding: 10px 20px;

        .sentence {
          height: 28px;
          margin: 0;
          text-indent: 30px;
          line-height: 28px;
        }
      }

      .headerbox-mid {
        padding: 15px 20px;

        .iconBtn_box {
          padding-left: 30px;
          cursor: pointer;

          &:hover {
            color: #666;
          }

          span {
            font-size: 20px;
          }

          .el-icon-user {
            font-size: 20px;
          }

          .prompt {
            margin-left: 20px;
            font-size: 14px;
          }
        }
      }

      .headerbox-bot {
        .type {
          margin-right: 5px;
          cursor: pointer;

          &:hover {
            color: #666;
          }
        }
      }
    }
  }
}
</style>
