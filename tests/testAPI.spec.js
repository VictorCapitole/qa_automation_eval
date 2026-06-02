const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://pokeapi.co/api/v2';
const PIKACHU = 'pikachu';
const ELECTABUZZ = 'electabuzz';

async function getJsonResponse(request, url) {
    const response = await request.get(url);

    expect(response.ok()).toBeTruthy();

    return response.json();
}

async function getPokemon(request, pokemonName) {
    return getJsonResponse(request, `${BASE_URL}/pokemon/${pokemonName}`);
}

async function getAbilityDetails(request, abilityUrl) {
    return getJsonResponse(request, abilityUrl);
}

function getMoveNames(pokemon) {
    return pokemon.moves.map((moveInfo) => moveInfo.move.name);
}

function getSharedMoves(firstPokemon, secondPokemon) {
    const firstPokemonMoves = new Set(getMoveNames(firstPokemon));
    const secondPokemonMoves = new Set(getMoveNames(secondPokemon));
    const sharedMoves = [];

    for (const move of firstPokemonMoves) {
        if (secondPokemonMoves.has(move)) {
            sharedMoves.push(move);
        }
    }

    return sharedMoves;
}

function validateAbilityStructure(abilityInfo) {
    expect(abilityInfo.ability.name).toBeTruthy();
    expect(abilityInfo.ability.url).toContain('/ability/');
    expect(typeof abilityInfo.is_hidden).toBe('boolean');
    expect(typeof abilityInfo.slot).toBe('number');
}

test.describe('PokeAPI backend tests', () => {
    test('Pikachu has two abilities with the expected structure', async ({ request }) => {
        const pikachu = await getPokemon(request, PIKACHU);

        expect(pikachu.abilities).toHaveLength(2);

        for (const abilityInfo of pikachu.abilities) {
            validateAbilityStructure(abilityInfo);
        }
    });

    test('Each Pikachu ability has expanded ability information', async ({ request }) => {
        const pikachu = await getPokemon(request, PIKACHU);

        for (const abilityInfo of pikachu.abilities) {
            const abilityDetails = await getAbilityDetails(request, abilityInfo.ability.url);

            expect(abilityDetails.name).toBe(abilityInfo.ability.name);
            expect(abilityDetails.pokemon.length).toBeGreaterThan(0);
        }
    });

    test('One Pikachu ability is shared among more Pokemon than the other', async ({ request }) => {
        const pikachu = await getPokemon(request, PIKACHU);

        const abilitiesDetails = await Promise.all(
            pikachu.abilities.map((abilityInfo) => getAbilityDetails(request, abilityInfo.ability.url))
        );

        const sharedPokemonCounts = abilitiesDetails.map(
            (abilityDetails) => abilityDetails.pokemon.length
        );

        expect(sharedPokemonCounts[0]).not.toBe(sharedPokemonCounts[1]);
    });

    test('Pikachu has over 100 moves', async ({ request }) => {
        const pikachu = await getPokemon(request, PIKACHU);

        expect(pikachu.moves.length).toBeGreaterThan(100);
    });

    test('Pikachu shares more than 10 moves with Electabuzz', async ({ request }) => {
        const pikachu = await getPokemon(request, PIKACHU);
        const electabuzz = await getPokemon(request, ELECTABUZZ);

        const sharedMoves = getSharedMoves(pikachu, electabuzz);

        expect(sharedMoves.length).toBeGreaterThan(10);
    });
});