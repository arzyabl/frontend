<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["circle"]);
let joined = ref(false);
let detailsVisible = ref(false);

async function joinCircle() {
  try {
    console.log(props.circle._id);
    await fetchy(`/api/circles/${props.circle._id}/members`, "PATCH", {
      body: { id: props.circle._id },
    });
    joined.value = true;
  } catch (_) {
    return;
  }
}

async function toggleDetails() {
  console.log("toggle details is under implementation");
}
</script>

<template>
  <div class="circle-card">
    <div class="circle-head">
      <div class="circle-avatar"></div>
      <div class="circle-title">{{ props.circle.title }}</div>
    </div>

    <div class="circle-info">
      <span><i class="type-icon"></i> 🎯 Type: {{ circle.type }}</span>
      <span><i class="level-icon"></i> 📊 Level: {{ circle.difficultylevel }}</span>
      <span><i class="members-icon"></i> 👤 {{ circle.members.length }}/{{ circle.capacity }}</span>
    </div>
    <div class="circle-description">
      <p>{{ circle.description.substring(0, 35) }}...</p>
    </div>
    <div class="circle-actions">
      <div class="read-more" @click="toggleDetails">
        <span class="read-more-icon">{{ detailsVisible ? "▲" : "▼" }} Read more</span>
      </div>
      <button v-if="!joined" class="join-button" @click="joinCircle">+ Join</button>
      <button v-else class="join-button joined" @click="joinCircle">✓ Joined</button>
    </div>
  </div>
</template>

<style scoped>
.circle-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-head {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1em;
}

.circle-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #777;
  margin-right: 15px;
}

.circle-title {
  font-size: 1.2em;
  font-weight: bold;
}

.circle-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 0.9em;
  color: #333;
}

.circle-description {
  text-align: left;
  display: block;
  width: 100%;
  margin: 0;
}

.circle-actions {
  display: flex;
  direction: row;
  width: 100%;
  justify-content: space-between;
}

.read-more {
  cursor: pointer;
  font-size: 0.9em;
  color: #333;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.read-more-icon {
  font-size: 1.2em;
  margin-left: 5px;
}

.join-button {
  margin-top: 10px;
  background-color: #999;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.joined {
  background-color: #333;
}
</style>
