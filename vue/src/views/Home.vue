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
      </div>
      <div class="content">
        <vue-scroll :ops="ops">
          <div class="ariticleList">
            <div class="hint" v-if="!showArticles.length">暂无文章发布</div>
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
                  <!-- {{like_count(article.like)}} -->
                </span>
                <span>
                  <img src="../assets/imgs/mark.svg" alt />
                  {{article.collect | collect_count}}
                  <!-- {{collect_count(article.collect )}} -->
                </span>
              </p>
              <!-- <div class="article_content" v-html="content(article.content)"></div> -->
              <div class="article_content">{{article.content}}</div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from "../components/BackBtn";
import TheTime from "../components/TheTime";
import { getAllArticles } from "../api/article";
import { getEverydaySentence } from "../api/other";

export default {
  name: "home",
  data() {
    return {
      articleType: "home",
      user: JSON.parse(localStorage.getItem("user")),
      showArticles: [],
      ops: {
        bar: {
          opacity: 0
        }
      },
      link: "initial",
      sentence: ""
    };
  },
  components: {
    BackBtn,
    TheTime
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
    content() {
      return function(content) {
        return this.marked(content);
      };
    }
  },
  created() {
    this.initialHomePage();
  },
  methods: {
    async initialHomePage() {
      // 获取所有作者的文章
      const articles = await getAllArticles();
      this.showArticles = articles.sort((a, b) => b.num - a.num);
      this.everydaySentence();
    },
    // 获取每日一句
    async everydaySentence() {
      let result = await getEverydaySentence();
      let arr = result.match(/[\u4e00-\u9fa5]+/g);
      this.sentence = arr[0] + "，" + arr[1];
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
@import '../assets/css/home.styl';
@import '../assets/css/articlelist.styl';

.home {
  .container {
    .headerbox {
      .headerbox-sentence {
        padding: 10px 20px;

        .sentence {
          height: 28px;
          padding-left: 30px;
          line-height: 28px;
          cursor: pointer;

          &:hover {
            color: #666;
          }
        }
      }

      .headerbox-mid {
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
            // color: #555;
          }
        }
      }
    }
  }
}
</style>
