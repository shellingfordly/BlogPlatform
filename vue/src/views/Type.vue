<template>
  <div class="type">
    <BackBtn :link="link"></BackBtn>
    <div class="container">
      <div class="headerbox">
        <the-time />
        <div class="type box">
          <i class="el-icon-collection-tag"></i>
          {{type.type}}
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
export default {
  name: "ArticleType",
  data() {
    return {
      articleList: [],
      type: { page: "type", type: this.$route.params.id },
      link: "auto"
    };
  },
  components: {
    BackBtn,
    TheTime,
    AriticleList
  }
};
</script>

<style lang="stylus">
@import '../assets/css/iconfont.css';
@import '../assets/css/common.styl';

.type {
}
</style>