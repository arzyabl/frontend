<script setup lang="ts">
import CircleDetailsComponent from "@/components/Circle/CircleDetailsComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
//const props = defineProps(["circle"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <CircleDetailsComponent :circleId="$route.params.id" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
