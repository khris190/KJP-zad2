<script setup lang="ts">
import { type ExpressionInterface, Type } from "../ts/ExpressionHandlerV2";

const props = defineProps<{
    expression: ExpressionInterface
    title: string
}>()

</script>

<template>
    <p>{{ title }}</p>
    <input :disabled="true" placeholder="<empty>" v-if="expression.type !== Type.None" :value="expression.message">
</template>

<style scoped>
input {
    margin: 0.5rem 0;
    background-color: black;
}
</style>