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
              <span class="name" @click="targetAbout">{{otherUser.name || "用户"+otherUser.num}}</span>
              <i
                class="like_user"
                :class="isLikeUser ? 'el-icon-message-solid' : 'el-icon-bell'"
                @click="likeUser"
              ></i>
            </p>
            <p class="sub-title">{{otherUser.signature || "暂无签名"}}</p>
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
            <div class="hint" v-if="!showArticles.length">暂无文章</div>
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
import {
  setLikeUser,
  getUserMeg,
  getUserAllArticles,
  getCollectArticle
} from "../api/user";

export default {
  name: "user",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      user,
      otherUser: {},
      isLikeUser: false,
      headImg: "",
      articleList: this.$route.params.articleList || "",
      likeUsers: [],
      showArticles: [],
      ownArticles: [],
      collectArticles: [],
      fans: [],
      isShowFollower: false,
      isShowFans: false,
      isShowArticle: true,
      isShowCollect: false,
      link: "auto",
      ops: {
        bar: {
          opacity: 0
        }
      },
      // 关注作者
      likeUser: this.$store.state.throttle(async () => {
        if (!this.user) {
          this.$message("关注作者需登录。");
          this.$router.push({ name: "login" });
          return;
        }
        this.isLikeUser = !this.isLikeUser;
        let result = await setLikeUser(
          this.user.account,
          this.articleList,
          this.isLikeUser
        );
        localStorage.setItem("user", JSON.stringify(result));
        // 更新当前被关注作者otherUser的fans
        const otherUser = await getUserMeg(this.articleList);
        // 粉丝
        this.fans = otherUser.follow;
      }, 3000)
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
      if (this.otherUser.other) {
        const { weibo, boke, github, bilibili } = this.otherUser.other;
        if (weibo && boke && github && bilibili) return true;
      }
      return false;
    }
  },
  components: {
    BackBtn,
    TheTime
  },
  created() {
    this.initialAllMsg(this.articleList);
  },
  methods: {
    async initialAllMsg(articleList) {
      // 保存作者信息，确保刷新页面不出错
      if (articleList) localStorage.setItem("otherUserAccount", articleList);
      const otherUserAccount = localStorage.getItem("otherUserAccount");
      if (otherUserAccount) articleList = this.articleList = otherUserAccount;
      if (!articleList) {
        this.$router.push({ name: "home" });
        return;
      }
      const otherUser = await getUserMeg(articleList);
      this.otherUser = otherUser;
      // 粉丝
      this.fans = otherUser.follow;
      // 修改头像
      this.headImg = require(`../assets/imgs/header/header${otherUser.headId}.jpg`);
      // 查询文章
      let articles = await getUserAllArticles(otherUser.articleList);
      this.showArticles = this.ownArticles = articles.sort(
        (a, b) => b.num - a.num
      );
      this.judgeLikeUser();
    },
    // 判断是否关注作者
    judgeLikeUser() {
      if (!this.user || !this.user.likeUser.length) return;
      const likeUserBool = this.user.likeUser.findIndex(
        item => item.account == this.articleList
      );
      // 如果查到有此作者,显示关注;若没有,显示未关注
      // 若不else将其设置未false,则在看其他作者时,
      // 若其他其他作者关注了此人,则切换之后this.isLikeUser依然为true
      if (likeUserBool !== -1) this.isLikeUser = true;
      else this.isLikeUser = false;
    },
    // 跳转作者详细信息页面
    targetAbout() {
      this.$router.push({ name: "about" });
    },
    // 展示作者的所有文章
    myselfArticle() {
      this.closeAll();
      this.isShowArticle = true;
      if (this.showArticles === this.ownArticles) return;
      this.showArticles = this.ownArticles;
    },
    // 跳转到其他页面
    targetOtherPage(type) {
      let link = "";
      let other = this.otherUser.other;
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
      this.closeAll();
      this.isShowArticle = true;
      if (articleList === this.articleList) return;
      this.initialAllMsg(articleList);
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
      let articles = await getCollectArticle(this.otherUser.account);
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
      this.likeUsers = this.otherUser.likeUser;
      this.closeAll();
      this.isShowFollower = true;
    },

    // 关闭所有
    closeAll() {
      this.isShowFollower = false;
      this.isShowFans = false;
      this.isShowArticle = false;
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
@import '../assets/css/common.styl';
@import '../assets/css/user.styl';
@import '../assets/css/articlelist.styl';
</style>
