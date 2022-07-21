<template>
  <div class="container">
    <Suspense>
      <template #default> <TypingField /></template>
      <template #fallback>Loading...</template>
    </Suspense>
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
export default class Race extends Vue {}
</script>

<style scoped></style>
