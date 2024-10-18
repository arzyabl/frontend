<script setup lang="ts">
import CircleComponent from "@/components/Circle/CircleDetailsComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const props = defineProps(["circle"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Circle page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <CircleComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
