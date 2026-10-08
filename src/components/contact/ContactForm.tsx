import { useState, type CSSProperties, type FormEvent } from 'react';
import { contactEmail, contactIntro, contactLayout, contactSubjects, messages, type ContactMessage } from '@/data/contact';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'invalid';

interface ContactFormProps {
  /** URL that receives the POST (multipart form data) and answers `{ ok: true }`. */
  endpoint: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidMessage = (m: ContactMessage) =>
  [m.firstName, m.lastName, m.subject, m.message].every((v) => v.trim().length > 0) && emailPattern.test(m.email.trim());

// Phones use the site's 16px body size (which also keeps iOS from zooming into a focused field) with 14px placeholders;
// desktop keeps the design.
const field =
  'block h-[50px] w-full rounded-[12px] border border-navy bg-transparent px-4 text-[16px] font-medium md:h-[59px] md:rounded-[15px] md:px-[19px] md:text-[18px] xl:text-[20px] leading-none text-black outline-none transition-shadow placeholder:text-black max-md:placeholder:text-[14px] focus:shadow-[0_0_0_3px_rgba(48,124,142,0.35)] xl:absolute xl:left-(--x) xl:top-(--y) xl:w-[696px]';

const at = (x: number, y: number, extra: Record<string, string> = {}) => ({ '--x': `${x}px`, '--y': `${y}px`, ...extra }) as CSSProperties;

export function ContactForm({ endpoint }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const { fields, textarea, submit, intro } = contactLayout;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '');
    const message: ContactMessage = {
      firstName: value('firstName'),
      lastName: value('lastName'),
      email: value('email'),
      phone: value('phone'),
      subject: value('subject'),
      message: value('message'),
    };
    if (!isValidMessage(message)) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data });
      const body = (await response.json()) as { ok?: boolean };
      if (!response.ok || !body.ok) throw new Error('rejected');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const note = status === 'success' ? messages.success : status === 'sending' ? messages.sending : status === 'invalid' ? messages.invalid : status === 'error' ? messages.error : '';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact form"
      className="relative mx-auto flex max-w-[1623px] flex-col gap-8 px-6 py-12 md:grid md:grid-cols-[2fr_3fr] md:items-start md:gap-x-12 md:px-10 md:py-20 lg:gap-x-20 xl:block xl:h-[1174px] xl:p-0"
    >
      <p
        className="m-0 max-w-[520px] text-[16px] font-medium leading-normal text-black md:pt-3 md:text-[19px] xl:absolute xl:left-(--x) xl:top-(--y) xl:w-(--w) xl:max-w-none xl:text-[20px] xl:leading-[24.7px]"
        style={at(intro.x, intro.y, { '--w': `${intro.w}px` })}
      >
        {contactIntro}
      </p>

      <div className="flex flex-col gap-4 md:gap-5 xl:contents">
        <label className="contents">
          <span className="sr-only">First name</span>
          <input name="firstName" type="text" autoComplete="given-name" placeholder="First Name" required className={field} style={at(fields[0].x, fields[0].y)} />
        </label>
        <label className="contents">
          <span className="sr-only">Last name</span>
          <input name="lastName" type="text" autoComplete="family-name" placeholder="Last Name" required className={field} style={at(fields[1].x, fields[1].y)} />
        </label>
        <label className="contents">
          <span className="sr-only">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="Email" required className={field} style={at(fields[2].x, fields[2].y)} />
        </label>
        <label className="contents">
          <span className="sr-only">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={field} style={at(fields[3].x, fields[3].y)} />
        </label>
        <label className="contents">
          <span className="sr-only">Subject</span>
          <select
            name="subject"
            required
            defaultValue=""
            className={cn(field, 'cursor-pointer appearance-none bg-[length:14px_8px] bg-[position:right_16px_center] md:bg-[position:right_20px_center] bg-no-repeat invalid:text-black max-md:invalid:text-[14px]')}
            style={{ ...at(fields[4].x, fields[4].y), backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' fill='none'%3E%3Cpath d='m1 1 6 6 6-6' stroke='%230d3147' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")" }}
          >
            <option value="" disabled>
              Subject
            </option>
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="contents">
          <span className="sr-only">Request details</span>
          <textarea
            name="message"
            placeholder="Enter the details of your request here"
            required
            className={cn(field, 'h-[180px] resize-none py-3 leading-normal md:h-[236px] md:py-[14px] xl:h-(--h)')}
            style={at(textarea.x, textarea.y, { '--h': `${textarea.h}px` })}
          />
        </label>

        {/* Honeypot: invisible to people, bots fill it in and the server drops the message. */}
        <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

        <div className="xl:absolute xl:left-(--x) xl:top-(--y)" style={at(submit.x, submit.y)}>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="cta inline-flex h-[44px] w-[187px] cursor-pointer items-center justify-center rounded-[10px] border-0 bg-navy p-0 text-[16px] font-medium md:text-[20px] leading-none text-white hover:shadow-[0_10px_22px_rgba(13,49,71,0.3)] disabled:cursor-wait disabled:opacity-70"
          >
            Submit request
          </button>
          <p role="status" aria-live="polite" className={cn('mt-4 max-w-[520px] text-[15px] font-medium leading-snug md:text-[16px]', status === 'success' ? 'text-green' : status === 'idle' || status === 'sending' ? 'text-navy' : 'text-[#9a1c1c]', !note && 'hidden')}>
            {note}
            {status === 'error' ? (
              <>
                {' '}
                <a href={`mailto:${contactEmail}`} className="sr-only">
                  {contactEmail}
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </form>
  );
}
