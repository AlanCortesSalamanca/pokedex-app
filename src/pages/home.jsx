import {useEffect,useState} from "react";
import PokemonCard from "../components/PokemonCard";

function Home(){
    const [pokemons, setPokemons] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
        .then(res => res.json())
        .then(data => setPokemons(data.results))
        .then(err => console.error(err));
    }, []);

    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
        pokemon.url.includes(search)
    );

    return(
        <div>
            
            <h2>
                Lista de Pokémon
            </h2>

            <input
                type="text"
                placeholder="Buscar Pokemon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="container">
                {filteredPokemons.map((pokemon,index) =>(
                    <PokemonCard
                    key={index}
                    name={pokemon.name}
                    index={index}
                    />
                ))}
            </div>

        </div>
    );

}

export default Home;