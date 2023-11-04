<script setup lang="ts">
import { ref } from 'vue';
import InputField from '@components/InputField.vue'
import ConvertFiled from '@components/ConvertFiled.vue';
import { ExpressionHandler, type ExpressionHandlerInterface, Type } from '@ts/ExpressionHandler';
import Stack from '@components/Stack.vue';

let message = ref('')

let stack = ref<ExpressionHandlerInterface>(new ExpressionHandler(''))
const onInput = (char: string, full: string, stackH: ExpressionHandler) => {
  message.value = full;
  stack.value = new ExpressionHandler(full);
}
</script>

<template>
  <div class="container">
    <div class="textFields">
      <InputField @inputEvent="onInput" />
      <ConvertFiled :msg="stack.prefix.message" title="Prefix" />
      <ConvertFiled :msg="stack.infix.message" title="Infix" />
      <ConvertFiled :msg="stack.postfix.message" title="Postfix" />
    </div>
    <div class="container">
      <Stack v-if="stack.prefix.type !== Type.None" :expression="stack.prefix" />
      <Stack v-if="stack.infix.type !== Type.None" :expression="stack.infix" />
      <Stack v-if="stack.postfix.type !== Type.None" :expression="stack.postfix" />
    </div>
  </div>
</template>



<style scoped>
.textFields {
  width: min-content;
}

.container {

  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
