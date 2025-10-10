import type { AppCourseSubscription, AppStudent , AppCourse } from "~/types/app.types";

export const useStudentStore = defineStore('student', () => {
    const client = useSupabaseClient()
    const student = ref<AppStudent | null>(null);
    const subscriptions = ref<AppCourseSubscription[]>([]);
    const courses = ref<AppCourse[]>([]);
    const userStore = useUserStore();
    const userOrganizationsStore = useUserOrganizationsStore();
    const subscriptionStore = useSubscriptionStore();

    const selectedSubscription = computed(() => {
        const route = useRoute()
        const subscriptionId = route.params.s_id as string | undefined
        if (!subscriptionId) return null
        return subscriptions.value.find(s => s.id === subscriptionId) || null
    })

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
        try {
            const studentSubscriptions = await subscriptionStore.getSubscriptionsForStudent(org_id,student_id);
            subscriptions.value = studentSubscriptions;
        } catch (error) {
            console.error(error);
        }
    }

    const loadCourses = async (org_id: string) => {
        try {
            const { data, error } = await client
                .from('courses')
                .select('*')
                .eq('organization_id', org_id)
                .eq('is_active', true);

            if (error) {
                throw new Error(`Error loading courses: ${error.message}`);
            }
            courses.value = data || [];
        } catch (error) {
            console.error(error);
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization && userStore.user) {
            await loadStudent(userOrganizationsStore.selectedOrganization.id, userStore.user.id)
            await loadCourses(userOrganizationsStore.selectedOrganization.id)

            if (student.value) {
                await loadSubscriptions(userOrganizationsStore.selectedOrganization.id, student.value.id)
            }
        } else {
            student.value = null
            subscriptions.value = []
        }
    }, { immediate: true })

    return { student, subscriptions, courses, loadStudent, selectedSubscription }
});