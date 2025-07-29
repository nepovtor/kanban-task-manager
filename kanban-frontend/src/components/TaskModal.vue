<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h3>Новая задача</h3>
      <input v-model="title" placeholder="Заголовок" />
      <textarea v-model="description" placeholder="Описание"></textarea>

      <div class="actions">
        <button @click="createTask">Создать</button>
        <button @click="$emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps(['columnId', 'position', 'show'])
const emit = defineEmits(['created', 'close'])

const title = ref('')
const description = ref('')

async function createTask() {
  await axios.post('http://localhost:3000/api/tasks', {
    column_id: props.columnId,
    title: title.value,
    description: description.value,
    position: props.position
  })
  emit('created')
  emit('close')
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
