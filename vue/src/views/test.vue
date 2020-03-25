<template>
  <div class="markdown">
    {{sss.a}}
    <button @click="aaaa">zzz</button>
    <!-- <Markdown v-model="sss" /> -->
  </div>
</template>

<script>
// import Markdown from "vue-meditor";

export default {
  name: "markdown",
  data() {
    return {
      sss: {
        a: "aaaaa"
      }
    };
  },
  methods: {
    aaaa() {
      this.sss.a = "xxxxx";
    }
  },
  components: {
    // Markdown
  }
};
</script>