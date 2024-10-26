<script setup lang="ts">
const props = defineProps(["userId"]);
</script>

<template>
  <div class="user-item">
    <span class="username">{{ props.userId }}</span>
  </div>
</template>

<style scoped>
.user-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.username {
  font-size: 16px;
  font-weight: 500;
}
</style>
