<script setup lang="ts">
import { ref } from 'vue';
import InputField from '@components/InputField.vue'
import ConvertFiled from '@components/ConvertFiled.vue';
import { ExpressionHandler, type ExpressionHandlerInterface } from '@ts/ExpressionHandler';
let message = ref('')

let stack = ref<ExpressionHandlerInterface>(new ExpressionHandler(''))
const onInput = (char: string, full: string) => {
  message.value = full;
  stack.value = new ExpressionHandler(full);

}
</script>

<template>
  <div class="container">
    <div class="textFields">
      <InputField @inputEvent="onInput" />
      <ConvertFiled :expression="stack.prefix" title="Prefix" />
      <ConvertFiled :expression="stack.infix" title="Infix" />
      <ConvertFiled :expression="stack.postfix" title="Postfix" />
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
