import { expect, type APIRequestContext } from '@playwright/test';
import type { AbilityDetail, Pokemon } from '../types/pokemon.types';
import { log } from '../utils/log';

/** Envoltorio tipado y ligero sobre el APIRequestContext de Playwright para los endpoints de PokéAPI bajo prueba. */
export class PokemonApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /** GET /pokemon/{name}, resuelto contra la baseURL del proyecto. */
  getPokemon(name: string): Promise<Pokemon> {
    return this.getJson<Pokemon>(`pokemon/${encodeURIComponent(name)}`);
  }

  /** GET del detalle de una habilidad usando la URL absoluta que devuelve la API. (GET /ability/n/) */
  getAbility(url: string): Promise<AbilityDetail> {
    return this.getJson<AbilityDetail>(url);
  }

  private async getJson<T>(url: string): Promise<T> {
    const start = Date.now();
    const response = await this.request.get(url);
    log(`HTTP GET ${response.url()} → ${response.status()} ${response.statusText()} (${Date.now() - start} ms)`);
    // Se valida el estado HTTP antes de leer el cuerpo; si falla, Playwright informa del estado, la URL y el cuerpo.
    await expect(response, `GET ${response.url()} debe devolver un estado 2xx`).toBeOK();
    return (await response.json()) as T;
  }
}
