<template>
  <div class="article">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headline">{{article.title}}</div>
      <div class="other">
        <!-- 作者 -->
        <span class="author" @click="targetOtherUser(article.articleList)">
          <i class="el-icon-user-solid"></i>
          {{article.author || "author"}}
        </span>
        <!-- 发布时间 -->
        <span class="time">
          <img src="../assets/imgs/time.svg" alt />
          {{article.time || "2020-02-02 02:20:20"}}
        </span>
        <!-- 点赞数 -->
        <span>
          <img
            v-if="isLike"
            class="like"
            src="../assets/imgs/dianzan_selected.svg"
            @click="likeArticle"
            alt
          />
          <img v-else class="like" src="../assets/imgs/dianzan.svg" @click="likeArticle" alt />
          {{like_count || 0}}
          <!-- {{ article.like |like_count}} -->
        </span>
        <!-- 收藏数 -->
        <span>
          <img
            v-if="isCollect"
            class="collect"
            src="../assets/imgs/mark_selected.svg"
            @click="collectArticle"
            alt
          />
          <img v-else class="like" src="../assets/imgs/mark.svg" @click="collectArticle" alt />
          {{collect_count || 0}}
          <!-- {{article.collect |collect_count}} -->
        </span>
        <!-- 编辑文章 -->
        <i v-if="modifyBtn" class="el-icon-edit-outline" @click="editorArticle"></i>
        <!-- 删除文章 -->
        <i v-if="modifyBtn" class="el-icon-delete" @click="deletePrompt"></i>
      </div>
      <div class="content_box">
        <div class="content" v-html="contentHtml"></div>
      </div>
    </div>
    <vueToTop type="10" color="#333" size="40" top="700" bottom="80" right="100"></vueToTop>
  </div>
</template>

<script>
import BackBtn from "../components/BackBtn";
import vueToTop from "vue-totop";
import {
  getSingleArticle,
  deleteArticle,
  likeArticle,
  collectArticle
} from "../api/article";

export default {
  name: "Article",
  components: { BackBtn, vueToTop },
  data() {
    const throttle = this.$store.state.throttle; // 函数节流
    return {
      article: {},
      sentenceList: [],
      contentHtml: "",
      isShowTargetTopBtn: false,
      user: JSON.parse(localStorage.getItem("user")),
      isLike: false,
      isCollect: false,
      like_count: 0,
      collect_count: 0,
      link: "auto",
      likeArticle: throttle(() => {
        if (this.targetLogin()) return;
        this.isLike = !this.isLike;
        this.isLike ? this.like_count++ : this.like_count--;
        likeArticle(this.isLike, this.user.account, this.article.articleId);
      }, 3000),
      collectArticle: throttle(() => {
        if (this.targetLogin()) return;
        this.isCollect = !this.isCollect;
        this.isCollect ? this.collect_count++ : this.collect_count--;
        collectArticle(
          this.isCollect,
          this.user.account,
          this.article.articleId
        );
      }, 3000)
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
  mounted() {
    window.addEventListener("scroll", this.getScrollPosition, false);
  },
  methods: {
    async searchArticle() {
      const article = await getSingleArticle(this.$route.query.articleId);
      this.article = article;
      // 使用marked解析v-html的内容
      this.contentHtml = this.marked(article.content);
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
    // 删除文章
    deleteArticle() {
      if (this.article.author != this.user.name) return;
      const result = deleteArticle(this.article.articleId);
      if (result) this.$message("删除成功");
      this.$router.go(-1);
    },
    editorArticle() {
      this.$router.push({
        name: "addAriticle",
        params: {
          article: this.article
        }
      });
    },
    targetLogin() {
      if (!this.user) {
        this.$router.push({ name: "login" });
        this.$message("请先登录！");
        return true;
      }
      return false;
    },
    targetOtherUser(articleList) {
      if (this.user && articleList === this.user.articleList) {
        this.$router.push({ name: "user" });
      } else this.$router.push({ name: "otherUser", params: { articleList } });
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
      padding-top: 40px;
      height: 52px;
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
      margin-top: 40px;
      font-size: 20px;
      line-height: 30px;

      .content {
        width: 900px;
        margin: auto;
      }
    }
  }

  .targetTop {
    position: fixed;
    bottom: 80px;
    right: 100px;
    width: 40px;
    height: 40px;
    border-radius: 18px;
    background-color: #222;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    color: #8a8a8a;
  }
}
</style>
