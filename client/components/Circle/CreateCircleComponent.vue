<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

//const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const circleName = ref("");
const circleType = ref("");
const capacity = ref(1);
const difficulty = ref("");
const description = ref("");

const createCircle = async (circleName: string, circleType: string, capacity: number, difficulty: string, description: string) => {
  try {
    await fetchy("/api/circles", "POST", {
      body: { title: circleName, type: circleType, capacity: capacity, difficultylevel: difficulty, description: description },
    });
  } catch (_) {
    return;
  }
  emptyForm();
  void router.push({ name: "My Circles" });
};

const emptyForm = () => {
  circleName.value = "";
  circleType.value = "";
  capacity.value = 1;
  difficulty.value = "";
  description.value = "";
};
</script>

<template>
  <header>
    <h1>Create Circle</h1>
  </header>

  <div class="create-circle-form">
    <form @submit.prevent="createCircle(circleName, circleType, capacity, difficulty, description)">
      <!-- Circle Name Input -->
      <div class="form-group">
        <label for="circleName">Circle Name:</label>
        <input type="text" id="circleName" v-model="circleName" required placeholder="Name your circle..." />
      </div>

      <!-- Choose Type Dropdown -->
      <div class="form-group">
        <select id="circleType" v-model="circleType" required>
          <option value="" disabled>Select a type</option>
          <option value="language">Language</option>
          <option value="islamic">Islamic</option>
          <option value="coaching">Coaching</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Capacity Input -->
      <div class="form-group">
        <label for="capacity">Capacity:</label>
        <input type="number" id="capacity" v-model.number="capacity" required placeholder="Enter max people" />
      </div>

      <!-- Difficulty Dropdown -->
      <div class="form-group">
        <label for="difficulty">Difficulty:</label>
        <select id="difficulty" v-model="difficulty" required>
          <option value="" disabled>Select difficulty level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <!-- Description Textarea -->
      <div class="form-group">
        <textarea id="description" v-model="description" rows="4" placeholder="Describe your circle" required></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit">Create Circle</button>
    </form>
  </div>
</template>

<style scoped>
form {
  gap: 2em;
}
</style>
