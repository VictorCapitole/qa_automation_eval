# qa_automation_eval

Pruebas automatizadas con **Playwright + TypeScript**:

- **Frontend** — [SauceDemo](https://www.saucedemo.com/): inicio de sesión, carrito y compra.
- **Backend** — [PokéAPI](https://pokeapi.co/): habilidades y movimientos de Pikachu.

## Requisitos

- Node.js LTS (≥ 20)
- Conexión a Internet

## Instalación

```bash
npm ci
npx playwright install chromium
```

## Ejecución

```bash
npm test                  # todas las pruebas
npm run test:frontend     # solo frontend
npm run test:backend      # solo backend
npm run report            # abrir el reporte HTML
```

Las pruebas de frontend se ejecutan con el navegador visible (`headless: false`, `slowMo: 500`).

## Estructura

```text
src/
├── pages/          Page Objects de SauceDemo
├── api/            Cliente de PokéAPI
├── types/          Tipos de las respuestas de la API
├── data/           Datos de prueba
├── utils/          Log de las pruebas de API
└── fixtures.ts
tests/
├── auth.setup.ts   Inicia sesión una vez y guarda la sesión en .auth/user.json
├── frontend/
└── backend/
```

## Pruebas

| ID | Qué valida |
|---|---|
| FE-01 | Inicio de sesión correcto (casos negativos: FE-01b, FE-01c) |
| FE-02 | Añadir un producto al carrito |
| FE-03 | Eliminar un producto del carrito |
| FE-04 | Completar un pedido (validación de datos: FE-04b) |
| API-01 | Pikachu tiene dos habilidades |
| API-02 | Estructura y detalle de cada habilidad |
| API-03 | Una habilidad se comparte con más Pokémon que la otra |
| API-04 | Pikachu tiene más de 100 movimientos |
| API-05 | Pikachu comparte más de 10 movimientos con Electabuzz |
