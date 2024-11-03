<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { nextTick, onBeforeMount, ref } from "vue";

const props = defineProps(["circleId"]);
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let circle = ref<Record<string, string> | null>(null);
let editing = ref("");
const postsContainer = ref<HTMLElement | null>(null);

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

function goBack() {
  void router.push({ name: "My Circles" });
}

onBeforeMount(async () => {
  await getCircle(props.circleId);
  await getPosts(props.circleId);
  loaded.value = true;

  await nextTick(() => {
    if (postsContainer.value) {
      postsContainer.value.scrollTop = postsContainer.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="circle-header" @click="openCircleDetails(props.circleId)">
    <button class="back-button" @click.stop="goBack">←</button>
    <h1 v-if="circle">{{ circle.title }}</h1>
    <h1 v-else>Loading</h1>
    <div v-if="circle && circle.avatar" class="circle-avatar-container">
      <img :src="circle.avatar" alt="Circle Avatar" class="circle-avatar" />
    </div>
    <div v-else class="empty-circle-avatar"></div>
  </div>

  <section ref="postsContainer" class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
  <section v-if="isLoggedIn">
    <CreatePostForm :circle="props.circleId" @refreshPosts="getPosts" />
  </section>
</template>
<style>
.circle-header {
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
.back-button {
  background: none;
  border: none;
  color: #333;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  margin-left: 1em;
}
</style>
<style scoped>
.circle-avatar-container {
  width: 50px;
  height: 50px;
}

.circle-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.empty-circle-avatar {
  width: 50px;
  height: 50px;
  background-color: #fffefe; /* Placeholder color */
  border-radius: 50%;
}
.posts {
  padding-top: 6em;
  overflow-y: auto;
  flex-grow: 1;
}

article {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
  border-radius: 8px;
  margin-bottom: 0.5em;
}

.fixed-create-post-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5em 1em;
  background-color: var(--base-bg);
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
</style>
