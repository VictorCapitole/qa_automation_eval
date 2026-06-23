const { expect } = require('@playwright/test');

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

module.exports = {
    getSharedMoves,
    validateAbilityStructure,
    validatePokemonHasExpectedAbilities,
    validateAbilityDetailsMatchPokemonAbilities,
    validateOneAbilityIsSharedMoreThanTheOther,
    validatePokemonHasMoreThanExpectedMoves,
    validatePokemonShareMoreThanExpectedMoves,
};
