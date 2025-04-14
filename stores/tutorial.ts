

type TutorialStepKey = 
    'school_information' | 
    'course_create' | 
    'course_activity_create' |
    'course_document_create' |
    'enable_payment' |
    'course_student_invite' |
    'course_student_enroll' |
    'activity_schedule_create' |
    'activity_schedule_attendance' |
    'invoice_create' |
    'invoice_send' |
    'tutorial_continue_as_student' |
    'tutorial_complete'
;


type TutorialStep = {
    id: TutorialStepKey;
    completed: boolean;
    show_complete_button?: boolean;
}

const tutorial_steps: TutorialStep[] = [
    { id: 'school_information', completed: false },
    { id: 'course_create', completed: false },
    { id: 'course_activity_create', completed: false },
    { id: 'course_document_create', completed: false },
    { id: 'enable_payment', completed: false },
    { id: 'course_student_invite', completed: false },
    { id: 'course_student_enroll', completed: false },
    { id: 'activity_schedule_create', completed: false },
    { id: 'activity_schedule_attendance', completed: false },
    { id: 'invoice_create', completed: false },
    { id: 'invoice_send', completed: false },
    { id: 'tutorial_continue_as_student', completed: false },
    { id: 'tutorial_complete', completed: false, show_complete_button: true },
]

export const useTutorialStore = defineStore('tutorial', () => {

    const userStore = useUserStore();
    const client = useSupabaseClient();

    const steps = ref<TutorialStep[]>([]);
    const currentStep = ref<TutorialStep | null>(null);

    function setCurrentStep(step_id: TutorialStepKey) {
        const step = steps.value.find(step => step.id === step_id);
        if (!step) {
            return;
        }
        currentStep.value = step;
    }

    function completeStep(step_id: TutorialStepKey) {
        const index = steps.value.findIndex(step => step.id === step_id);
        if (index === -1) {
            return;
        }

        // Check if previous step is completed
        const previousStep = steps.value[index - 1];
        
        if (!previousStep || (previousStep && previousStep.completed)) {

            steps.value[index].completed = true;
            userStore.updateUser({ tutorial_data: steps.value });

            if (index + 1 < steps.value.length) {
                setCurrentStep(steps.value[index + 1].id);
            } else {
                currentStep.value = null;
            }
        }
    }

    const completedSteps = computed(() => steps.value.filter(step => step.completed));

    const progress = computed(() => {
        return (completedSteps.value.length / steps.value.length) * 100;
    })

    async function initTutorial(user_id: string) {
        const { data, error } = await client.from('users').select('tutorial_data').eq('id', user_id).single();
        const t_data = data?.tutorial_data as TutorialStep[];
        if (error) {
            console.error(error);
            return;
        }
        if (t_data && t_data.length > 0) {
            steps.value = data.tutorial_data as TutorialStep[];
        } else {
            steps.value = tutorial_steps;
            await userStore.updateUser({ tutorial_data: steps.value });
        }

        currentStep.value = steps.value.find(step => !step.completed) || null;
    }



    return { steps, currentStep, setCurrentStep, completeStep, initTutorial, completedSteps, progress }

});