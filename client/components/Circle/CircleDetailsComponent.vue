<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["circleId"]);
const userStore = useUserStore();
const { currentUsername, isLoggedIn, isOnCall } = storeToRefs(useUserStore());

const loaded = ref(false);
let circle = ref<Record<string, string> | null>(null);
let user = ref<Record<string, string> | null>(null);

async function getCircle(circleId: string) {
  try {
    const circleResult = await fetchy(`/api/circles/${circleId}`, "GET");
    circle.value = circleResult;
  } catch (_) {
    console.error("Failed to fetch circle details.");
  }
}

async function getUser(username: string) {
  try {
    const userResult = await fetchy(`/api/users/${username}`, "GET");
    user.value = userResult;
  } catch (_) {
    console.error("Failed to fetch user details.");
  }
}

async function startCall() {
  try {
    const call = await fetchy("/api/calls", "POST", {
      body: { circle: props.circleId },
    });
    userStore.joinACall();
    void router.push({ name: "Call", params: { callId: call._id } });
  } catch (_) {
    return;
  }
}

async function joinCall() {
  console.log("under implementation");
}

async function returnToCall() {
  try {
    const call = await fetchy(`/api/calls`, "GET");
    void router.push({ name: "Call", params: { callId: call._id } });
  } catch (_) {
    return;
  }
}

async function openCalendar() {
  return null;
}

async function searchPosts() {
  return null;
}

onBeforeMount(async () => {
  await getCircle(props.circleId);
  await getUser(currentUsername.value);
  loaded.value = true;
});
</script>

<template>
  <section class="circleControl" v-if="circle && isLoggedIn">
    <!-- Display circle details when the circle object is available -->
    <h1>{{ circle.title }}</h1>

    <div class="menu">
      <menu>
        <li>
          <button class="btn-small pure-button" @click="openCalendar">See Calendar</button>
        </li>

        <!-- Check if the user is on a call -->
        <li v-if="isOnCall">
          <button class="btn-small pure-button" @click="returnToCall">Return to Call</button>
        </li>
        <!-- If not on call, show the admin or regular user options -->
        <li v-else-if="user && circle && circle.admin === user._id">
          <button class="btn-small pure-button" @click="startCall">Start Call</button>
        </li>
        <li v-else>
          <button class="btn-small pure-button" @click="joinCall">Join Call</button>
        </li>

        <li>
          <button class="btn-small pure-button" @click="searchPosts">Search</button>
        </li>
      </menu>
    </div>

    <!-- Loop through members if available -->
    <h2>Members</h2>
    <article v-for="userId in circle.members" :key="userId">
      <UserComponent :userId="userId" />
    </article>
  </section>

  <!-- Show a loading message when circle is not available -->
  <div v-else>
    <h1>Loading</h1>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
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

.circleControl {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
