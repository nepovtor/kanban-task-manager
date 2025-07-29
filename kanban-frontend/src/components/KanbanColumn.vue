<template>
  <div class="kanban-column" :data-column-id="column.id">
    <h3>{{ column.title }}</h3>
    <VueDraggableNext
      :list="column.tasks"
      group="tasks"
      item-key="id"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <KanbanTask :task="element" />
      </template>
    </VueDraggableNext>

    <button @click="showModal = true">➕ Добавить задачу</button>
    <TaskModal
      v-if="showModal"
      :column-id="column.id"
      :position="column.tasks.length"
      :show="showModal"
      @created="onTaskCreated"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import KanbanTask from './KanbanTask.vue'
import TaskModal from './TaskModal.vue'

const props = defineProps(['column'])
const emit = defineEmits(['task-dragged'])

const showModal = ref(false)

function onDragEnd(event) {
  if (event.to !== event.from) {
    emit('task-dragged', {
      taskId: parseInt(event.item.dataset.id),
      newColumnId: parseInt(event.to.closest('[data-column-id]').dataset.columnId),
      newPosition: event.newIndex
    })
  }
}

function onTaskCreated() {
  // простой способ обновить данные после создания задачи
  location.reload()
}
</script>

<style scoped>
.kanban-column {
  width: 300px;
  background: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
}
</style>
