<template>
  <div>
    <router-view :loginName="name"
                 @updateName="updateName"></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
var name = ref('')
function updateName (val) {
  name.value = val
}
</script>

<style>
</style>
