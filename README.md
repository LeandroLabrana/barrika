# Barrika

Aplicación Next.js de gestión de una vinoteca: catálogo, precios, rentabilidad, stock, reposición, pedidos y movimientos.

## Desarrollo local

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

La app funciona con datos de demostración si no hay Firebase configurado. Para persistencia real, copia `.env.example` a `.env.local` y completa las variables de una app web de Firebase.

## Firebase

1. Crea un proyecto gratuito en Firebase.
2. Crea una aplicación web y copia sus valores a `.env.local`.
3. Crea Firestore en modo producción.
4. Publica `firestore.rules` desde la consola o con Firebase CLI.

Esta demo no usa autenticación y sus reglas están abiertas intencionadamente para la prueba. La lógica de negocio vive en la aplicación y las operaciones de inventario usan transacciones e IDs de movimiento idempotentes.

## Vercel

Después de validar localmente:

```bash
vercel login
vercel --prod
```

Configura las variables `NEXT_PUBLIC_FIREBASE_*` en Project Settings → Environment Variables. Para que la prueba pueda abrir la app sin cuenta, desactiva Settings → Deployment Protection → Vercel Authentication y entrega la URL de producción. Compruébala en una ventana de incógnito; no debe pedir iniciar sesión.

## Agentes

`AGENTS.md` define el orquestador. Develop sigue `docs/agents/develop.md` y Testing revisa contra `docs/agents/testing-directrices.md` sin editar código.
