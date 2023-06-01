<template>
  <div class="container center">
    <h1 class="center">Hi! too bored to write this page. &copy Abhinav 2023</h1>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TypingField from "@/components/TypingField.vue"; // @ is an alias to /src

@Options({
  components: {
  },
})
export default class About extends Vue {}
</script>

<style scoped>
h1 {
    margin-top: 100px;
}
</style>

