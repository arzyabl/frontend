<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps(["circle"]);
const emit = defineEmits(["openCircle"]);
const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const lastPost = ref<Record<string, any> | null>(null);

async function fetchLastPost() {
  let query: Record<string, string> = { group: props.circle._id };
  let postResults;
  try {
    postResults = await fetchy("/api/posts/", "GET", { query });
    lastPost.value = postResults[postResults.length - 1];
  } catch (error) {
    console.error("Error fetching the last post:", error);
  }
}

onBeforeMount(async () => {
  await fetchLastPost();
  loaded.value = true;
});

const truncatedContent = computed(() => {
  if (lastPost.value) {
    const preview = lastPost.value.content.substring(0, 25);
    return `${lastPost.value.author}: ${preview}...`;
  } else {
    return "No posts yet.";
  }
});
</script>

<template>
  <div class="circle-container" @click="$emit('openCircle', props.circle._id)">
    <div class="circle-avatar">
      <img v-if="props.circle.avatar" :src="props.circle.avatar" alt="Circle Avatar" />
      <div v-else class="empty-avatar"></div>
    </div>
    <div class="circle-info">
      <p class="circle-title">{{ props.circle.title }}</p>
      <p class="last-post">{{ truncatedContent }}</p>
    </div>
  </div>
</template>

<style scoped>
.circle-container {
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.circle-container:hover {
  background-color: #f1f1f1;
}

.circle-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.circle-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-avatar {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  border-radius: 50%;
}

.circle-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.circle-title {
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: 0.3em;
}

.last-post {
  font-size: 0.9em;
  color: #555;
  line-height: 1.4;
}

.author {
  font-weight: bold;
  color: #333;
}
</style>
