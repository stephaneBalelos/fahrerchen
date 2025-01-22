<template>
    <UCard v-if="student" class="mb-4">
        <div class="flex items-center gap-4">
            <UAvatar v-if="student.avatar_path" :src="$publicStorageUrl('student_documents', student.avatar_path)" />
            <UAvatar v-else :alt="`${student.firstname} ${student.lastname}`"/>
            <div class="flex flex-col">
                <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ student.firstname }} {{ student.lastname }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ student.email }}</div>
            </div>
        </div>
        <div class="flex flex-col gap-2 mt-4">
            <div class="flex flex-col">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t("birth_date") }}</div>
                <div class="text-lg font-bold">{{ formatDate(student.birth_date) }}</div>
            </div>
            <div class="flex flex-col">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t("phone") }}</div>
                <div class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ student.phone_number }}</div>
            </div>
            <div class="flex flex-col">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t("address") }}</div>
                <div class="text-md font-bold text-gray-900 dark:text-gray-100">
                    {{ student.address_street }} {{ student.address_city }} {{ student.address_zip }} <br> {{ student.address_country }}
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
    studentId: string;
}
const props = defineProps<Props>();

const { t } = useI18n({
    useScope: "local",
});

const client = useSupabaseClient<Database>();

const { data:student, error } = useAsyncData(async () => {

    const { data, error } = await client.from("students").select("*").eq("id", props.studentId).single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
})

if (error.value) {
    console.error(error.value);
}
</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "birth_date": "Geburtsdatum",
        "phone": "Telefon",
        "address": "Adresse"
    },
    "en": {
        "birth_date": "Birth Date",
        "phone": "Phone",
        "address": "Address"
    }
}
</i18n>