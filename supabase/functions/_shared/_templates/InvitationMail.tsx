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
    Row,
    Column,
    Img,
    Tailwind,
    Button,
} from 'npm:@react-email/components'
import * as React from 'npm:react@18.3.1'
import tailwindConfig from './tailwindConfig.ts'
import { translator } from '../utils.ts';

interface InviteMailProps {
    user_email: string
    organization_name: string
    lang: string
    url_base: string
    role: string
    call_to_action_url: string
}

/** Translations of the text for English */
const translationsEn = {
    preview_text: `You've been invited to {0} on Fahrerchen`,
    h1: `Hello, welcome to {0} on Fahrerchen`,
    invitation_msg_staff: `Hello {0}, you've been invited to join {1} on Fahrerchen.`,
    invitation_msg_student: `Hello {0}, it's time to get your driver's license. {1} has invited you to sign up on Fahrerchen.`,
    click_here: `Get started with {0}`,
    if_you_did_not_request: 'If you did not expect this email, there is no need to worry, you can safely ignore it.',
    blog: 'Our Blog',
    policies: 'Policies',
    help_center: 'Help Center',
    community: 'Community',
}

/** Translations of the text for German */
const translationsDe = {
    preview_text: `Du wurdest zu {0} auf Fahrerchen eingeladen`,
    h1: `Hallo, willkommen zu {0} auf Fahrerchen`,
    invitation_msg_staff: `Hallo {0}, du wurdest eingeladen, {1} auf Fahrerchen beizutreten.`,
    invitation_msg_student: `Hallo {0}, es ist Zeit, deinen Führerschein zu machen. {1} hat dich eingeladen, dich auf Fahrerchen anzumelden.`,
    click_here: `Los geht's mit {0}`,
    if_you_did_not_request: 'Wenn du diese E-Mail nicht erwartet hast, gibt es keinen Grund zur Sorge, du kannst sie sicher ignorieren.',
    blog: 'Unser Blog',
    policies: 'Richtlinien',
    help_center: 'Hilfe-Center',
    community: 'Community',
}

export const InvitationEmail = ({
    user_email,
    organization_name,
    lang,
    url_base,
    role,
    call_to_action_url

}: InviteMailProps) => {
    const t = translator(translationsEn, translationsDe, lang)

    return (
        <Html>
            <Preview>{t('preview_text', organization_name)}</Preview>
            <Tailwind config={tailwindConfig}>
                <Head />
                <Body className="bg-gray text-white my-auto mx-auto font-sans px-2">
                    <Container className="mx-auto flex justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${url_base}/android-chrome-512x512.png`}
                                width="40"
                                height="37"
                                alt="Fahrerchen"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-white text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            {t('h1', organization_name)}
                        </Heading>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Text>{t(`invitation_msg_${role === 'student' ? 'student' : 'staff'}`, user_email, organization_name)}</Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-primary rounded text-gray text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={call_to_action_url}
                            >
                                {t('click_here', organization_name)}
                            </Button>
                        </Section>
                        <Section >
                            <Row>
                                <Column>
                                    <Link
                                        className="text-primary font-medium"
                                        href="https://fahrerchen.stephanedondyas.dev/blog"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('blog')}
                                    </Link>
                                </Column>

                                <Column>
                                    <Link
                                        className="text-primary font-medium"
                                        href="https://fahrerchen.stephanedondyas.dev/legal"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('policies')}
                                    </Link>
                                </Column>

                                <Column>
                                    <Link
                                        className="text-primary font-medium"
                                        href="https://fahrerchen.stephanedondyas.dev/help"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('help_center')}
                                    </Link>
                                </Column>

                                <Column>
                                    <Link
                                        className="text-primary font-medium"
                                        href="https://fahrerchen.stephanedondyas.dev/community"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('community')}
                                    </Link>
                                </Column>
                            </Row>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default InvitationEmail
