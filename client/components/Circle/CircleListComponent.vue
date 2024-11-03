<script setup lang="ts">
import CircleComponent from "@/components/Circle/CircleComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["member"]);
const loaded = ref(false);
let circles = ref<Array<Record<string, string>>>([]);
let userId = ref("");

async function getCircles() {
  let circleResults;
  let query: Record<string, string> = { member: userId.value };
  try {
    circleResults = await fetchy("/api/circles", "GET", { query });
  } catch (_) {
    return;
  }
  circles.value = circleResults;
  //console.log("got circles: " + circles.value);
}

async function getUserId(username: string) {
  try {
    userId.value = (await fetchy(`/api/users/${username}`, "GET"))._id;
  } catch (_) {
    return;
  }
}

function openCircle(circleId: string) {
  console.log(`Opening circle with ID: ${circleId}`);
  void router.push({ name: "Circle Posts", params: { id: circleId } });
}

onBeforeMount(async () => {
  //console.log("tryin to get circles of member: " + props.member.value);
  await getUserId(currentUsername.value);
  await getCircles();

  loaded.value = true;
});
</script>

<template>
  <section class="circles" v-if="isLoggedIn && loaded && circles.length !== 0">
    <article v-for="circle in circles" :key="circle._id">
      <CircleComponent :circle="circle" @openCircle="openCircle" />
    </article>
  </section>
  <p v-else-if="loaded">No circles found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section.circles {
  gap: 0.5em;
  max-width: 25em;
}

.circles h1 {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
}
</style>
