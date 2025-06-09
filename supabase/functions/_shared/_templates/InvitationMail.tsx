import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from 'npm:@react-email/components';
import { main, container, box, heading, paragraph, button, hr, footer } from './styles/index.ts';
import * as React from 'npm:react@18.3.1'
import { translator } from '../utils.ts';

interface InviteMailProps {
    user_email: string
    organization_name: string
    lang: string
    role: string
    call_to_action_url: string
}

/** Translations of the text for German */
const translationsDe = {
    preview_text: `Du wurdest zu {0} auf Karjolen eingeladen`,
    h1: `Einladung zu {0} auf Karjolen`,
    invitation_msg_staff: `Hallo {0}, du wurdest eingeladen, {1} auf Karjolen beizutreten.`,
    invitation_msg_student: `Hallo {0}, es ist Zeit, deinen Führerschein zu machen! {1} hat dich eingeladen, dich auf Karjolen anzumelden.`,
    click_here: `Hier klicken, um dich anzumelden`,
    bottom_text: `Falls du diese E-Mail nicht angefordert hast, ignoriere sie bitte.`,
    footer_text: `- Das Karjolen-Team`,
    footer: `Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Deutschland`
}

/** Translations of the text for English */
const translationsEn = {
    preview_text: `You have been invited to {0} on Karjolen`,
    h1: `Invitation to {0} on Karjolen`,
    invitation_msg_staff: `Hi {0}, you have been invited to join {1} on Karjolen.`,
    invitation_msg_student: `Hi {0}, it's time to get your driver's license! {1} has invited you to sign up on Karjolen.`,
    click_here: `Click here to sign up`,
    bottom_text: `If you did not request this email, please ignore it.`,
    footer_text: `- The Karjolen team`,
    footer: `Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Germany`
}

export const InvitationEmail = ({
    user_email,
    organization_name,
    lang,
    role,
    call_to_action_url

}: InviteMailProps) => {
    const $t = translator(translationsEn, translationsDe, lang)
    const baseUrl = Deno.env.get('BASE_URL') || 'https://localhost:3000'

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>{$t('preview_text', organization_name)}</Preview>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="48"
                            height="48"
                            style={{ borderRadius: '6px  ' }}
                            alt="Karjolen Logo"
                        />
                        <Text style={heading}>{$t('h1', organization_name)}</Text>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            {$t(`invitation_msg_${role === 'student' ? 'student' : 'staff'}`, user_email, organization_name)}
                        </Text>
                        <Button style={button} href={`${call_to_action_url}`}>
                            {$t('click_here', organization_name)}
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            {$t('bottom_text')}
                        </Text>
                        <Text style={paragraph}>
                            {$t('footer_text')}
                        </Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            {$t('footer')}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default InvitationEmail
