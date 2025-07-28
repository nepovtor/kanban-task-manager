<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      @task-dragged="handleTaskDrag"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoardStore } from '@/stores/board'
import KanbanColumn from './KanbanColumn.vue'

const boardStore = useBoardStore()
const columns = boardStore.columns

onMounted(() => {
  boardStore.fetchBoard()
})

const handleTaskDrag = async ({ taskId, newColumnId, newPosition }) => {
  await boardStore.moveTask(taskId, newColumnId, newPosition)
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 20px;
  padding: 20px;
}
</style>
