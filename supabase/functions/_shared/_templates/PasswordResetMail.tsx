import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Button,
  Preview,
  Section,
  Img,
  Tailwind
} from 'npm:@react-email/components'
import * as React from 'npm:react@18.3.1'
import tailwindConfig from './tailwindConfig.ts';

interface PasswordResetProps {
  username: string
  lang: string
  token: string
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  baseUrl: string
}

/** Translations of the text for English */
const translationsEn = {
  reset_password: "Reset your password",
  h1: (username: string) => `Hi ${username}! Did you forget your password?`,
  click_here: 'Click here to reset your password',
  if_you_did_not_request:
    'If you did not request this email, there is nothing to worry about, you can safely ignore it.',
  blog: 'Our blog',
  policies: 'Policies',
  help_center: 'Help center',
  community: 'Community',
}

/** Translations of the text for German */
const translationsDe = {
  reset_password: 'Passwort zurücksetzen',
  h1: (username: string) => `Hallo ${username}! Haben Sie Ihr Passwort vergessen?`,
  click_here: 'Klicken Sie hier, um Ihr Passwort zurückzusetzen',
  if_you_did_not_request:
    'Wenn Sie diese E-Mail nicht angefordert haben, gibt es keinen Grund zur Sorge, Sie können sie sicher ignorieren.',
  blog: 'Unser Blog',
  policies: 'Richtlinien',
  help_center: 'Hilfe-Center',
  community: 'Community',
}

export const PasswordReset = ({
  lang,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  username,
  baseUrl = "https://fahrerchen.stephanedondyas.dev",
}: PasswordResetProps) => {
  const translations = lang.includes('de') ? translationsDe : translationsEn

  return (
    <Html>
      <Preview>{translations.reset_password}</Preview>
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
              {translations.h1(username)}
            </Heading>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-primary rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`${supabase_url}?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              >
                {translations.click_here}
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
PasswordReset.PreviewProps = {
  username: 'dshukertjr',
  token: '123456',
  supabase_url: 'https://123.supabase.co',
  email_action_type: 'confirm',
  redirect_to: 'https://fahrerchen.stephanedondyas.dev',
  token_hash: '123456',
} as PasswordResetProps

export default PasswordReset
