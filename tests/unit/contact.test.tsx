import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactForm, isValidMessage } from '@/components/contact/ContactForm';
import { contactEmail, contactSubjects, messages } from '@/data/contact';

const fill = async () => {
  await userEvent.type(screen.getByPlaceholderText('First Name'), 'Ada');
  await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Lovelace');
  await userEvent.type(screen.getByPlaceholderText('Email'), 'ada@example.com');
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Subject' }), 'Quote');
  await userEvent.type(screen.getByPlaceholderText('Enter the details of your request here'), 'Need a harmonic filter.');
};

afterEach(() => vi.unstubAllGlobals());

describe('contact data', () => {
  it('offers the subjects requested in the design review', () => {
    expect(contactSubjects).toEqual(['Quote', 'Request for information', 'Technical support', 'Complaint', 'Suggestion', 'Other']);
  });
});

describe('isValidMessage', () => {
  const ok = { firstName: 'A', lastName: 'B', email: 'a@b.co', phone: '', subject: 'Quote', message: 'Hi' };
  it('accepts a complete message without phone', () => expect(isValidMessage(ok)).toBe(true));
  it('rejects a bad e-mail or empty required fields', () => {
    expect(isValidMessage({ ...ok, email: 'nope' })).toBe(false);
    expect(isValidMessage({ ...ok, message: '  ' })).toBe(false);
    expect(isValidMessage({ ...ok, subject: '' })).toBe(false);
  });
});

describe('ContactForm', () => {
  it('does not call the server while required fields are missing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm endpoint="/api/contact.php" />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(messages.invalid);
  });

  it('posts the form to the endpoint and confirms', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm endpoint="/nuevo/api/contact.php" />);
    await fill();
    await userEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(messages.success));
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/nuevo/api/contact.php');
    const body = init.body as FormData;
    expect(body.get('email')).toBe('ada@example.com');
    expect(body.get('subject')).toBe('Quote');
    expect(screen.getByPlaceholderText('First Name')).toHaveValue('');
  });

  it('shows the fallback address when the server fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<ContactForm endpoint="/api/contact.php" />);
    await fill();
    await userEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(contactEmail));
    expect(screen.getByPlaceholderText('First Name')).toHaveValue('Ada');
  });
});
