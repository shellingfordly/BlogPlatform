<template>
  <div class="addAriticle">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headline_box">
        <input class="headline" type="text" v-model="article.title" />
      </div>

      <div class="content_box">
        <textarea class="content" v-model="article.content"></textarea>
      </div>

      <div class="btn_box">
        <img src="../assets/imgs/update.svg" @click="submitArticle" title="上传" alt />
        <img src="../assets/imgs/save.svg" @click="saveArticle" title="保存" alt />
        <img src="../assets/imgs/fanhui.svg" @click="backHome" title="取消" alt />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackBtn from "../components/BackBtn";

export default {
  name: "AddAriticle",
  components: {
    BackBtn
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
      link: "user"
    };
  },
  created() {
    let article = JSON.parse(localStorage.getItem("article"));
    if (article) this.article = article;
    this.articleInitial();
  },
  methods: {
    async articleInitial() {
      if (this.$route.query.articleId) {
        const result = await axios.get(
          "http://localhost:3000/getSingleArticle?articleId=" +
            this.$route.query.articleId
        );
        this.article.title = result.title;
        this.article.content = result.content;
        this.link = { name: "article", articleId: this.$route.query.articleId };
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
    submitArticle() {
      axios.post("http://localhost:3000/addArticle", this.article).then(res => {
        if (res) {
          this.$message("发表成功");
          localStorage.removeItem("article");
          this.$router.push({ name: "user" });
        }
      });
    },
    saveArticle() {
      localStorage.setItem("article", JSON.stringify(this.article));
      this.$message("保存成功");
      this.$router.push({ name: "user" });
    }
  }
};
</script>

<style lang="stylus" scoped>
.addAriticle {
  height: 100%;

  .container {
    width: 1200px;
    height: 100%;
    margin: auto;

    .headline_box {
      width: 800px;
      margin: 40px auto 0;

      .headline {
        width: 780px;
        height: 70px;
        padding: 0 10px;
        background-color: #222;
        border-radius: 10px;
        border: 0;
        outline: 0;
        color: #8a8a8a;
        font-size: 40px;
        line-height: 70px;
      }
    }

    .content_box {
      width: 800px;
      height: 65%;
      margin: 40px auto 0;
      background-color: #222;
      border-radius: 10px;
      overflow: hidden;

      .content {
        width: 780px;
        padding: 10px;
        height: 99%;
        resize: none;
        background-color: #222;
        border: 0;
        font-size: 30px;
        line-height: 40px;
        color: #8a8a8a;
        outline: 0;

        /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
        &::-webkit-scrollbar {
          width: 10px;
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
      text-align: center;

      img {
        width: 40px;
        height: 40px;
        color: #222;
        cursor: pointer;
      }

      img:not(:nth-child(3)) {
        margin-right: 30px;
      }
    }
  }
}
</style>
