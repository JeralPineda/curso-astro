import type { FavoritePokemon } from "@/interfaces/favorite-pokemon";
import { createSignal, Show, type Component } from "solid-js";

interface Props {
  pokemon: FavoritePokemon;
}

export const FacoritePokemonCard: Component<Props> = ({ pokemon }) => {
  const [isVisible, setIsVisible] = createSignal(true);

  const imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const deleteFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") ?? "[]",
    ) as FavoritePokemon[];

    const newFavorites = favorites.filter((p) => p.id !== pokemon.id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsVisible(false);

    // Al eliminar no desaparece inmediatamente, hay que recargar a menos que esto se haga de el padre y ahí se actualiza,
    // pero este lo haremos con el signal isVisible y Show
  };

  return (
    <Show when={isVisible()}>
      <div class="flex flex-col items-center justify-center">
        <a href={`/pokemons/${pokemon.name}`}>
          <img
            src={imageSrc}
            alt={pokemon.name}
            width="96"
            height="96"
            style={`view-transition-name: ${pokemon.name}-image`}
          />
          <p class="capitalize">
            #{pokemon.id} {pokemon.name}
          </p>
        </a>

        <button onClick={deleteFavorite} class="text-red-400">
          Borrar
        </button>
      </div>
    </Show>
  );
};
