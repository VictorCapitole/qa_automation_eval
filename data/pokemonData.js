const pokemonData = {
    baseUrl: 'https://pokeapi.co/api/v2',
    pokemon: {
        pikachu: 'pikachu',
        electabuzz: 'electabuzz',
    },
    expectations: {
        expectedPikachuAbilities: 2,
        minimumPikachuMoves: 100,
        minimumSharedMovesWithElectabuzz: 10,
    },
};

module.exports = { pokemonData };
