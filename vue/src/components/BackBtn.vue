<template>
  <div class="back_btn">
    <div class="rope">
      <div class="ball" @mouseenter="moveEffect" @mouseleave="leaveEffect" @click="goBack">
        <i class="el-icon-s-opportunity"></i>
      </div>
    </div>
  </div>
</template>

<script>
import anime from "animejs";

export default {
  name: "back_btn",
  props: ["link"],
  methods: {
    moveEffect() {
      anime({
        targets: ".home .back_btn .rope",
        translateY: 20
      });
    },
    mounted() {
      console.log(this.link);
    },
    leaveEffect() {
      anime({
        targets: ".home .back_btn .rope",
        translateY: 0
      });
    },

    goBack() {
      if (this.link === "auto") {
        this.$router.go(-1);
        return;
      } else if (typeof this.link == "string") {
        this.$router.push({ name: this.link });
        return;
      }

      if (this.link.personal) {
        this.$router.push({
          name: this.link.name,
          query: { personal: true }
        });
      } else {
        this.$router.push({
          name: this.link.name,
          query: { articleId: this.link.articleId }
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.back_btn {
  position: absolute;
  top: -20px;
  left: 80px;

  .rope {
    position: relative;
    top: 0;
    width: 3px;
    height: 100px;
    background-color: #222;

    .ball {
      position: absolute;
      left: -20px;
      bottom: -35px;
      border-radius: 100%;
      cursor: pointer;

      i {
        font-size: 40px;
        color: #222;
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg);
      }
    }
  }
}
</style>
