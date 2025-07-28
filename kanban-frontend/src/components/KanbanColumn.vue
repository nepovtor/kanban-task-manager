<template>
  <div class="kanban-column" :data-column-id="column.id">
    <h3>{{ column.title }}</h3>
    <draggable
      :list="column.tasks"
      group="tasks"
      item-key="id"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <KanbanTask :task="element" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import KanbanTask from './KanbanTask.vue'

const props = defineProps(['column'])
const emit = defineEmits(['task-dragged'])

const onDragEnd = (event) => {
  if (event.to !== event.from) {
    emit('task-dragged', {
      taskId: parseInt(event.item.dataset.id),
      newColumnId: parseInt(event.to.closest('[data-column-id]').dataset.columnId),
      newPosition: event.newIndex
    })
  }
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
