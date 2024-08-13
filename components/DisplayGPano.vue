<script setup lang="ts">
import {GPano} from "~/utils/GPano";

const props = defineProps<{
  originalGPano: GPano,
  nextGPano: GPano,
  onNextValueChange: (key: keyof GPano, value: string | number) => void
}>();

function handleNextValueChange(event: Event) {
  const target = event.target as HTMLInputElement;

  props.onNextValueChange(target.name as keyof GPano, target.value);
}

const metadataItems: {
  key: keyof GPano;
  type: 'text' | 'number';
}[] = [
  {
    key: 'UsePanoramaViewer',
    type: 'text',
  },
  {
    key: 'ProjectionType',
    type: 'text',
  },
  {
    key: 'FullPanoWidthPixels',
    type: 'number',
  },
  {
    key: 'FullPanoHeightPixels',
    type: 'number',
  },
  {
    key: 'CroppedAreaImageWidthPixels',
    type: 'number',
  },
  {
    key: 'CroppedAreaImageHeightPixels',
    type: 'number',
  },
  {
    key: 'CroppedAreaLeftPixels',
    type: 'number',
  },
  {
    key: 'CroppedAreaTopPixels',
    type: 'number',
  }
];
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th>GPano XMP Key</th>
        <th>Original</th>
        <th>Next</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in metadataItems" :key="item.key">
        <td>{{ item.key }}</td>
        <td>{{ originalGPano[item.key] }}</td>
        <td>
          <input
              :type="item.type"
              :name="item.key"
              min="0"
              :value="nextGPano[item.key]"
              @change="handleNextValueChange"
          />
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.25rem;
  min-width: 6rem;
}

tr {
  border-bottom: 1px solid #ccc;
}

tr:last-child {
  border-bottom: none;
}

tr > :first-child {
  text-align: left;
}

input {
  width: 100%;
  display: block;
}
</style>
