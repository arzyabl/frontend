<script setup lang="ts">
import CirclePostsComponent from "@/components/Circle/CirclePostsComponent.vue";
// import { fetchy } from "@/utils/fetchy";
// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

// import { ref, onMounted } from 'vue';
// import { useRoute } from 'vue-router';

// const route = useRoute();
// const circle = ref(null); // Ref to store the fetched circle data
// const loading = ref(true);
// const error = ref<string | null>(null);

// onMounted(async () => {
//   try {
//     const response = await fetchy(`/api/circles/${route.params.id}`, "GET");
//     circle.value = response; // Store the response data in the circle ref
//   } catch (err) {
//     error.value = "Failed to fetch the circle.";
//   } finally {
//     loading.value = false;
//   }
// });
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
