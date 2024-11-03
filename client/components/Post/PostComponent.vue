<script setup lang="ts">
import ModalComponent from "@/components/Post/ModalComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const showModal = ref(false);

const handlePostClick = async () => {
  if (props.post.author === currentUsername.value) {
    showModal.value = true; // Show the modal
  }
};

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts", props.post.group);
};

// Handle modal events
const handleCloseModal = async () => {
  showModal.value = false;
};

const handleEditPost = async () => {
  emit("editPost", props.post._id);
  await handleCloseModal();
};

const handleDeletePost = async () => {
  await deletePost();
  await handleCloseModal();
};
</script>

<template>
  <div @click="handlePostClick" :class="['post', { 'post-author': props.post.author === currentUsername, 'post-other': props.post.author !== currentUsername }]">
    <p class="author">{{ props.post.author }}</p>
    <p class="content">{{ props.post.content }}</p>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">={{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>

  <!-- Modal Component -->
  <ModalComponent :isVisible="showModal" @close="handleCloseModal" @editPost="handleEditPost" @deletePost="handleDeletePost" />
</template>

<style scoped>
p {
  margin: 0em;
  font-size: 1em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.post {
  cursor: pointer;
  padding: 1em;
  transition: background-color 0.2s;
  border-radius: 1em;
  max-width: 75%;
}

/* Right-align author’s posts */
.post-author {
  background-color: #e1bee7; /* Light purple for author's posts */
  align-self: flex-end;
  margin-left: auto;
  text-align: right;
}

/* Left-align other users’ posts */
.post-other {
  background-color: #f3e5f5; /* Lighter purple for others' posts */
  align-self: flex-start;
  margin-right: auto;
  text-align: left;
}
.content {
  text-align: left;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
