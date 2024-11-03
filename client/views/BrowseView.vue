<script setup lang="ts">
import ExploringCirclesComponent from "@/components/Circle/ExploringCircleListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

let searchCircle = ref("");
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <div class="control-bar">
    <input type="text" v-model="searchCircle" placeholder="Search" />
  </div>
  <h1>Explore Circles</h1>
  <ExploringCirclesComponent :searchTerm="searchCircle" />
</template>

<style>
h1 {
  text-align: center;
  margin-top: 1em;
}

.control-bar input[type="text"] {
  flex: 1;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
}
</style>
