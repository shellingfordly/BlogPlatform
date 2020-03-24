<template>
  <div class="theTime">
    <img class="time_img" src="../assets/imgs/time.svg" alt />
    <span class="real_time">
      <span class="date">{{date.date}}</span>
      <span class="time">{{date.time}}</span>
      <span class="day">{{date.day}}</span>
    </span>
    <span class="music"></span>
  </div>
</template>

<script>
export default {
  name: "theTime",
  data() {
    const theTime = new Date();
    let date = {};
    date.date =
      theTime.getFullYear() +
      "-" +
      theTime.getMonth() +
      "-" +
      theTime.getDate();
    date.time = theTime.toLocaleTimeString().slice(2);
    switch (theTime.getDate() % 7) {
      case 0:
        date.day = "星期天";
        break;
      case 1:
        date.day = "星期一";
        break;
      case 2:
        date.day = "星期二";
        break;
      case 3:
        date.day = "星期三";
        break;
      case 4:
        date.day = "星期四";
        break;
      case 5:
        date.day = "星期五";
        break;
      case 6:
        date.day = "星期六";
        break;
      default:
        date.day = "未知";
        break;
    }
    return { date };
  },
  created() {
    setInterval(() => {
      this.date.time = new Date().toLocaleTimeString().slice(2);
    }, 1000);
  }
};
</script>

<style lang="stylus" scoped>
.theTime {
  width: 100%;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #111;
  border-radius: 10px;

  .time_img {
    width: 20px;
    height: 20px;
    margin-top: 1px;
    margin-right: 10px;
    vertical-align: top;
  }

  .real_time {
    .date {
      margin-right: 10px;
    }

    .time {
      margin-right: 10px;
    }
  }
}
</style>
