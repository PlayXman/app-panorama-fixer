<script setup lang="ts">
import {getImageSize} from "~/utils/file";
import {GPano} from "~/utils/GPano";
import {ImageSize} from "~/utils/ImageSize";
import DisplayGPano from "~/components/DisplayGPano.vue";
import {createRecommendedGPano, extractGPanoXmp, updateGPanoXmp} from "~/utils/metadata";
import {XmpXml} from "~/utils/XmpXml";
import DisplayErrors from "~/components/DisplayErrors.vue";

const originalFile = ref<File | null>(null);
const originalImageSize = ref(new ImageSize());
const originalXmpXml = ref<XmpXml | null>(null);
const originalGPano = ref(new GPano());
const recommendedGPano = ref(new GPano());
const nextGPano = ref(new GPano());
const nextImageFileUrl = ref('');
const errors = ref<Error | string | null>(null);

function setErrors(error: unknown) {
  switch (typeof error) {
    case "object":
    case "string":
      errors.value = error as Error;
      break;
    default:
      console.error(error);
  }
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];

  if (file == null) {
    return;
  }

  originalFile.value = file;
  URL.revokeObjectURL(nextImageFileUrl.value);
  nextImageFileUrl.value = '';
  errors.value = null;

  try {
    const xmpXml = await extractGPanoXmp(file);
    originalXmpXml.value = xmpXml;
    originalGPano.value = xmpXml.toGPano();
    const imageSize = await getImageSize(file);
    originalImageSize.value = imageSize;
    const preferredPano = createRecommendedGPano(imageSize);
    recommendedGPano.value = preferredPano;
    nextGPano.value = preferredPano;
  } catch(error) {
    setErrors(error);
  }
}

function handleNextGPanoPropertyChange(key: keyof GPano, value: string | number) {
  const nextValue = nextGPano.value.clone();
  // @ts-ignore
  nextValue[key] = value;
  nextGPano.value = nextValue;
}

function handleResetToRecommended() {
  nextGPano.value = recommendedGPano.value.clone();
}

async function handleUpdateImageMetadata() {
  if (originalFile.value == null || originalXmpXml.value == null) {
    return;
  }

  try {
    const updatedFile = await updateGPanoXmp(originalFile.value, originalXmpXml.value, nextGPano.value);
    nextImageFileUrl.value = URL.createObjectURL(updatedFile);
  } catch (error) {
    setErrors(error);
  }
}
</script>

<template>
  <h4>1. Select image you want to fix.</h4>
  <input class="input" type="file" name="file" accept="image/jpeg" @change="handleFileChange"/>

  <h4>2. Edit image metadata. The preset is usually fine.</h4>
  <DisplayErrors :error="errors" />
  <DisplayGPano
      :on-next-value-change="handleNextGPanoPropertyChange"
      :next-g-pano="nextGPano"
      :original-g-pano="originalGPano"
  />

  <h4>3. Update image metadata and download the fixed image.</h4>
  <div class="button-container">
    <button class="button" @click="handleResetToRecommended">Reset to recommended</button>
    <button class="button button-primary" @click="handleUpdateImageMetadata">Update image metadata</button>
  </div>

  <div v-if="nextImageFileUrl !== ''">
    <h4>4. Download the fixed image.</h4>
    <a class="update-image-link button button-primary" :href="nextImageFileUrl" download>→ Download updated image ←</a>
  </div>
</template>

<style>
h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-style: italic;
  color: var(--primary-color);
}

.input {
  display: block;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  padding: 0.5rem;
}

.button-container {
  display: flex;
  gap: 1rem;
}
.button-container > * {
  flex: 1;
}

.button {
  appearance: none;
  background: var(--secondary-color);
  color: black;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.button:hover {
  background: var(--secondary-color-dark);
}
.button:active {
  background: var(--secondary-color-darkest);
}

.button-primary {
  background: var(--primary-color);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}
.button-primary:hover {
  background: var(--primary-color-dark);
}
.button-primary:active {
  background: var(--primary-color-darkes);
}

.update-image-link {
  text-align: center;
  text-decoration: none;
  display: block;
}
</style>
