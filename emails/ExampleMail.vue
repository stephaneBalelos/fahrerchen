<script setup lang="ts">
import {
  Button,
  Hr,
  Html,
  Text,
  Tailwind,
  Head,
  Body,
  Container,
} from "@vue-email/components";
import { tailwindConfig } from "./config";

defineProps({
  title: String,
});
const uiConfig = useAppConfig().ui;
</script>

<template>
  <Html lang="en">
    <Head></Head>
    <Tailwind :config="tailwindConfig">
      <Body>
        <div class="max-w-5xl mx-auto">
        <Text class="text-3xl">{{ title }}</Text>
        <Hr />
        <Button
          class="bg-primary px-3 py-2 font-medium leading-4 text-white"
          ref="https://example.com"
          >Click me</Button
        >
      </div>
      </Body>
    </Tailwind>
  </Html>
</template>
