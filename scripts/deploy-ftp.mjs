// Uploads dist/ to the FTP server. Credentials come from .env (never committed) or the environment.
//   npm run deploy            build for the domain root and upload
//   npm run deploy -- --dry   list what would be uploaded, touch nothing
//   npm run deploy -- --ls    connect and list the remote folder (read-only)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { Client } from 'basic-ftp';

if (fs.existsSync('.env')) process.loadEnvFile('.env');
const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_PORT, FTP_REMOTE_DIR = 'HTML_Public', FTP_SECURE = 'true' } = process.env;
const args = new Set(process.argv.slice(2));

for (const [k, v] of Object.entries({ FTP_HOST, FTP_USER, FTP_PASSWORD })) {
  if (!v) { console.error(`Missing ${k}. Fill it in .env (see .env.example).`); process.exit(1); }
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

const client = new Client(60_000);
try {
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    port: FTP_PORT ? Number(FTP_PORT) : undefined,
    secure: FTP_SECURE !== 'false',
    secureOptions: { rejectUnauthorized: false }, // shared hosts often present a certificate for the host's own name
  });
  console.log(`Connected to ${FTP_HOST} (${FTP_SECURE !== 'false' ? 'FTPS' : 'plain FTP – unencrypted'}).`);

  if (args.has('--ls')) {
    console.log('Remote root:', (await client.list()).map((f) => (f.isDirectory ? f.name + '/' : f.name)).join('  ') || '(empty)');
    await client.cd(FTP_REMOTE_DIR);
    console.log(`${FTP_REMOTE_DIR}:`, (await client.list()).map((f) => (f.isDirectory ? f.name + '/' : f.name)).join('  ') || '(empty)');
  } else {
    if (!args.has('--no-build')) {
      console.log('Building for the domain root…');
      execSync('npm run build', { stdio: 'inherit', env: { ...process.env, BASE_PATH: '/', SITE_URL: '' } });
    }
    const DIST = process.env.DIST_DIR || 'dist';
    const files = walk(DIST);
    if (args.has('--dry')) {
      console.log(`${files.length} files would be uploaded to ${FTP_REMOTE_DIR}/:`);
      files.slice(0, 15).forEach((f) => console.log('  ', path.relative(DIST, f)));
    } else {
      await client.ensureDir(FTP_REMOTE_DIR);
      await client.cd('/');
      let n = 0;
      for (const f of files) {
        const rel = path.relative(DIST, f).split(path.sep).join('/');
        const remote = `${FTP_REMOTE_DIR}/${rel}`;
        await client.ensureDir(path.posix.dirname(remote));
        await client.uploadFrom(f, path.posix.basename(remote));
        await client.cd('/');
        if (++n % 25 === 0) console.log(`  ${n}/${files.length}`);
      }
      console.log(`Done: ${n} files uploaded to ${FTP_REMOTE_DIR}/.`);
    }
  }
} catch (err) {
  console.error('FTP error:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
