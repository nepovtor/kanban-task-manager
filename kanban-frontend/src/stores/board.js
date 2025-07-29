import { defineStore } from 'pinia'
import axios from 'axios'

export const useBoardStore = defineStore('board', {
  state: () => ({
    boardId: 1, // пока захардкожен ID доски
    columns: []
  }),
  actions: {
    async fetchBoard() {
      const res = await axios.get(`http://localhost:3000/api/columns/board/${this.boardId}`)
      const { columns, tasks } = res.data
      console.log('\ud83d\udce6 Columns loaded:', res.data)
      this.columns = columns.map(col => ({
        ...col,
        tasks: tasks.filter(t => t.column_id === col.id)
      }))
    },
    async moveTask(taskId, newColumnId, newPosition) {
      await axios.put(`http://localhost:3000/api/tasks/${taskId}/move`, {
        newColumnId,
        newPosition
      })
    },
    moveTaskLocally({ taskId, newColumnId, newPosition }) {
      // можно реализовать локальное обновление без перезапроса
    }
  }
});
