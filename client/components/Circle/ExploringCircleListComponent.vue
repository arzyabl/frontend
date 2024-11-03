<script setup lang="ts">
import CircleInfoComponent from "@/components/Circle/CircleInfoComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["searchTerm"]);
const loaded = ref(false);
let circles = ref<Array<Record<string, string>>>([]);
let userId = ref("");

async function getUserId(username: string) {
  try {
    userId.value = (await fetchy(`/api/users/${username}`, "GET"))._id;
  } catch (_) {
    return;
  }
}

//intentionally getting only once because we want to see which new circles we join
async function getNonmemberCircles() {
  let circleResults;
  try {
    circleResults = await fetchy("/api/circles", "GET");
    console.log(circles);
    circles.value = circleResults.filter((circle: { members: string | string[] }) => !circle.members.includes(userId.value));
    console.log("got circles: " + circles.value);
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  //console.log("tryin to get circles of member: " + props.member.value);
  await getUserId(currentUsername.value);
  await getNonmemberCircles();

  loaded.value = true;
});

const filteredCircles = computed(() => {
  const searchTerm = props.searchTerm?.toLowerCase() || "";
  return circles.value.filter((circle) => circle && circle.title.toLowerCase().includes(searchTerm));
});
</script>

<template>
  <section class="circles" v-if="isLoggedIn && loaded && filteredCircles.length !== 0">
    <article v-for="circle in filteredCircles" :key="circle._id">
      <CircleInfoComponent :circle="circle" />
    </article>
  </section>
  <p v-else-if="loaded">No circles found</p>
  <p v-else>Loading...</p>
</template>

<style>
.circles {
  align-items: center;
  justify-content: center;
}
</style>
