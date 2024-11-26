<template>
   <Html lang="en">
    <Tailwind :config="tailwindConfig">
      <div class="max-w-5xl mx-auto">
        <Text class="text-3xl">Willkommen</Text>
        <Hr />
        <Button
          class="bg-primary px-3 py-2 font-medium leading-4 text-white"
          ref="https://example.com"
          >Click me</Button
        >
      </div>
    </Tailwind>
  </Html>
</template>

<script setup lang="ts">
import {
  Button,
  Hr,
  Html,
  Text,
  Tailwind,
  Container,
} from "@vue-email/components";
import { tailwindConfig } from "./config";
</script>

<style scoped>

</style>