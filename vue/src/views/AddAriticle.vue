<template>
  <div class="addAriticle">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headline_box">
        <input class="headline" type="text" v-model="article.title" />
      </div>

      <div class="btn_box">
        <span class="iconfont markdown" @click="shiftMarkdown">&#xe838;</span>
        <img src="../assets/imgs/update.svg" @click="submitArticle" title="上传" alt />
        <img src="../assets/imgs/save.svg" @click="saveArticle" title="保存" alt />
        <img src="../assets/imgs/fanhui.svg" @click="backHome" title="取消" alt />
      </div>

      <div class="content_box">
        <Markdown v-if="isMarkdown" v-model="article.content" />
        <textarea v-else class="content" v-model="article.content"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import Markdown from "vue-meditor";
import BackBtn from "../components/BackBtn";
import { addArticle, modifyArticle } from "../api/article";

export default {
  name: "AddAriticle",
  components: {
    BackBtn,
    Markdown
  },
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      article: {
        title: "",
        content: "",
        articleList: user.account,
        author: user.name
      },
      isMarkdown: false,
      link: "user"
    };
  },
  created() {
    let article = JSON.parse(localStorage.getItem("article"));
    article &&
      Object.keys(article).forEach(key => {
        this.article[key] = article[key];
      });
    this.articleInitial();
  },
  methods: {
    async articleInitial() {
      const { article } = this.$route.params;
      if (article) {
        this.article.title = article.title;
        this.article.content = article.content;
      }
    },
    backHome() {
      this.$confirm("确定退出吗？是否保存文章", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saveArticle();
        })
        .catch(() => {
          this.$router.push({ name: "user" });
        });
    },
    async submitArticle() {
      const { article } = this.$route.params;
      let res = null;
      if (article) {
        res = await modifyArticle(article.articleId, this.article);
      } else {
        res = await addArticle(this.article);
      }
      if (res) {
        this.$message(res);
        this.$router.push({ name: "user" });
      }
    },
    saveArticle() {
      let article = this.article;
      localStorage.setItem(
        "article",
        JSON.stringify({
          title: article.title,
          content: article.content
        })
      );
      this.$message("保存成功");
      this.$router.push({ name: "user" });
    },
    shiftMarkdown() {
      this.isMarkdown = !this.isMarkdown;
    }
  }
};
</script>

<style lang="stylus" scoped>
.addAriticle {
  width: 100%;
  height: 100%;

  .container {
    width: 1000px;
    height: 100%;
    margin: auto;

    .headline_box {
      width: 100%;
      padding-top: 40px;
      margin: auto;

      .headline {
        width: 100%;
        height: 70px;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #111;
        border-radius: 10px;
        border: 0;
        outline: 0;
        color: #8a8a8a;
        font-size: 40px;
        line-height: 70px;
      }
    }

    .content_box {
      width: 100%;
      height: 1000px;
      margin: 20px auto 50px;
      background-color: #111;
      border-radius: 10px;
      overflow: hidden;

      /deep/ .markdown {
        height: 100% !important;
        background-color: #111;
        border: 0 !important;

        .markdown-toolbars {
          background-color: #111;
          border-bottom: 1px solid #222;
        }

        .markdown-content {
          .markdown-theme-light {
            // display: none;
          }
        }
      }

      .content {
        width: 980px;
        padding: 15px 10px;
        height: 100%;
        resize: none;
        background-color: #111;
        border: 0;
        font-size: 30px;
        line-height: 40px;
        color: #8a8a8a;
        outline: 0;

        /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
        &::-webkit-scrollbar {
          width: 5px;
          height: 10px;
          background-color: #8a8a8a;
        }

        /* 定义滚动条轨道 内阴影+圆角 */
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          border-radius: 2px;
          background-color: #222;
        }

        /* 定义滑块 内阴影+圆角 */
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #8a8a8a;
        }
      }
    }

    .btn_box {
      margin-top: 20px;
      text-align: right;

      span {
        color: #333;
        font-size: 30px;
        vertical-align: middle;
        cursor: pointer;
      }

      img {
        width: 30px;
        height: 30px;
        margin-left: 30px;
        color: #222;
        cursor: pointer;
        vertical-align: middle;
      }
    }
  }
}
</style>
