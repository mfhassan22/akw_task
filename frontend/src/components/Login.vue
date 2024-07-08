<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

if(userStore.token){
	router.push({ name: 'dashboard' })
}

async function submit() {
  await userStore.login({email:form.value.email,password:form.value.password})
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800">
      <div class="mb-8 text-center">
        <h1 class="my-3 text-4xl font-bold">Sign in</h1>
        <p class="text-sm text-gray-600">Sign in to access your account</p>
      </div>
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label for="email" class="block mb-2 text-sm">Email address (test@example.com)</label>
            <input type="email" v-model="form.email"  name="email" id="email" placeholder="test@example.com" class="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800">
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <label for="password" class="text-sm">Password (password)</label>
            </div>
            <input type="password" v-model="form.password" name="password" id="password" placeholder="*****" class="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800">
          </div>
        </div>
        <div class="space-y-2">
          <div>
            <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md bg-sky-600 text-gray-50">Sign in</button>
          </div>
          <p class="px-6 text-sm text-center text-gray-600">Don't have an account yet?
            <a rel="noopener noreferrer" href="/register" class="hover:underline text-sky-600">Sign up</a>.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>