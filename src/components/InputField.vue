<script setup lang="ts">
import { ExpressionV2, Type } from "../ts/ExpressionHandlerV2";
import { ref } from 'vue';
let input: string;
let error = ref(true);
const emit = defineEmits(['inputEvent'])
const onChange = (event: Event) => {
    const payload = event as InputEvent;
    let expression = new ExpressionV2(input);
    error.value = expression.type !== Type.None;
    let inElement = payload.target as HTMLInputElement;
    if (error.value) {
        inElement.classList.remove('error');
        emit('inputEvent', payload.data, input);
    } else {
        inElement.classList.add('error');
    }
}
</script>
<template>
    <div class="inputField">
        <input v-model="input" placeholder="input" @input="onChange">
        <p v-if="!error" class="error-text error">Wrong format</p>
    </div>
</template>


<style scoped>
.inputField {
    margin: 0.5rem 0;
}

.error {
    color: rgb(190, 31, 31);
}

.error-text {
    font-size: 0.6rem;
    text-align: left;
    padding-left: 0.2rem;
    margin-top: 0.1rem;
}
</style>
