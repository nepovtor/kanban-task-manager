<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token) // сохраняем токен
    router.push('/') // редирект на главную
  } catch (err) {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 100px auto;
}
</style>
