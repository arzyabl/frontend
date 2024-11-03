<script setup lang="ts">
import CreateCircleComponent from "@/components/Circle/CreateCircleComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <CreateCircleComponent />
  </main>
</template>

<style scoped></style>
