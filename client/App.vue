<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    if (isLoggedIn.value) {
      await router.push("/circles");
    } else {
      await router.push("/login");
    }
  } catch {
    await router.push("/login");
  }
});
</script>

<template>
  <main>
    <RouterView />
  </main>
  <footer>
    <nav>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Browse Circles' }" :class="{ underline: currentRouteName == 'Browse Circles' }"> Browse</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'My Circles' }" :class="{ underline: currentRouteName == 'My Circles' }"> My Circles </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
@import "./assets/toast.css";

.title {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  position: relative;
}

h1 {
  font-size: 1.5em;
  margin: 0;
  text-decoration: none;
}

img {
  height: 40px;
  width: auto;
}

main {
  flex: 1;
  padding: 2em;
  margin-bottom: 60px;
}

footer {
  position: fixed;
  background-color: lightgrey;
  bottom: 0;
  width: 100%;
  padding: 1em 0;
  display: flex;
  justify-content: center;
}

nav ul {
  list-style-type: none;
  display: flex;
  gap: 1.5em;
  padding: 0;
  margin: 0;
}

.underline {
  text-decoration: underline;
}

.toast {
  position: fixed;
  top: 1em;
  right: 1em;
  z-index: 1000;
}
</style>
