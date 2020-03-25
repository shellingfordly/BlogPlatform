<template>
  <div class="user">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headerbox">
        <the-time />
        <div class="headerbox-top box clearfix">
          <div class="headerbox_link" @click="myselfArticle">
            <img :src="headImg" alt />
          </div>
          <div class="explain">
            <p class="title">
              <span class="name" @click="targetAbout">{{name || "用户0"}}</span>
            </p>
            <p class="sub-title">{{signature || "暂无签名"}}</p>
          </div>
        </div>

        <div class="headerbox-bot box">
          <div class="iconbox flexbox">
            <div class="iconBtn_box">
              <router-link class="iconfont icon-shouye" tag="span" to="/home"></router-link>
            </div>
            <div class="iconBtn_box">
              <span class="iconfont icon-chakantieziguanzhu" @click="showFollower"></span>
            </div>
            <div class="iconBtn_box">
              <span class="iconfont icon-shoucang" @click="showCollect"></span>
            </div>
            <div class="iconBtn_box">
              <span class="iconfont icon-fensiguanli" @click="showFans"></span>
            </div>
          </div>
          <div v-if="other" class="aboutotherbox flexbox">
            <div class="iconBtn_box">
              <span @click="targetOtherPage('weibo')" class="iconfont icon-weibo"></span>
            </div>
            <div class="iconBtn_box">
              <span @click="targetOtherPage('boke')" class="iconfont icon-bokeyuan"></span>
            </div>
            <div class="iconBtn_box">
              <span @click="targetOtherPage('github')" class="iconfont icon-github"></span>
            </div>
            <div class="iconBtn_box">
              <span @click="targetOtherPage('bilibili')" class="iconfont icon-CN_bilibiliB"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <router-link
          v-if="isAddArticle"
          class="add_ariticle content_title"
          tag="div"
          to="/addAriticle"
        >
          <i class="el-icon-plus"></i>
        </router-link>
        <vue-scroll :ops="ops">
          <!-- 关注 -->
          <div class="follower_box" v-if="isShowFollower">
            <p class="content_title">关注</p>
            <div class="followers" v-if="likeUsers.length">
              <div class="follow" v-for="(user,i) in likeUsers" :key="i">
                <p class="follow_name" @click="targetOtherUser(user.account)">{{user.name}}</p>
              </div>
            </div>
            <div class="hint" v-else>暂无关注对象</div>
          </div>
          <!-- 关注者 -->
          <div class="fans_box" v-if="isShowFans">
            <p class="content_title">关注者</p>
            <div class="fans" v-if="fans.length">
              <div class="fan" v-for="(fan,i) in fans" :key="i">
                <p class="fan_name" @click="targetOtherUser(fan.account)">{{fan.name}}</p>
              </div>
            </div>
            <div class="hint" v-else>暂无关注者</div>
          </div>
          <!-- 文章 -->
          <div class="ariticleList" v-if="isShowArticle">
            <p class="content_title" v-if="isShowCollect">收藏文章</p>
            <div class="hint" v-if="!showArticles.length">{{isShowCollect?"未收藏文章":"未发布文章"}}</div>
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
              <p class="article_content">{{article.content}}</p>
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
import { getUserAllArticles, getCollectArticle } from "../api/user";

export default {
  name: "user",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    const headImg = require(`../assets/imgs/header/header${
      user ? user.headId : 1
    }.jpg`);
    return {
      user,
      likeUsers: [],
      fans: [],
      showArticles: [],
      ownArticles: [],
      collectArticles: [],
      headImg,
      isAddArticle: true,
      isShowFollower: false,
      isShowFans: false,
      isShowArticle: true,
      isShowCollect: false,
      link: "home",
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
    other() {
      const { weibo, boke, github, bilibili } = this.user.other;
      if (weibo && boke && github && bilibili) return true;
      return false;
    },
    name() {
      return this.user ? this.user.name : "";
    },
    signature() {
      return this.user ? this.user.signature : "";
    }
  },
  components: {
    BackBtn,
    TheTime
  },
  created() {
    this.initialAllMsg();
  },
  methods: {
    async initialAllMsg() {
      const user = this.user;
      if (!user) {
        this.$router.push({ name: "home" });
        return;
      }
      // 查询文章
      let articles = await getUserAllArticles(this.user.articleList);
      this.showArticles = this.ownArticles = articles.sort(
        (a, b) => b.num - a.num
      );
      // 关注的人
      this.likeUsers = user.likeUser;
      // 粉丝
      this.fans = user.follow;
    },
    // 跳转作者详细信息页面
    targetAbout() {
      this.$router.push({ name: "about" });
    },
    // 展示作者的所有文章
    myselfArticle() {
      this.closeAll();
      this.isAddArticle = true;
      this.isShowArticle = true;
      this.showArticles === this.ownArticles ||
        (this.showArticles = this.ownArticles);
    },
    // 跳转到其他页面
    targetOtherPage(type) {
      let link = "";
      let other = this.user.other;
      switch (type) {
        case "weibo":
          link = other.weibo;
          break;
        case "boke":
          link = other.boke;
          break;
        case "github":
          link = other.github;
          break;
        case "bilibili":
          link = other.bilibili;
          break;
        default:
          link = "user";
          break;
      }
      window.open(link);
    },
    // 切换到其他文章作者信息
    targetOtherUser(articleList) {
      if (articleList === this.user.articleList) return;
      this.$router.push({ name: "otherUser", params: { articleList } });
    },
    // 跳转到文章页面
    targetArticlePage(i) {
      this.$router.push({
        name: "article",
        query: {
          articleId: this.showArticles[i].articleId
        }
      });
    },
    // 展示作者收藏的文章
    async showCollect() {
      this.closeAll();
      this.isShowArticle = true;
      this.isShowCollect = true;
      let articles = await getCollectArticle(this.user.account);
      this.showArticles = this.collectArticles = articles.sort(
        (a, b) => b.num - a.num
      );
    },
    // 展示作者的粉丝
    showFans() {
      this.closeAll();
      this.isShowFans = true;
    },
    // 展示作者关注的人
    showFollower() {
      this.closeAll();
      this.isShowFollower = true;
    },
    // 关闭所有
    closeAll() {
      this.isShowFollower = false;
      this.isShowFans = false;
      this.isShowArticle = false;
      this.isAddArticle = false;
      this.isShowCollect = false;
    }
  },
  destroyed() {
    localStorage.removeItem("provisionalUser");
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/css/iconfont.css';
@import '../assets/css/home.styl';
@import '../assets/css/user.styl';
@import '../assets/css/articlelist.styl';

.user {
  .container {
    .content {
      height: 85%;

      .content_title {
        margin-top: 30px;
      }
    }
  }
}
</style>
