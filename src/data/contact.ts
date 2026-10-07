/** Where the form posts to. A small PHP script on the company hosting (public/api/contact.php) sends the e-mail. */
export const contactEndpoint = '/api/contact.php';

/** Address shown as a fallback when the message cannot be sent (the real recipient lives in contact.php). */
export const contactEmail = 'info@edcsupplyllc.com';

export const contactHero = { title: 'CONTACT US' } as const;

export const contactIntro = 'Contact EDC Supply to discuss your application, request product information or obtain a quotation.';

/** Options of the "Subject" dropdown (Figma comment). */
export const contactSubjects = ['Quote', 'Request for information', 'Technical support', 'Complaint', 'Suggestion', 'Other'] as const;
export type ContactSubject = (typeof contactSubjects)[number];

export interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/** Field boxes on the 1623px frame, relative to the top of the form section (x drifts 1px per row in the design). */
export const contactLayout = {
  intro: { x: 115, y: 270, w: 520 },
  fields: [
    { x: 749, y: 263 },
    { x: 749, y: 354 },
    { x: 750, y: 445 },
    { x: 751, y: 535 },
    { x: 752, y: 626 },
  ],
  textarea: { x: 753, y: 718, h: 236 },
  submit: { x: 756, y: 986 },
  field: { w: 696, h: 59 },
} as const;

export const messages = {
  sending: 'Sending…',
  success: 'Thank you! Your message has been sent. Our team will get back to you shortly.',
  error: `We could not send your message. Please try again or write to us at ${contactEmail}.`,
  invalid: 'Please complete the required fields with a valid e-mail address.',
} as const;
