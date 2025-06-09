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

interface PasswordResetProps {
  lang: string
  username: string
  call_to_action_url: string
}

/** Translations of the text for German */
const translationsDe = {
  preview_text: 'Passwort zurücksetzen bei der Karjolen App',
  heading: 'Passwort zurücksetzen bei Karjolen',
  message: (username: string) =>
    `Hallo ${username}, Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts bei Karjolen gestellt. Bitte klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen.`,
  call_to_action: 'Passwort zurücksetzen',
  bottom_text: 'Falls sie diese E-Mail nicht angefordert haben, ignorieren Sie sie bitte. Ihr Passwort bleibt unverändert.',
  footer_text: '- Das Karjolen-Team',
  footer: 'Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Deutschland',
}

/** Translations of the text for English */
const translationsEn = {
  preview_text: 'Reset your password at Karjolen',
  heading: 'Reset your password at Karjolen',
  message: (username: string) =>
    `Hi ${username}, you requested a password reset for your Karjolen account. Please click the link below to reset your password.`,
  call_to_action: 'Reset your password',
  bottom_text: 'If you did not request this email, please ignore it. Your password remains unchanged.',
  footer_text: '- The Karjolen team',
  footer: 'Karjolen App, Weserstraße 108, 26382 Wilhelmshaven, Germany',
}


export const PasswordReset = ({
  lang,
  username,
  call_to_action_url
}: PasswordResetProps) => {
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
              style={{ borderRadius: '6px  ' }}
              alt="Karjolen Logo"
            />
            <Text style={heading}>{$t.heading}</Text>
            <Hr style={hr} />
            <Text style={paragraph}>
              {$t.message(username)}
            </Text>
            <Button style={button} href={`${call_to_action_url}`}>
              {$t.call_to_action}
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              {$t.bottom_text}
            </Text>
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

export default PasswordReset
