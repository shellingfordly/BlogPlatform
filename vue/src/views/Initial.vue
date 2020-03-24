<template>
  <div class="initial">
    <canvas id="initial_3d_bg">您的浏览器不支持 HTML5 canvas 标签。</canvas>
    <div
      class="home_link"
      @click="searchUserMsg"
      @mouseenter="moveEffect"
      @mouseleave="leaveEffect"
    >
      <img :src="headImg" alt />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "../assets/js/html5_3d_animation.js";
import anime from "animejs";

export default {
  name: "initial",
  components: {},
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    let headImg = "";
    headImg = require(`../assets/imgs/header/header${
      user ? user.headId : 1
    }.jpg`);
    return { headImg };
  },
  mounted() {
    $("#initial_3d_bg").html5_3d_animation({
      window_width: window.document.body.offsetWidth,
      window_height: window.screen.availHeight,
      window_background: "Mulletized",
      star_count: "200",
      star_color: "#fff",
      star_depth: "200"
    });
  },
  methods: {
    searchUserMsg() {
      this.$router.push("home");
    },
    moveEffect() {
      anime({
        targets: ".initial .home_link",
        rotate: {
          value: 360,
          duration: 1800,
          easing: "easeInOutSine"
        }
      });
    },
    leaveEffect() {
      anime({
        targets: ".initial .home_link",
        rotate: {
          value: 0,
          duration: 1800,
          easing: "easeInOutSine"
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.initial {
  display: flex;
  align-items: center;
  justify-content: center;

  .home_link {
    position: absolute;
    margin-top: -40px;
    width: 80px;
    height: 80px;
    z-index: 100;
    cursor: pointer;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 96px;
      height: 80px;
      margin-left: -8px;
    }
  }
}
</style>
