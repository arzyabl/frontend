<script setup lang="ts">
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "editPost", "deletePost"]);

const onEdit = () => {
  emit("editPost");
  close();
};

const onDelete = () => {
  emit("deletePost");
  close();
};

const close = () => {
  emit("close");
};
</script>
<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal">
      <h2>Post Options</h2>
      <button @click="close">Cancel</button>
      <button @click="onEdit">Edit</button>
      <button @click="onDelete">Delete</button>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2em;
  border-radius: 8px;
  text-align: center;
  justify-content: space-between;
}
</style>
