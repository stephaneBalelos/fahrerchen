<template>
    <UDashboardSlideover :title="state.name">
        dlsa
    </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseCost } from '~/types/app.types';


type CourseCostEdit = Omit<
    AppCourseCost,
    "id" | "course_id" | "organization_id"
>

type Props = {
    id?: string;
    courseid: string;
    orgid: string;
}
type Emits = {
  (event: "cost-saved" | "cost-deleted", payload?: AppCourseCost): void;
};
const props = defineProps<Props>();
// const { t } = useI18n({
//     useScope: "local",
// });
const _$emits = defineEmits<Emits>();

const state = reactive<CourseCostEdit>({
    name: "",
    description: "",
    price: 0,
});

console.log("props", props);
</script>

<style scoped>

</style>