<?php
/**
 * Contact form endpoint: validates the POST sent by ContactForm.tsx and e-mails it to the company.
 * Runs on the cPanel hosting (PHP mail()). Change RECIPIENT to redirect the messages.
 */
const RECIPIENT = 'info@edcsupplyllc.com';
const MIN_SECONDS_BETWEEN_MESSAGES = 30;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, bool $ok, string $error = ''): void {
    http_response_code($status);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    exit;
}

/** One line, no control characters: keeps user input out of the mail headers. */
function line(string $value, int $max = 200): string {
    $value = preg_replace('/[\r\n\t\0]+/', ' ', $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(405, false, 'method');

// Only accept posts coming from this same site.
$host = preg_replace('/^www\./', '', strtolower($_SERVER['HTTP_HOST'] ?? ''));
$origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '', PHP_URL_HOST);
if ($origin && preg_replace('/^www\./', '', strtolower($origin)) !== $host) respond(403, false, 'origin');

// Honeypot: real visitors never see this field. Answer "ok" so bots do not retry.
if (trim($_POST['website'] ?? '') !== '') respond(200, true);

$first = line($_POST['firstName'] ?? '', 80);
$last = line($_POST['lastName'] ?? '', 80);
$email = line($_POST['email'] ?? '', 160);
$phone = line($_POST['phone'] ?? '', 40);
$subject = line($_POST['subject'] ?? '', 80);
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

$allowed = ['Quote', 'Request for information', 'Technical support', 'Complaint', 'Suggestion', 'Other'];
if ($first === '' || $last === '' || $message === '' || !in_array($subject, $allowed, true) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'invalid');
}

// Basic throttle per visitor.
$stamp = sys_get_temp_dir() . '/edc-contact-' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (is_file($stamp) && time() - (int)filemtime($stamp) < MIN_SECONDS_BETWEEN_MESSAGES) respond(429, false, 'slow-down');

$from = 'no-reply@' . ($host !== '' ? $host : 'edcsupplyllc.com');
$body = "New message from the website contact form\r\n\r\n"
    . "Name:    $first $last\r\n"
    . "Email:   $email\r\n"
    . "Phone:   " . ($phone !== '' ? $phone : '-') . "\r\n"
    . "Subject: $subject\r\n\r\n"
    . str_replace(["\r\n", "\r"], "\n", $message) . "\r\n";

$headers = [
    'From: EDC Supply Website <' . $from . '>',
    'Reply-To: ' . $first . ' ' . $last . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: EDC Supply contact form',
];

$sent = mail(RECIPIENT, '=?UTF-8?B?' . base64_encode("[Website] $subject – $first $last") . '?=', $body, implode("\r\n", $headers), '-f' . $from);
if (!$sent) respond(500, false, 'mail');

@touch($stamp);
respond(200, true);
