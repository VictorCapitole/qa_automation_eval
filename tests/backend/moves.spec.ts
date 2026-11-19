import { expect, test } from '../../src/fixtures';
import type { Pokemon } from '../../src/types/pokemon.types';
import { log } from '../../src/utils/log';


const MIN_PIKACHU_MOVES = 100;
const MIN_SHARED_WITH_ELECTABUZZ = 10;

const moveNames = ({ moves }: Pokemon): Set<string> => new Set(moves.map(({ move }) => move.name));
//Funcion para recibir el obejto pokemon y extrae los nombres de sus movimientos y devuelve un Set de cadenas de texto sin duplicados.

test.describe('Movimientos de Pikachu', () => {
  test('API-04 Pikachu tiene más de 100 movimientos', async ({ pokemonApi }) => {
    log('Consultando Pikachu...');
    const pikachu = await pokemonApi.getPokemon('pikachu');
    log(`Movimientos recibidos: ${pikachu.moves.length}`);

    expect(pikachu.moves.length).toBeGreaterThan(MIN_PIKACHU_MOVES);
    log(`Pikachu tiene ${pikachu.moves.length} movimientos (> ${MIN_PIKACHU_MOVES})`);
  });

  test('API-05 Pikachu comparte más de 10 movimientos con Electabuzz', async ({ pokemonApi }) => {
    log('Consultando Pikachu y Electabuzz en paralelo...');
    const [pikachu, electabuzz] = await Promise.all([
      pokemonApi.getPokemon('pikachu'),
      pokemonApi.getPokemon('electabuzz'),
    ]);

    const pikachuMoves = moveNames(pikachu);
    const electabuzzMoves = moveNames(electabuzz);
    log(`Movimientos distintos de Pikachu: ${pikachuMoves.size}`);
    log(`Movimientos distintos de Electabuzz: ${electabuzzMoves.size}`);

    const shared = [...pikachuMoves].filter((move) => electabuzzMoves.has(move)); //pikachuMoves se transforma en un array para poder filtrar por movimiento y btener los movimientos que tienen en común Pikachu y Electabuzz.
    test.info().annotations.push({ type: 'movimientos compartidos', description: `${shared.length}` });//añadir info al reporte
    log(`Intersección de ambos conjuntos: ${shared.length} movimientos compartidos`);
    log(`Movimientos compartidos: ${shared.join(', ')}`);

    expect(shared.length).toBeGreaterThan(MIN_SHARED_WITH_ELECTABUZZ);
    log(`Comparten ${shared.length} movimientos (> ${MIN_SHARED_WITH_ELECTABUZZ})`);
  });
});
