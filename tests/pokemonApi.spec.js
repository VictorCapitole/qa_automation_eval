const { test } = require('@playwright/test');
const { pokemonData } = require('../data/pokemonData');
const { PokemonService } = require('../services/pokemonService');
const PokemonValidator = require('../utils/pokemonValidator');

test.describe('PokeAPI backend tests', () => {
    const scenario = {};

    test.beforeAll(async ({ request }) => {
        const pokemonService = new PokemonService(request, pokemonData.baseUrl);

        Object.assign(
            scenario,
            await pokemonService.getPikachuScenarioData(
                pokemonData.pokemon.pikachu,
                pokemonData.pokemon.electabuzz
            )
        );
    });

    test('Pikachu has two abilities with the expected structure', async () => {
        PokemonValidator.validatePokemonHasExpectedAbilities(
            scenario.pikachu,
            pokemonData.expectations.expectedPikachuAbilities
        );
    });

    test('Each Pikachu ability has expanded ability information', async () => {
        PokemonValidator.validateAbilityDetailsMatchPokemonAbilities(
            scenario.pikachu,
            scenario.pikachuAbilitiesDetails
        );
    });

    test('One Pikachu ability is shared among more Pokemon than the other', async () => {
        PokemonValidator.validateOneAbilityIsSharedMoreThanTheOther(scenario.pikachuAbilitiesDetails);
    });

    test('Pikachu has over 100 moves', async () => {
        PokemonValidator.validatePokemonHasMoreThanExpectedMoves(
            scenario.pikachu,
            pokemonData.expectations.minimumPikachuMoves
        );
    });

    test('Pikachu shares more than 10 moves with Electabuzz', async () => {
        PokemonValidator.validatePokemonShareMoreThanExpectedMoves(
            scenario.pikachu,
            scenario.electabuzz,
            pokemonData.expectations.minimumSharedMovesWithElectabuzz
        );
    });
});
