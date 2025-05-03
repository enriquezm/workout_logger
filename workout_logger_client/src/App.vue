<template>
  <div class="app">
    <h1>GitHub JSON Items</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-for="item in items" :key="item.name" class="item">
        <p>{{ item.date }}</p>
        <h2>{{ item.workout }}</h2>
        <p>{{ item.type }}</p>
        <ul>
          <li v-for="(reps, index) in item.sets">Set {{ index + 1 }}: {{ reps }} reps</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const DATA_URL = 'https://raw.githubusercontent.com/enriquezm/workout_logger/refs/heads/main/workout_log.json?token=GHSAT0AAAAAADAK56KRVDOM5RP7KHYOP6U62AUITMA' // replace this

const items = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(DATA_URL)
    if (!res.ok) throw new Error('Failed to load data.')
    items.value = await res.json()
  } catch (err) {
    error.value = 'Error loading data.'
    console.error(err)
  }
})
</script>

<style scoped>
.app {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  background: #f9f9f9;
  color: #333;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.item {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.item h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.item p {
  margin: 0;
  font-size: 0.95rem;
  color: #666;
}

.error {
  color: red;
}
</style>
