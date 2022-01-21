<template>
  <div class="home">
    <TypingField />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TypingField from "@/components/TypingField.vue"; // @ is an alias to /src

@Options({
  components: {
    TypingField,
  },
})
export default class Home extends Vue {}
</script>
