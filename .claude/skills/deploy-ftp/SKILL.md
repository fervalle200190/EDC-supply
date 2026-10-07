---
name: deploy-ftp
description: Sube el sitio EDC Supply (Astro, build estático) al servidor FTP de edcsupplyllc.com. Úsala cuando pidan publicar, subir o desplegar la web por FTP, probar la conexión al servidor o ver qué hay publicado. No aplica al despliegue de GitHub Pages (eso lo hace el workflow solo al hacer push a main).
---

# Desplegar por FTP a edcsupplyllc.com

El sitio es estático: `npm run build` genera `dist/` y esa carpeta se sube tal cual. El script `scripts/deploy-ftp.mjs` hace el build y la subida.

## Reglas de seguridad (leer primero)

- **Nunca leas, imprimas ni repitas los valores del `.env`** (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`). Para revisar qué variables existen usa solo los nombres:
  `sed -E 's/=.*$//; /^\s*(#|$)/d' .env`
- `.env` está en `.gitignore`. Comprueba con `git check-ignore -v .env` antes de cualquier commit, y no hagas `git add -A` / `git add .` sin revisar `git status`: el repo de GitHub es **público**.
- Las credenciales no van en el chat, el código, el README ni un commit. Si faltan, pide al usuario que las ponga en `.env` (plantilla: `.env.example`).
- Subir al servidor es una acción externa y difícil de revertir: **pide confirmación explícita antes de `npm run deploy` sin `--dry`**, y di en qué carpeta remota va a escribir.
- Recomienda cambiar la contraseña FTP (o desactivar la cuenta) cuando termine el proyecto.

## Variables (`.env`)

| Variable | Obligatoria | Notas |
|---|---|---|
| `FTP_HOST` | sí | `ftp.edcsupplyllc.com` |
| `FTP_USER` | sí | idealmente una cuenta FTP solo para este sitio |
| `FTP_PASSWORD` | sí | |
| `FTP_REMOTE_DIR` | no | carpeta destino; por defecto `HTML_Public` (**no existe** en el servidor, ver abajo) |
| `FTP_PORT` | no | por defecto el estándar (21) |
| `FTP_SECURE` | no | `true` (FTPS explícito) por defecto; `false` solo si el servidor no tiene TLS (envía la contraseña en claro) |

## Comandos

```bash
npm run deploy -- --ls        # conecta y lista la raíz y FTP_REMOTE_DIR (solo lectura)
npm run deploy -- --dry       # compila y muestra qué subiría, sin tocar el servidor
npm run deploy                # compila para la raíz del dominio y SUBE (pedir confirmación)
npm run deploy -- --no-build  # sube el dist/ que ya existe
FTP_REMOTE_DIR=public_html/nuevo npm run deploy -- --dry   # probar otra carpeta sin editar .env
```

El build para FTP usa `BASE_PATH=/` (raíz del dominio). El despliegue de GitHub Pages usa `BASE_PATH=/EDC-supply`; no mezclar: un `dist/` compilado para Pages no funciona en el dominio. Si el sitio va en una subcarpeta (p. ej. `edcsupplyllc.com/nuevo/`), compilar con `BASE_PATH=/nuevo` y subir a esa carpeta:

```bash
BASE_PATH=/nuevo npm run build
FTP_REMOTE_DIR=public_html/nuevo npm run deploy -- --no-build
```

## Qué hay en el servidor (revisado con `--ls`, solo lectura)

- Es un cPanel. La raíz de la cuenta tiene `public_html/`, `www`, `logs/`, `ssl/`, `wordpress-backups/`, etc. **`HTML_Public` no existe**: la carpeta web real es `public_html/`.
- `public_html/` contiene un **WordPress en producción** (`index.php`, `wp-cron.php`, `.htaccess`, ...) y carpetas antiguas (`produc/`, `proyecto/`, `webfiles/`, `pdf/`...), además de un `index original.html`.
- Subir a la raíz de `public_html` **choca con ese sitio**: el `index.html` nuevo y el `.htaccess` pueden dejarlo caído. El script solo agrega/sobrescribe archivos; **no borra** nada del servidor.

## Flujo recomendado

1. `npm run deploy -- --ls` para confirmar conexión y ver la carpeta.
2. Acordar con el usuario el destino. Opción segura: una subcarpeta (`public_html/nuevo/`) para revisar el sitio antes de reemplazar el actual.
3. `--dry` para ver los archivos.
4. Si el sitio nuevo va a **reemplazar** al actual: respaldar antes (descargar `public_html` o pedir un backup en cPanel) y avisar de que el `.htaccess` de WordPress puede interferir.
5. Confirmación explícita del usuario → `npm run deploy`.
6. Verificar en el navegador (`curl -I https://edcsupplyllc.com/<ruta>`) que carga con CSS, imágenes y el menú.

## Detalles técnicos

- El script usa `basic-ftp`, sube archivo por archivo creando carpetas con `ensureDir` y vuelve a `/` tras cada subida. Acepta el certificado del host aunque no coincida con el nombre (hosting compartido).
- Las rutas del sitio pasan por `src/lib/url.ts`, que antepone el `BASE_PATH`; por eso el mismo código sirve en la raíz del dominio, en una subcarpeta o en GitHub Pages.
- Las páginas de Products y Contact no están publicadas todavía: sus enlaces dan 404 hasta que se agreguen al repo.
- Si falla con `550 ... No such file or directory`, la carpeta remota no existe: revisa `FTP_REMOTE_DIR` con `--ls`.
