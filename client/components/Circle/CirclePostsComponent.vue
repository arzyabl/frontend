<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["circleId"]);
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let circle = ref<Record<string, string> | null>(null);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts(circleId: string) {
  let query: Record<string, string> = { group: circleId };
  let postResults;
  try {
    postResults = await fetchy("/api/posts/", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

async function getCircle(circleId: string) {
  try {
    //console.log(circleId);
    const circleResult = await fetchy(`/api/circles/${circleId}`, "GET");
    circle.value = circleResult;
  } catch (_) {
    console.error("Failed to fetch circle details.");
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

function openCircleDetails(circleId: string) {
  console.log(`Opening circle  details with ID: ${circleId}`);
  void router.push({ name: "Circle Details", params: { id: circleId } });
}

onBeforeMount(async () => {
  await getCircle(props.circleId);
  await getPosts(props.circleId);
  loaded.value = true;
});
</script>

<template>
  <div class="circle" @click="openCircleDetails(props.circleId)">
    <h1 v-if="circle">{{ circle.title }}</h1>
    <h1 v-else>Loading</h1>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm :circle="props.circleId" @refreshPosts="getPosts" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.circle {
  text-align: center;
}
</style>
