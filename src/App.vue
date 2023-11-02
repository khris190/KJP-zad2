<script setup lang="ts">
import { ref } from 'vue';
import InputField from './components/InputField.vue'
import ConvertFiled from './components/ConvertFiled.vue';

let message = ref('')
const onInput = (char: string, full: string, stack: Array<string> | false) => {
  message.value = full;
}

</script>

<template>
  <div class="textFields">
    <InputField @inputEvent="onInput" />
    <ConvertFiled :msg="message" />
  </div>
</template>



<style scoped>
.textFields {
  width: min-content;
}
</style>
