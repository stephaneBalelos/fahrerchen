import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from 'npm:@react-email/components';
import { main, container, box, heading, paragraph, hr, footer } from './styles/index.ts';
import * as React from 'npm:react@18.3.1'
import { translator } from '../utils.ts';

interface NewSubscriptionMailProps {
    student_name: string
    organization_name: string
    lang: string
}

/** Translations of the text for German */
const translationsDe = {
    preview_text: `Es ist Zeit, deinen Führerschein zu machen!`,
    h1: `Es ist Zeit, deinen Führerschein zu machen!`,
    message: `Hallo {0}, dein Fahrschule {1} hat dich für einen neuen Kurs angemeldet. Wie geht es weiter? 
    Dein Fahrlehrer wird sich in Kürze mit dir in Verbindung setzen, um die nächsten Schritte zu besprechen.`,
    bottom_text: `Falls du diese E-Mail nicht angefordert oder erwartet hast, ignoriere sie bitte.`,
    footer_text: `- Das Karjolen-Team`,
    footer: `Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Deutschland`
}

/** Translations of the text for English */
const translationsEn = {
    preview_text: `It's time to get your driver's license!`,
    h1: `It's time to get your driver's license!`,
    message: `Hi {0}, your driving school {1} has enrolled you in a new course. What's next?
    Your driving instructor will contact you shortly to discuss the next steps.`,
    bottom_text: `If you did not request or expect this email, please ignore it.`,
    footer_text: `- The Karjolen Team`,
    footer: `Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Germany`
}

export const NewSubscriptionEmail = ({
    student_name,
    organization_name,
    lang,

}: NewSubscriptionMailProps) => {
    const $t = translator(translationsEn, translationsDe, lang)
    const baseUrl = Deno.env.get('BASE_URL') || 'https://localhost:3000'

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>{$t('preview_text')}</Preview>
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
                            {$t('message', student_name, organization_name)}
                        </Text>
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

export default NewSubscriptionEmail;

export const NewSubscriptionEmailSubject = (organization_name: string) => `${organization_name} via Karjolen App`;
