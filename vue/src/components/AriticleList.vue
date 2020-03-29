<template>
  <div class="ariticleList">
    <vue-scroll :ops="ops">
      <div class="ariticleList">
        <div class="hint" v-if="!showArticles.length">{{cue}}</div>
        <div class="ariticle" v-for="(article,i) in showArticles" :key="i">
          <p class="article_title" @click="targetArticlePage(i)">{{article.title}}</p>
          <p class="article_other">
            <span class="author" @click="targetOtherUser(article.articleList)">
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
          <div class="article_content">{{article.content}}</div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import { getAllArticles, getTypeArticles } from "../api/article";

export default {
  name: "ariticleList",
  props: ["type"],
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      showArticles: [],
      cue: "暂无文章发布",
      ops: {
        bar: {
          opacity: 0
        }
      }
    };
  },
  filters: {
    like_count(like) {
      return like.length;
    },
    collect_count(collect) {
      return collect.length;
    }
  },
  computed: {
    _articles() {
      let articles = this.articles;
      return articles.sort((a, b) => b.num - a.num);
    }
  },
  created() {
    this.initialArticleList();
    console.log(this.type);
  },
  mounted() {},
  methods: {
    async initialArticleList() {
      const { page, type } = this.type;
      let articleList = "";
      if (page === "home") {
        // 获取所有作者的文章
        articleList = await getAllArticles();
        this.cue = "暂无文章发布";
      } else {
        articleList = await getTypeArticles(type);
        this.cue = "暂无该类型文章发布";
      }
      this.showArticles = articleList.sort((a, b) => b.num - a.num);
    },
    // 跳转文章浏览页面
    targetArticlePage(i) {
      this.$router.push({
        name: "article",
        query: {
          articleId: this.showArticles[i].articleId
        }
      });
    },
    // 切换到其他文章作者信息
    targetOtherUser(articleList) {
      if (this.user && articleList === this.user.articleList) {
        this.$router.push({ name: "user" });
      } else this.$router.push({ name: "otherUser", params: { articleList } });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/css/articlelist.styl';

.ariticleList {
}
</style>
