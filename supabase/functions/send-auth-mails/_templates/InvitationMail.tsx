import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Section,
    Img,
    Tailwind,
    Button,
} from 'npm:@react-email/components'
import * as React from 'npm:react@18.3.1'
import tailwindConfig from './tailwindConfig.ts'

interface InviteMailProps {
    username: string
    org_name: string
    lang: string
    supabase_url: string
    email_action_type: string
    redirect_to: string
    token_hash: string
    baseUrl: string
}

/** Translations of the text for English */
const translationsEn = {
    preview_text: "You have been invited to Fahrerchen",
    h1: (username: string, org_name: string) => `Hi ${username}! Join ${org_name} on Fahrerchen`,
    invitation_msg: (username: string, org_name: string) => `Hi ${username}, you have been invited to join ${org_name} on Fahrerchen.`,
    click_here: (org_name: string) => `Click here to join ${org_name}`,
    if_you_did_not_request: 'When you did not expect this email, there is no reason to worry, you can safely ignore it.',
    blog: 'Our blog',
    policies: 'Policies',
    help_center: 'Help center',
    community: 'Community',
}

/** Translations of the text for German */
const translationsDe = {
    preview_text: "Sie wurden zu Fahrerchen eingeladen",
    h1: (username: string, org_name: string) => `Hallo ${username}! Treten Sie ${org_name} bei Fahrerchen bei`,
    invitation_msg: (username: string, org_name: string) => `Hallo ${username}, Sie wurden eingeladen, ${org_name} auf Fahrerchen beizutreten.`,
    click_here: (org_name: string) => `Klicken Sie hier, um ${org_name} beizutreten`,
    if_you_did_not_request: 'Wenn Sie diese E-Mail nicht erwartet haben, gibt es keinen Grund zur Sorge, Sie können sie sicher ignorieren.',
    blog: 'Unser Blog',
    policies: 'Richtlinien',
    help_center: 'Hilfe-Center',
    community: 'Community',
}

export const SignupMail = ({
    username,
    org_name,
    lang,
    supabase_url,
    email_action_type,
    redirect_to,
    token_hash,
    baseUrl = "https://fahrerchen.stephanedondyas.dev"
}: InviteMailProps) => {
    const translations = lang.includes('de') ? translationsDe : translationsEn

    return (
        <Html>
            <Preview>{translations.preview_text}</Preview>
            <Tailwind config={tailwindConfig}>
                <Head />
                <Body className="bg-gray my-auto mx-auto font-sans px-2">
                    <Container className="mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${baseUrl}/android-chrome-512x512.png`}
                                width="40"
                                height="37"
                                alt="Fahrerchen"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            {translations.h1(username, org_name)}
                        </Heading>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Text>{translations.invitation_msg(username, org_name)}</Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-primary rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${supabase_url}?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
                            >
                                {translations.click_here(org_name)}
                            </Button>
                        </Section>
                        <Section>
                            <Link
                                className="text-primary font-medium"
                                href="https://fahrerchen.stephanedondyas.dev/blog"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {translations.blog}
                            </Link>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            <Link
                                className="text-primary font-medium"
                                href="https://fahrerchen.stephanedondyas.dev/legal"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {translations.policies}
                            </Link>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            <Link
                                className="text-primary font-medium"
                                href="https://fahrerchen.stephanedondyas.dev/help"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {translations.help_center}
                            </Link>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            <Link
                                className="text-primary font-medium"
                                href="https://fahrerchen.stephanedondyas.dev/community"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-auth="NotApplicable"
                                data-linkindex="6"
                            >
                                {translations.community}
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
SignupMail.PreviewProps = {
    username: 'dshukertjr',
    org_name: 'Fahrerchen',
    supabase_url: 'https://123.supabase.co',
    email_action_type: 'confirm',
    redirect_to: 'https://fahrerchen.stephanedondyas.dev',
    token_hash: '123456',
} as InviteMailProps

export default SignupMail
