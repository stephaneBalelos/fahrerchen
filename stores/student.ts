import type { CourseSubscriptionView, AppStudent, Database } from "~/types/app.types";

export const useStudentStore = defineStore('student', () => {
    const client = useSupabaseClient<Database>()
    const student = ref<AppStudent | null>(null);
    const subscriptions = ref<CourseSubscriptionView[]>([]);
    const userOrganizationsStore = useUserOrganizationsStore();

    async function loadStudent(org_id: string, user_id: string) {
        const { data, error } = await client.from('students').select('*').eq('organization_id', org_id)
        .eq('user_id', user_id).single();
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('no student data found')
            return
        }

        student.value = data
    }

    async function loadSubscriptions(org_id: string, student_id: string) {
        const { data, error } = await client.from('course_subscriptions_view').select('*').eq('organization_id', org_id)
        .eq('student_id', student_id);
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('no subscription data found')
            return
        }

        subscriptions.value = data
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization) {
            await loadStudent(userOrganizationsStore.selectedOrganization.organization_id, userOrganizationsStore.selectedOrganization.user_id)

            if (student.value) {
                await loadSubscriptions(userOrganizationsStore.selectedOrganization.organization_id, student.value.id)
            }
        }
    }, { immediate: true })

    return { student, subscriptions, loadStudent }
});