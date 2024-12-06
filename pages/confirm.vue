<script setup lang="ts">
const user = useSupabaseUser();

const client = useSupabaseClient();

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName;
const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

// get access token from url hash
const route = useRoute();
const hash = route.hash;

console.log("hash", hash);
// remove #
const hashParams = new URLSearchParams(hash.slice(1));
const accessToken = hashParams.get("access_token");
const refreshToken = hashParams.get("refresh_token");

watch(user, () => {
  console.log("redirecting to ", redirectPath);
  if (user.value) {
    navigateTo(redirectPath || "/my");
  } else {
    console.log("no user");
  }
}, { immediate: true });

// if access token is present, set it in the client
if (accessToken && refreshToken) {
  client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  }).then(() => {
    console.log("session set");
  }).catch((error) => {
    console.error("error setting session", error);
  });
}
</script>
<template>
  <div>Waiting for login...</div>
</template>
