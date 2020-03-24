<template>
  <div class="article">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headline">{{article.title}}</div>
      <div class="other">
        <router-link
          class="author"
          tag="span"
          :to="{name:'user',params: {articleList: article.articleList}}"
        >
          <i class="el-icon-user-solid"></i>
          {{article.author}}
        </router-link>
        <span class="time">
          <img src="../assets/imgs/time.svg" alt />
          {{article.time}}
        </span>
        <span>
          <img
            v-if="isLike"
            class="like"
            src="../assets/imgs/dianzan_selected.svg"
            @click="likeArticle"
            alt
          />
          <img v-else class="like" src="../assets/imgs/dianzan.svg" @click="likeArticle" alt />
          {{like_count}}
        </span>
        <span>
          <img
            v-if="isCollect"
            class="collect"
            src="../assets/imgs/mark_selected.svg"
            @click="collectArticle"
            alt
          />
          <img v-else class="like" src="../assets/imgs/mark.svg" @click="collectArticle" alt />
          {{collect_count}}
        </span>
        <i v-if="modifyBtn" class="el-icon-edit-outline" @click="editorArticle"></i>
        <i v-if="modifyBtn" class="el-icon-delete" @click="deletePrompt"></i>
      </div>
      <div class="content_box">
        <vue-scroll :ops="ops">
          <div class="content">
            <p class="sentence" v-for="(sentence,i) in sentenceList" :key="i">
              <span class="space"></span>
              {{sentence}}
            </p>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackBtn from "../components/BackBtn";

export default {
  name: "Article",
  components: { BackBtn },
  data() {
    return {
      article: {},
      sentenceList: [],
      user: JSON.parse(localStorage.getItem("user")),
      isLike: false,
      isCollect: false,
      like_count: 0,
      collect_count: 0,
      link: "auto",
      ops: {
        bar: {
          opacity: 0
        }
      }
    };
  },
  computed: {
    modifyBtn() {
      if (this.user && this.article.author === this.user.name) return true;
      return false;
    }
  },
  created() {
    this.searchArticle();
  },
  methods: {
    async searchArticle() {
      const article = await axios.get(
        "http://localhost:3000/getSingleArticle?articleId=" +
          this.$route.query.articleId
      );
      this.article = article;
      this.dealArticle(article.content);
      this.isLikeAndCollect(article);
    },
    isLikeAndCollect(data) {
      this.like_count = data.like.length;
      this.collect_count = data.collect.length;
      if (!this.user) return;
      const likeBool = data.like.indexOf(this.user.account);
      const collectBool = data.collect.indexOf(this.user.account);
      if (likeBool !== -1) this.isLike = true;
      if (collectBool !== -1) this.isCollect = true;
      localStorage.setItem(
        "islikeAndCollect",
        JSON.stringify({
          isLike: this.isLike,
          isCollect: this.isCollect
        })
      );
    },
    dealArticle(data) {
      const sentenceList = data.split(/\n/);
      sentenceList.forEach(item => {
        if (item) this.sentenceList.push(item);
      });
    },
    likeArticle() {
      if (this.targetLogin()) return;
      this.isLike = !this.isLike;
      this.isLike ? this.like_count++ : this.like_count--;
    },
    collectArticle() {
      if (this.targetLogin()) return;
      this.isCollect = !this.isCollect;
      this.isCollect ? this.collect_count++ : this.collect_count--;
    },
    deletePrompt() {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteArticle();
        })
        .catch(() => {
          this.$message("已取消");
        });
    },
    deleteArticle() {
      if (this.article.author != this.user.name) return;
      axios
        .post("http://localhost:3000/deleteArticle", {
          articleId: this.article.articleId
        })
        .then(res => {
          if (res) this.$message("删除成功");
          this.$router.go(-1);
        });
    },
    editorArticle() {
      this.$router.push({
        name: "addAriticle",
        query: { articleId: this.article.articleId }
      });
    },
    targetLogin() {
      if (!this.user) {
        this.$router.push({ name: "login" });
        this.$message("请先登录！");
        return true;
      }
      return false;
    }
  },
  destroyed() {
    if (!this.user) return;
    const { isLike, isCollect } = JSON.parse(
      localStorage.getItem("islikeAndCollect")
    );
    if (isLike !== this.isLike) {
      if (this.isLike) {
        axios.post("http://localhost:3000/likeArticle", {
          type: true,
          account: this.user.account,
          articleId: this.article.articleId
        });
      } else {
        axios.post("http://localhost:3000/likeArticle", {
          type: false,
          account: this.user.account,
          articleId: this.article.articleId
        });
      }
    }
    if (isCollect !== this.isCollect) {
      if (this.isCollect) {
        axios.post("http://localhost:3000/collectArticle", {
          type: true,
          account: this.user.account,
          articleId: this.article.articleId
        });
      } else {
        axios.post("http://localhost:3000/collectArticle", {
          type: false,
          account: this.user.account,
          articleId: this.article.articleId
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.article {
  height: 100%;

  .container {
    width: 1000px;
    height: 100%;
    margin: auto;
    color: #8a8a8a;

    .headline {
      margin-top: 40px;
      text-align: center;
      font-size: 40px;
    }

    .other {
      margin-top: 20px;
      color: #555;
      text-align: center;

      > span {
        margin-right: 20px;

        i {
          font-size: 18px;
        }

        img {
          width: 18px;
          height: 18px;
          vertical-align: top;
        }

        .like, .collect {
          cursor: pointer;
        }
      }

      span.author {
        cursor: pointer;

        &:hover {
          color: #ccc;
        }
      }

      span:nth-of-type(2) {
        img {
          margin-top: 2px;
        }
      }

      span:nth-of-type(5) {
        img {
          width: 19px;
          height: 20px;
          cursor: pointer;
        }
      }

      i {
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;

        &:hover {
          color: #ccc;
        }
      }

      .el-icon-edit-outline {
        margin-right: 20px;
      }
    }

    .content_box {
      height: 73%;
      margin-top: 20px;
      font-size: 20px;
      line-height: 30px;

      .content {
        .sentence {
          width: 1000px;

          .space {
            padding-left: 40px;
          }
        }
      }
    }
  }
}
</style>
