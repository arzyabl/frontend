<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const props = defineProps(["circle"]);
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string) => {
  if (!content.trim()) return; // Prevent submitting empty content

  try {
    await fetchy("/api/posts", "POST", {
      body: { content: content, circle: props.circle },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts", props.circle);
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content)">
    <div class="input-container">
      <textarea id="content" v-model="content" placeholder="Write something!" required> </textarea>
      <button type="submit" class="send-button">Send</button>
    </div>
  </form>
</template>
<style scoped>
form {
  background-color: #ccc;
  display: flex;
  flex-direction: column;
  padding: 1em;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

textarea {
  flex-grow: 1;
  font-family: inherit;
  font-size: 1em;
  min-height: 1em;
  padding: 0.7em;
  border-radius: 4px;
  resize: none;
  border: 1px solid #ccc;
  outline: none;
}

.send-button {
  padding: 0.7em 1.5em;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1em;
  align-self: flex-end;
  margin-top: 0.5em;
}
@media (max-width: 600px) {
  form {
    padding: 0.5em;
  }

  textarea {
    min-height: 2.5em;
    padding: 0.5em;
    font-size: 0.9em;
  }

  .send-button {
    padding: 0.5em 1em;
    font-size: 0.9em;
  }
}
</style>
