<script setup lang="ts">

const props = defineProps<{
    msg: string
}>()

</script>

<template>
    <input :disabled="true" placeholder="<empty>" :value="msg">
</template>

<style scoped>
input {
    margin: 0.5rem 0;
    background-color: black;
}
</style>