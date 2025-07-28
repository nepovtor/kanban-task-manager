import { defineStore } from 'pinia'
import axios from 'axios'

export const useBoardStore = defineStore('board', {
  state: () => ({
    boardId: 1, // пока захардкожен ID доски
    columns: []
  }),
  actions: {
    async fetchBoard() {
      const res = await axios.get(`http://localhost:3000/api/columns/board/${this.boardId}`);
      this.columns = res.data;
    },
    async moveTask(taskId, newColumnId, newPosition) {
      await axios.put(`http://localhost:3000/api/tasks/${taskId}/move`, {
        newColumnId,
        newPosition
      });
    },
    moveTaskLocally({ taskId, newColumnId, newPosition }) {
      // можно реализовать локальное обновление без перезапроса
    }
  }
});
