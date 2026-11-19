/**
 * Subconjunto del esquema de PokéAPI v2 utilizado por los tests (https://pokeapi.co/docs/v2).
 * Estos tipos describen el contrato esperado; la forma real en ejecución se valida igualmente en los tests.
 */
export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedApiResource;
}

export interface PokemonMove {
  move: NamedApiResource;
}

export interface Pokemon {
  id: number;
  name: string;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
}

export interface AbilityPokemon {
  is_hidden: boolean;
  slot: number;
  pokemon: NamedApiResource;
}

export interface AbilityDetail {
  id: number;
  name: string;
  pokemon: AbilityPokemon[];
}
