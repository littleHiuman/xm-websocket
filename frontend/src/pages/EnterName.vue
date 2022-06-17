<template>
  <div>
    <p>Enter your name</p>
    <input type="text"
           v-model="name"
           @keyup.enter="enterName">
    <button @click="enterName">确定</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

var name = ref('')
sessionStorage.setItem('xm-websocket', JSON.stringify([]))

var emits = defineEmits(['update-name'])
const router = useRouter()
function enterName () {
  name.value = name.value.trim()
  if (name.value.length) {
    emits('update-name', name.value)
    router.push('/main')
  }
}
</script>