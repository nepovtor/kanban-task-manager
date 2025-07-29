<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = '' // Reset error message
  
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value
    })

    // Store the token and redirect
    localStorage.setItem('token', response.data.token)
    router.push('/')
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      error.value = err.response.data.message || 'Login failed'
    } else if (err.request) {
      // The request was made but no response was received
      error.value = 'Network error - please try again later'
    } else {
      // Something happened in setting up the request
      error.value = 'An unexpected error occurred'
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 100px auto;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}
</style>