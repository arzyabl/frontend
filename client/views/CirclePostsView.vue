<script setup lang="ts">
import CirclePostsComponent from "@/components/Circle/CirclePostsComponent.vue";
</script>

<template>
  <main>
    <CirclePostsComponent :circleId="$route.params.id" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
