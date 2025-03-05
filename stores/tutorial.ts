import type { Database } from "~/types/app.types";

type TutorialStep = {
    id: string;
    completed: boolean;
}

const tutorial_steps: TutorialStep[] = [
    {
        id: 'step-1',
        completed: false
    },
    {
        id: 'step-2',
        completed: false
    },
    {
        id: 'step-3',
        completed: false
    },
    {
        id: 'step-4',
        completed: false
    },
    {
        id: 'step-5',
        completed: false
    },
    {
        id: 'step-6',
        completed: false
    },
    {
        id: 'step-7',
        completed: false
    },
    {
        id: 'step-8',
        completed: false
    },
    {
        id: 'step-9',
        completed: false
    },
    {
        id: 'step-10',
        completed: false
    },
    {
        id: 'step-11',
        completed: false
    },
    {
        id: 'step-12',
        completed: false
    },
    {
        id: 'step-13',
        completed: false
    }
]

export const useTutorialStore = defineStore('tutorial', () => {

    const userStore = useUserStore();
    const client = useSupabaseClient<Database>();

    const steps = ref<TutorialStep[]>([]);
    const currentStep = ref<TutorialStep | null>(null);

    function setCurrentStep(step_id: string) {
        const step = steps.value.find(step => step.id === step_id);
        if (!step) {
            return;
        }
        currentStep.value = step;
    }

    function completeStep(step_id: string) {
        const step = steps.value.find(step => step.id === step_id);
        if (!step) {
            return;
        }
        step.completed = true;
        userStore.updateUser({ tutorial_data: steps.value });
    }

    const completedSteps = computed(() => steps.value.filter(step => step.completed));

    const progress = computed(() => {
        return (completedSteps.value.length / steps.value.length) * 100;
    })

    async function initTutorial(user_id: string) {
        console.log('init tutorial');
        const { data, error } = await client.from('users').select('tutorial_data').eq('id', user_id).single();
        const t_data = data?.tutorial_data as TutorialStep[];
        if(error) {
            console.error(error);
            return;
        }
        if (t_data && t_data.length > 0) {
            steps.value = data.tutorial_data as TutorialStep[];
        } else {
            steps.value = tutorial_steps;
            await userStore.updateUser({ tutorial_data: steps.value });
        }
    }



    return { steps, currentStep, setCurrentStep, completeStep, initTutorial, completedSteps, progress }

});