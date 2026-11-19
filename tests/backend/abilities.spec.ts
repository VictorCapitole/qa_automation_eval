import { expect, test } from '../../src/fixtures';
import { log } from '../../src/utils/log';

const ABILITY_URL = /^https:\/\/pokeapi\.co\/api\/v2\/ability\/(\d+)\/$/;

test.describe('Habilidades de Pikachu', () => {
  test('API-01 Pikachu tiene exactamente dos habilidades', async ({ pokemonApi }) => {
    log('Consultando Pikachu...');
    const pikachu = await pokemonApi.getPokemon('pikachu');
    const names = pikachu.abilities.map(({ ability }) => ability.name);
    log(`Habilidades recibidas (${names.length}): ${names.join(', ')}`);

    expect(pikachu.abilities).toHaveLength(2);
    log('Pikachu tiene exactamente 2 habilidades');
  });

  test('API-02 cada habilidad tiene una estructura válida y un recurso de detalle coherente', async ({ pokemonApi }) => {
    log('Consultando Pikachu...');
    const { abilities } = await pokemonApi.getPokemon('pikachu');
    expect(abilities.length, 'Pikachu debe tener habilidades').toBeGreaterThan(0);
    log(`Se validarán ${abilities.length} habilidades`);

    for (const { ability, is_hidden, slot } of abilities) {
      await test.step(`habilidad "${ability.name}"`, async () => {
        log(`Habilidad "${ability.name}": url=${ability.url}, is_hidden=${is_hidden}, slot=${slot}`);

        expect(typeof ability.name).toBe('string');
        expect(ability.name.trim()).not.toBe('');
        log('nombre: cadena no vacía');

        expect(typeof is_hidden).toBe('boolean');
        log(`is_hidden: es booleano (${is_hidden ? 'oculta' : 'no oculta'})`);

        expect(Number.isInteger(slot), `el slot ${slot} debe ser un entero`).toBe(true);
        expect(slot).toBeGreaterThan(0);
        log(`slot: entero positivo (${slot})`);

        log('Consultando el detalle de la habilidad...');
        const detail = await pokemonApi.getAbility(ability.url);
        log('detalle: respuesta HTTP satisfactoria');
        log(`Detalle recibido: id=${detail.id}, name=${detail.name}, pokémon asociados=${detail.pokemon.length}`);

        expect(detail.name).toBe(ability.name);
        log(`coherencia: el nombre del detalle coincide ("${detail.name}")`);

        expect(ability.url.match(ABILITY_URL)?.[1]).toBe(String(detail.id));
        log(`coherencia: el id de la URL coincide con el id del detalle (${detail.id})`);

        expect(detail.pokemon.map(({ pokemon }) => pokemon.name)).toContain('pikachu');
        log('coherencia: Pikachu figura entre los pokémon que tienen esta habilidad');
      });
    }
  });

  test('API-03 una habilidad se comparte con más Pokémon que la otra', async ({ pokemonApi }) => {
    log('Consultando Pikachu...');
    const { abilities } = await pokemonApi.getPokemon('pikachu');
    expect(abilities).toHaveLength(2);
    log(`Habilidades a comparar: ${abilities.map(({ ability }) => ability.name).join(' vs ')}`);

    log('Consultando el detalle de ambas habilidades en paralelo...');
    const details = await Promise.all(abilities.map(({ ability }) => pokemonApi.getAbility(ability.url))); //Ejecucion en paralelo de getAbility  mediante con Promise.all pra obteener el detalle de las 2 habilitdades
    const usage = details
      .map(({ name, pokemon }) => ({ name, count: pokemon.length }))//transforma los resultados de la API en objetos más sencillos
      .sort((a, b) => b.count - a.count); //ordena los objetos de mayor a menor
    const [mostShared, leastShared] = usage; //obtengo la habilidad más y menos compartida
    const summary = usage.map(({ name, count }) => `${name}: ${count}`).join(', '); //transforma cada objeto en una cadena

    test.info().annotations.push({ type: 'uso de habilidades', description: summary }); //añadir info al reporte

    /** log info debug
    // for (const { name, count } of usage) {
    //   log(`Pokémon con la habilidad "${name}": ${count}`);
    // }
    **/

    expect(mostShared.count, `uso de habilidades (${summary})`).toBeGreaterThan(leastShared.count);

    log(
      `"${mostShared.name}" (${mostShared.count}) se comparte con más pokémon que ` +
        `"${leastShared.name}" (${leastShared.count}), diferencia: ${mostShared.count - leastShared.count}`,
    );
  });
});
