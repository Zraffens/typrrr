<template>
  <div class="navbar">
    <div class="flex container parent">
      <ul class="small-links">
        <li class="enlarge"><a href="">Blog</a></li>
        <li class="enlarge"><a href="">About</a></li>
      </ul>
      <div class="align-center">
        <h1 id="brand" class="enlarge"><a href="">Typeracer</a></h1>
      </div>
      <div class="user-info enlarge">
        <div class="flex">
          <div class="profile-logo"></div>
          <div class="stats">
            <p class="username">Guest</p>
            <p class="races">Races: 0</p>
            <div class="avg-speed">Average Speed: 0wpm</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {};
  },
})
export default class Navbar extends Vue {}
</script>

<style>
.navbar {
  background: #222222;
  color: white;
  padding: 1em 0 1em 0;
  margin: -0.5em;
}

.flex.parent > div, .flex.parent > ul {
  flex: 1;
  padding: 0 1em 0 1em;
}

ul {
  margin: 0!important;
}

.small-links {
  text-align: right;
}

#brand {
  border-left: 1px solid white;
  border-right: 1px solid white;
}

.user-info {
  cursor: pointer;
}

.profile-logo {
  flex: 1;
  border-radius: 50%;
  background: white;
  width: 100%;
  height: 70px;
}

.stats {
  flex: 3;
  padding-left: 1.2em;
}

.stats p {
  margin: 0;
}

</style>
