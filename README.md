# Barrika

Aplicación web Next.js de gestión de una vinoteca: catálogo, precios, rentabilidad, stock, reposición, pedidos y movimientos de inventario.

## Demo pública

- Aplicación: <https://barrika-vinoteca.vercel.app/>
- Repositorio: <https://github.com/LeandroLabrana/barrika>

La demo no requiere login. Firebase Authentication no está habilitado porque la prueba solicita una aplicación pública sin autenticación.

## Stack

- Next.js App Router, TypeScript y Tailwind CSS.
- Vitest para las reglas puras de dominio.
- Firebase Cloud Firestore para datos y transacciones de inventario.
- Vercel para producción.
- GitHub como repositorio y origen de los despliegues.

## Desarrollo local

```bash
cd /Users/faustolabrana/Desktop/Barrika
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Después abre <http://localhost:3000>.

Si no configuras Firebase, la aplicación arranca con datos de demostración locales. El archivo `.env.local` no se versiona.

## Firebase

### Configuración

1. Crea un proyecto en Firebase y registra una aplicación web.
2. Crea la base de datos Cloud Firestore Standard con el ID `(default)`.
3. Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

4. Completa las variables `NEXT_PUBLIC_FIREBASE_*` con los valores de la aplicación web de Firebase.
5. Publica las reglas de `firestore.rules` desde la pestaña Rules de Firestore.

Las reglas están abiertas intencionadamente para esta demo pública sin login. No deben utilizarse con datos sensibles o en producción real.

### Datos iniciales

Con `.env.local` configurado y las reglas publicadas, ejecuta:

```bash
npm run seed:firebase
```

El script crea o actualiza:

- `settings/general` con los multiplicadores e IVAs por defecto.
- `wines/barrika-crianza`.
- `wines/txakoli-itsas`.
- `wines/garnacha-larga`.

Las operaciones de inventario y recepción usan transacciones Firestore con IDs idempotentes. Si Firebase no está configurado, la demo utiliza un fallback local.

### Firebase CLI (opcional)

Para desplegar reglas desde la terminal:

```bash
npx firebase-tools login
npx firebase-tools init firestore
npx firebase-tools deploy --only firestore:rules
```

## Despliegue en Vercel

El despliegue actual se hizo importando el repositorio GitHub `LeandroLabrana/barrika` desde el panel de Vercel.

Configuración:

- Framework: Next.js.
- Root Directory: `./`.
- Rama de producción: `main`.
- Variables de entorno: las seis variables `NEXT_PUBLIC_FIREBASE_*` en Production y Preview.

También puede utilizarse la CLI:

```bash
npx vercel login
npx vercel --prod
```

Después de modificar variables de entorno hay que crear un nuevo despliegue para que surtan efecto.

Para que la prueba sea accesible sin cuenta, Vercel Authentication/Deployment Protection está desactivado para la URL pública. La URL debe probarse en una ventana de incógnito y debe ser la URL de producción, no una Preview.

## Agentes Codex

- `AGENTS.md`: orquestador principal.
- `.codex/agents/develop.toml`: definición de Develop.
- `.codex/agents/testing.toml`: definición de Testing.
- `docs/agents/develop.md`: instrucciones de programación.
- `docs/agents/testing-directrices.md`: directrices y checklist de revisión.

El flujo es secuencial: Develop implementa una tarea, Testing revisa el cambio y ejecuta los tests, y los fallos concretos vuelven a Develop hasta PASS o un máximo de tres ciclos.

## Validación

```bash
npm test
npm run typecheck
npm run build
```

El dominio de precios, IVA, rentabilidad, stock, reposición y redondeo está centralizado en `src/domain` y cubierto por tests.
