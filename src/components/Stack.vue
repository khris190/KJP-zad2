<script setup lang="ts">
import { type ExpressionInterface } from '@ts/ExpressionHandler';


const props = defineProps<{
    expression: ExpressionInterface | null
}>()

if (props.expression === null) {
    throw new Error("expression is null");

}
console.log(props.expression);

</script>

<template>
    <div class="stack-container">
        <div class="input-title">{{ expression?.type }} </div>
        <table>
            <tr v-for="(char, index) in expression?.stack">
                <th>{{ index }} </th>
                <th>{{ char }} </th>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.stack-container {
    padding: 1rem;
    font-size: 0.75rem;
}

.input-title {
    margin: 0.5rem 0;
}

input {
    margin: 0.5rem 0;
    background-color: black;
}

table {
    border-color: rgb(153, 153, 153);
    border-style: solid;
    border-width: 1px;

    & th {
        border-color: rgb(153, 153, 153);
        border-style: solid;
        border-width: 1px;
        padding: 0 0.25rem;
    }
}
</style>