<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const userStore = useUserStore();
const { currentUsername, isOnCall } = storeToRefs(useUserStore());
const props = defineProps(["callId"]);

const loaded = ref(false);
let user = ref<Record<string, string> | null>(null);
let call = ref<Record<string, string> | null>(null);
let circle = ref<Record<string, string> | null>(null);

const isMuted = ref(true);

const isAdmin = computed(() => {
  return user.value && call.value && call.value.admin === user.value._id;
});

async function getUser(username: string) {
  try {
    const userResult = await fetchy(`/api/users/${username}`, "GET");
    user.value = userResult;
  } catch (_) {
    console.error("Failed to fetch user details.");
  }
}

async function getCall(callId: string) {
  try {
    const callResult = await fetchy(`/api/calls/${callId}`, "GET");
    call.value = callResult;
  } catch (_) {
    console.error("Failed to fetch call details.");
  }
}

async function getCircle(circleId: string) {
  try {
    const circleResult = await fetchy(`/api/circles/${circleId}`, "GET");
    circle.value = circleResult;
  } catch (_) {
    console.error("Failed to fetch circle details.");
  }
}

function closeCall() {
  if (circle.value) {
    void router.push({ name: "Circle Posts", params: { id: circle.value._id } });
    console.log("Call closed");
  }
}

async function leaveCall(callId: string) {
  try {
    await fetchy(`/api/calls/${callId}/participants`, "DELETE", {
      body: { id: callId },
    });
    userStore.leaveACall();
    if (circle.value) {
      void router.push({ name: "Circle Posts", params: { id: circle.value._id } });
    }
  } catch (_) {
    return;
  }
}

async function endCallForAll(callId: string) {
  console.log("deleting event " + callId);
  try {
    await fetchy(`/api/calls/${callId}`, "DELETE");
    userStore.leaveACall(); // how to leave a call for everyone?
    if (circle.value) {
      void router.push({ name: "Circle Posts", params: { id: circle.value._id } });
      console.log(`Ended call ${callId} for all participants`);
    }
  } catch (_) {
    return;
  }
}

async function toggleOnlyListen(callId: string) {
  try {
    await fetchy(`/api/calls/${callId}/listeners`, "PATCH", {
      body: { id: callId },
    });
    console.log("Switching to listen-only mode");
  } catch (_) {
    return;
  }
}

async function toggleMute(callId: string) {
  try {
    await fetchy(`/api/calls/${callId}/speakers`, "PATCH", {
      body: { id: callId },
    });
    isMuted.value = isMuted.value ? false : true;
    console.log(isMuted.value ? "Unmuted" : "Muted");
  } catch (_) {
    return;
  }
}

async function callNext(callId: string) {
  try {
    await fetchy(`/api/calls/${callId}/next`, "PATCH", {
      body: { id: callId },
    });
  } catch (_) {
    return;
  }
  console.log("Calling next participant");
}

onBeforeMount(async () => {
  await getUser(currentUsername.value);
  await getCall(props.callId);
  if (call.value) {
    await getCircle(call.value.group);
  }
  loaded.value = true;
});
</script>
<template>
  <div v-if="loaded && circle && call" class="call-container">
    <!-- Header with controls -->
    <header class="call-header">
      <button @click="closeCall">Close</button>
      <div class="circle-name">
        <h2>{{ circle.title }}</h2>
      </div>
      <!-- Show "End for All" for admin and "Leave Call" for others -->
      <button v-if="isAdmin" @click="endCallForAll(call._id)">End for All</button>
      <button v-else @click="leaveCall(call._id)">Leave Call</button>
    </header>

    <!-- Participants area -->
    <section class="participants-area">
      <div class="participant-circle">
        <div class="admin">
          <span class="icon">🔊</span>
          <p>Admin</p>
        </div>

        <div class="participants">
          <div v-for="(participant, index) in call.participants" :key="index" class="participant">
            <span class="icon" :class="{ listening: call.listeners.includes(participant) }">🎧</span>
            <p>{{ participant }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Controls at the bottom -->
    <div class="call-control">
      <button @click="toggleMute(call._id)">{{ isMuted ? "Unmute" : "Mute" }}</button>
      <button v-if="isAdmin" @click="callNext(call._id)">Call next</button>
      <button v-else @click="toggleOnlyListen(call._id)">Only listen</button>
    </div>
  </div>

  <div v-else>
    <h2>Loading circle name...</h2>
  </div>
</template>

<style scoped>
.call-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* Prevent scrolling */
}

.call-header {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ccc;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1em;
}

.circle-name {
  text-align: center;
}

.participants-area {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5em;
}

.participant-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.participants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.participant,
.admin {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  font-size: 30px;
}

.call-control {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
