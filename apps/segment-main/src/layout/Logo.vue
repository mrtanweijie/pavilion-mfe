<template>
  <img :src="logoSvg" class="logo-icon" alt="logo" />
</template>

<script setup lang="ts">
import logoSvg from './pavilion-mfe-logo.svg'
</script>

<style scoped>
.logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: block;
}
</style>
