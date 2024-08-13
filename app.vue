<script setup lang="ts">
useHead({
  title: 'XMP Panorama Fixer',
})
</script>

<template>
  <div class="container">
    <h1>XMP Panorama Fixer</h1>
    <p>The app repairs the XMP metadata on images, so they can be displayed as panorama pictures in Google Photos and other photo apps.</p>
    <MetadataEditor />
  </div>
</template>

<style>
:root {
  --primary-color: darkcyan;
  --primary-color-dark: #006666;
  --primary-color-darkes: #004d4d;
  --secondary-color: white;
  --secondary-color-dark: #f0f0f0;
  --secondary-color-darkest: #e0e0e0;
  --border-color: #ccc;
  --border-radius: 8px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: sans-serif;
}

.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
