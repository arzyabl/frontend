<script setup lang="ts">
import CircleListComponent from "@/components/Circle/CircleListComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

let searchCircle = ref("");
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

function createCircle() {
  void router.push("/circles/create/");
}
</script>

<template>
  <div class="control-bar">
    <input type="text" v-model="searchCircle" placeholder="Search" />
    <button class="start-circle" @click="createCircle">Start Circle</button>
  </div>
  <h1>My Circles</h1>
  <CircleListComponent :member="currentUsername" />
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 1em;
}

.control-bar {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  border-radius: 8px;
  width: 100%;
  max-width: 25em;
  margin-bottom: 1em;
}

.control-bar input[type="text"] {
  flex: 1;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.start-circle {
  background-color: #888;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
}
</style>
