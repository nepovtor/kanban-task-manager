<template>
  <div class="task" :data-id="task.id">
    <strong>{{ task.title }}</strong>
    <p>{{ task.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['task'])
</script>

<style scoped>
.task {
  background: white;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
