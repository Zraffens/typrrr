<template>
  <div>
    <div class="profile-logo"></div>
    <div class="stats">
      <p class="username">Loading...</p>
      <p class="races">Loading...</p>
      <div class="avg-speed">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";

@Options({})
export default class LoadingProfile extends Vue {}
</script>

<style></style>
