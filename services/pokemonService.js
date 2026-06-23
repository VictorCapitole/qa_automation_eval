const { expect } = require('@playwright/test');

class PokemonService {
    constructor(request, baseUrl) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async getJsonResponse(url) {
        const response = await this.request.get(url);

        expect(response.ok()).toBeTruthy();

        return response.json();
    }

    async getPokemon(pokemonName) {
        const pokemonUrl = `${this.baseUrl}/pokemon/${pokemonName}`;

        return this.getJsonResponse(pokemonUrl);
    }

    async getAbilityDetails(abilityUrl) {
        return this.getJsonResponse(abilityUrl);
    }

    async getPokemonAbilityDetails(pokemon) {
        const abilityDetailsRequests = pokemon.abilities.map((abilityInfo) => {
            return this.getAbilityDetails(abilityInfo.ability.url);
        });

        return Promise.all(abilityDetailsRequests);
    }

    async getPikachuScenarioData(pikachuName, electabuzzName) {
        const pikachu = await this.getPokemon(pikachuName);

        const pikachuAbilityDetailsRequest = this.getPokemonAbilityDetails(pikachu);
        const electabuzzRequest = this.getPokemon(electabuzzName);

        const [pikachuAbilitiesDetails, electabuzz] = await Promise.all([
            pikachuAbilityDetailsRequest,
            electabuzzRequest,
        ]);

        return {
            pikachu,
            electabuzz,
            pikachuAbilitiesDetails,
        };
    }
}

module.exports = { PokemonService };
