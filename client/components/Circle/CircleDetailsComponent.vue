<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["circle"]);
const emit = defineEmits(["editCircle", "seeCalendar", "startCall", "searchPosts", "joinCall"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <p class="circle">{{ props.circle.title }}</p>
  <div class="base">
    <menu v-if="props.circle.admin == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('seeCalendar', props.circle._id)">See Calendar</button></li>
      <li><button class="btn-small pure-button" @click="emit('startCall', props.circle._id)">Start Call</button></li>
      <li><button class="btn-small pure-button" @click="emit('searchPosts', props.circle._id)">Search</button></li>
    </menu>
    <menu v-else>
      <li><button class="btn-small pure-button" @click="emit('seeCalendar', props.circle._id)">See Calendar</button></li>
      <li><button class="btn-small pure-button" @click="emit('joinCall', props.circle._id)">Join Call</button></li>
      <li><button class="btn-small pure-button" @click="emit('searchPosts', props.circle._id)">Search</button></li>
    </menu>
    <article v-for="user in circle.members" :key="user._id">
      <MemberComponent />
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
