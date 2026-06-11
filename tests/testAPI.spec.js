const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://pokeapi.co/api/v2';
const PIKACHU = 'pikachu';
const ELECTABUZZ = 'electabuzz';

const EXPECTED_PIKACHU_ABILITIES = 2;
const MINIMUM_PIKACHU_MOVES = 100;
const MINIMUM_SHARED_MOVES_WITH_ELECTABUZZ = 10;

let pikachu;
let electabuzz;
let pikachuAbilitiesDetails;

async function getJsonResponse(request, url) {
    const response = await request.get(url);

    expect(response.ok()).toBeTruthy();

    return response.json();
}

async function getPokemon(request, pokemonName) {
    const pokemonUrl = `${BASE_URL}/pokemon/${pokemonName}`;

    return getJsonResponse(request, pokemonUrl);
}

async function getAbilityDetails(request, abilityUrl) {
    return getJsonResponse(request, abilityUrl);
}

async function getPokemonAbilityDetails(request, pokemon) {
    const abilityDetailsRequests = pokemon.abilities.map((abilityInfo) => {
        return getAbilityDetails(request, abilityInfo.ability.url);
    });

    return Promise.all(abilityDetailsRequests);
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

function getAbilitySharedPokemonCounts(abilitiesDetails) {
    return abilitiesDetails.map((abilityDetails) => abilityDetails.pokemon.length);
}

function validateAbilityStructure(abilityInfo) {
    expect(abilityInfo.ability.name).toBeTruthy();
    expect(abilityInfo.ability.url).toContain('/ability/');
    expect(typeof abilityInfo.is_hidden).toBe('boolean');
    expect(typeof abilityInfo.slot).toBe('number');
}

function validatePokemonHasExpectedAbilities(pokemon, expectedAbilities) {
    expect(pokemon.abilities).toHaveLength(expectedAbilities);

    for (const abilityInfo of pokemon.abilities) {
        validateAbilityStructure(abilityInfo);
    }
}

function validateAbilityDetailsMatchPokemonAbilities(pokemon, abilitiesDetails) {
    for (let index = 0; index < pokemon.abilities.length; index++) {
        const pokemonAbility = pokemon.abilities[index];
        const abilityDetails = abilitiesDetails[index];

        expect(abilityDetails.name).toBe(pokemonAbility.ability.name);
        expect(abilityDetails.pokemon.length).toBeGreaterThan(0);
    }
}

function validateOneAbilityIsSharedMoreThanTheOther(abilitiesDetails) {
    const sharedPokemonCounts = getAbilitySharedPokemonCounts(abilitiesDetails);

    expect(sharedPokemonCounts[0]).not.toBe(sharedPokemonCounts[1]);
}

function validatePokemonHasMoreThanExpectedMoves(pokemon, minimumMoves) {
    expect(pokemon.moves.length).toBeGreaterThan(minimumMoves);
}

function validatePokemonShareMoreThanExpectedMoves(firstPokemon, secondPokemon, minimumSharedMoves) {
    const sharedMoves = getSharedMoves(firstPokemon, secondPokemon);

    expect(sharedMoves.length).toBeGreaterThan(minimumSharedMoves);
}

test.describe('PokeAPI backend tests', () => {
    test.beforeAll(async ({ request }) => {
        pikachu = await getPokemon(request, PIKACHU);

        const pokemonAbilityDetailsRequest = getPokemonAbilityDetails(request, pikachu);
        const electabuzzRequest = getPokemon(request, ELECTABUZZ);

        [pikachuAbilitiesDetails, electabuzz] = await Promise.all([
            pokemonAbilityDetailsRequest,
            electabuzzRequest,
        ]);
    });

    test('Pikachu has two abilities with the expected structure', async () => {
        validatePokemonHasExpectedAbilities(pikachu, EXPECTED_PIKACHU_ABILITIES);
    });

    test('Each Pikachu ability has expanded ability information', async () => {
        validateAbilityDetailsMatchPokemonAbilities(pikachu, pikachuAbilitiesDetails);
    });

    test('One Pikachu ability is shared among more Pokemon than the other', async () => {
        validateOneAbilityIsSharedMoreThanTheOther(pikachuAbilitiesDetails);
    });

    test('Pikachu has over 100 moves', async () => {
        validatePokemonHasMoreThanExpectedMoves(pikachu, MINIMUM_PIKACHU_MOVES);
    });

    test('Pikachu shares more than 10 moves with Electabuzz', async () => {
        validatePokemonShareMoreThanExpectedMoves(
            pikachu,
            electabuzz,
            MINIMUM_SHARED_MOVES_WITH_ELECTABUZZ
        );
    });
});