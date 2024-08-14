<script setup lang="ts">
const props = defineProps<{
  error: Error | string | undefined | null;
}>();

const message = computed(() => {
  switch (typeof props.error) {
    case "string":
      return props.error;
    case "object":
      if(props.error instanceof Error) {
        return props.error.message;
      }
      return '';
    default:
      return '';
  }
});
</script>

<template>
<div v-if="error != null">
  {{message}}
</div>
</template>

<style scoped>
div {
  border: 1px solid red;
  border-radius: var(--border-radius);
  color: red;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
