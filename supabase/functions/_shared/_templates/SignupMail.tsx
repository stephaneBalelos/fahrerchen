import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from 'npm:@react-email/components';
import { main, container, box, heading, paragraph, button, anchor, hr, footer } from './styles/index.ts';
import * as React from 'npm:react@18.3.1'

interface SignupMailProps {
    lang: string
    username: string
    call_to_action_url: string
}

/** Translations of the text for English */
const translationsEn = {
    preview_text: 'Confirm your email address',
    heading: 'Welcome to Karjolen',
    message: (username: string) =>
        `Hi ${username}, thanks for signing up with Karjolen. Please confirm your email address to gain full access.`,
    call_to_action: 'Confirm your email address',
    usefull_links: 'Here are some useful links to get you started:',
    usefull_links_list: [
        {
            label: 'Getting started with Karjolen',
            href: 'https://karjolen.de/docs/getting-started',
        },
        {
            label: 'Karjolen documentation',
            href: 'https://karjolen.com/docs',
        },
        {
            label: 'Karjolen support',
            href: 'https://karjolen.com/support',
        },
    ],
    footer_text: '- The Karjolen team',
    footer: 'Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Germany',
}

/** Translations of the text for German */
const translationsDe = {
    preview_text: 'Bestätigen Sie Ihre E-Mail-Adresse',
    heading: 'Willkommen bei der Karjolen App',
    message: (username: string) =>
        `Hallo ${username}, vielen Dank für Ihre Anmeldung bei der Karjolen App. Bitte bestätigen Sie Ihre E-Mail-Adresse, um vollen Zugriff zu erhalten.`,
    call_to_action: 'Bestätigen Sie Ihre E-Mail-Adresse',
    usefull_links: 'Hier sind einige nützliche Links, um Ihnen den Einstieg zu erleichtern:',
    usefull_links_list: [
        {
            label: 'Erste Schritte mit Karjolen',
            href: 'https://karjolen.de/docs/getting-started',
        },
        {
            label: 'Karjolen Dokumentation',
            href: 'https://karjolen.com/docs',
        },
        {
            label: 'Karjolen Support',
            href: 'https://karjolen.com/support',
        },
    ],
    footer_text: '- Das Karjolen-Team',
    footer: 'Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Deutschland',
}

export const SignupMail = ({
    lang,
    username,
    call_to_action_url
}: SignupMailProps) => {
    const $t = lang.includes('de') ? translationsDe : translationsEn
    const baseUrl = Deno.env.get('BASE_URL') || 'https://localhost:3000'
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>{$t.preview_text}</Preview>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="48"
                            height="48"
                            style={{borderRadius: '6px  '}}
                            alt="Karjolen Logo"
                        />
                        <Text style={heading}>{$t.heading}</Text>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            {$t.message(username)}
                        </Text>
                        <Button style={button} href={call_to_action_url}>
                            {$t.call_to_action}
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            {$t.usefull_links}
                        </Text>
                       {$t.usefull_links_list.map((link) => (
                            <Text key={link.href}>
                                <Link style={anchor} href={link.href}>
                                    {link.label}
                                </Link>
                            </Text>
                        ))}
                        <Text style={paragraph}>
                            {$t.footer_text}
                        </Text>
                        <Hr style={hr} />
                        <Text style={footer}>
                            {$t.footer}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default SignupMail

