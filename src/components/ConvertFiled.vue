<script setup lang="ts">

const props = defineProps<{
    msg: string
    title: string
}>()

</script>

<template>
    <p>{{ title }}</p>
    <input :disabled="true" placeholder="<empty>" :value="msg">
</template>

<style scoped>
input {
    margin: 0.5rem 0;
    background-color: black;
}
</style>