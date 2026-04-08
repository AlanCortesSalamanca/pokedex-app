import {useEffect,useState} from "react";
import PokemonCard from "../components/PokemonCard";

function Home(){
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
        .then(res => res.json())
        .then(data => setPokemons(data.results))
        .then(err => console.error(err));
    }, []);

    return(
        <div>
            
            <h2>
                Lista de Pokémon
            </h2>

            <div className="container">
                {pokemons.map((pokemon,index) =>(
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