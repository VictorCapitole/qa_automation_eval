import type { Locator, Page } from '@playwright/test';

/**
 * El inventario, el carrito y el resumen del checkout muestran los productos con el mismo marcado
 * (`data-test="inventory-item"`). La tarjeta se localiza por su nombre exacto, nunca por posición.
 */
export function productItem(page: Page, name: string): Locator {
  return page
    .getByTestId('inventory-item')
    .filter({ has: page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
}
