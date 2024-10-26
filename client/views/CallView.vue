<script setup lang="ts">
import CallComponent from "@/components/Call/CallComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
//const props = defineProps(["circle"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <CallComponent :callId="$route.params.callId" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
