<template>
  <div class="ariticleList">
    <div class="hint" v-if="!_articles.length">暂无</div>
    <div class="ariticle" v-for="(article,i) in _articles" :key="i">
      <p class="article_title" @click="toArticle(i)">{{article.title}}</p>
      <p class="article_other">
        <span class="author" @click="targetUser(article.articleList)">
          <i class="el-icon-user-solid"></i>
          {{article.author}}
        </span>
        <span>
          <img src="../assets/imgs/time.svg" alt />
          {{new Date(article.time).toLocaleDateString()}}
        </span>
        <span>
          <img src="../assets/imgs/dianzan.svg" alt />
          {{article.like | like_count}}
        </span>
        <span>
          <img src="../assets/imgs/mark.svg" alt />
          {{article.collect | collect_count}}
        </span>
      </p>
      <p class="article_content">{{article.content}}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ariticleList",
  props: ["articleType", "articleList"],
  watch: {
    articleType() {
      this.getMsgJudgment();
    },
    articleList() {
      this.getPersonalArticle();
    }
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      articles: [],
      like_count: 0,
      collect_count: 0
    };
  },
  computed: {
    _articles() {
      let articles = this.articles;
      return articles.sort((a, b) => b.num - a.num);
    }
  },
  filters: {
    like_count(like) {
      return like.length;
    },
    collect_count(collect) {
      return collect.length;
    }
  },
  created() {
    this.getMsgJudgment();
  },
  mounted() {},
  methods: {
    getMsgJudgment() {
      if (this.articleType === "home") this.getallArticle();
      else if (this.articleType === "collect") this.getCollectArticle();
      else this.getPersonalArticle();
    },
    async getPersonalArticle() {
      // 获取用户的文章信息
      if (this.articleList) {
        let result = await axios.get(
          "http://localhost:3000/getUserAllArticles?articleList=" +
            this.articleList
        );
        this.articles = result;
      }
    },
    async getallArticle() {
      // 获取所有用户的文章信息
      let result = await axios.get("http://localhost:3000/getAllArticles");
      this.articles = result;
    },
    async getCollectArticle() {
      // 获取用户收集文章信息
      let result = await axios.post(
        "http://localhost:3000/getCollectArticles",
        {
          account: this.user.account
        }
      );
      this.articles = result;
    },
    targetUser(articleList) {
      if (this.$route.name === "home") {
        this.$router.push({ name: "user", params: { articleList } });
        return;
      }
      this.$emit("targetUser", articleList);
      localStorage.setItem("provisionalUser", JSON.stringify(articleList));
    },
    toArticle(i) {
      this.$router.push({
        name: "article",
        query: {
          articleId: this.articles[i].articleId,
          personal: this.isShowAdd
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.ariticleList {
  .hint {
    text-align: center;
  }

  .ariticle {
    position: relative;
    width: 694px;
    padding: 10px 50px 40px;
    margin-bottom: 30px;
    background-color: #111;
    border-radius: 10px;
    text-align: center;

    .article_title {
      width: 696px;
      margin: auto;
      overflow: hidden;
      margin-bottom: 15px;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: #aaa;
      }
    }

    .article_other {
      margin-bottom: 15px;
      color: #555;

      span {
        img {
          width: 18px;
          height: 18px;
          vertical-align: top;
        }
      }

      span.author {
        cursor: pointer;

        &:hover {
          color: #8a8a8a;
        }
      }

      span:nth-of-type(2) {
        img {
          margin-top: 2px;
        }
      }

      span:not(:nth-of-type(4)) {
        margin-right: 20px;
      }
    }

    .article_content {
      width: 696px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: left;

      .content_space {
        display: inline-block;
        width: 25px;
      }
    }
  }
}
</style>
