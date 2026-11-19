import { test } from '@playwright/test';

/**
 * Escribe un mensaje en consola precedido del ID de la prueba en curso (p. ej. "[API-02]"),
 * para que la salida siga siendo legible aunque las pruebas se ejecuten en paralelo.
 * La salida aparece en la terminal y en la sección "stdout" de cada prueba del reporte HTML.
 */
export function log(message: string): void {
  const testId = test.info().title.split(' ')[0];
  console.log(`[${testId}] ${message}`);
}
