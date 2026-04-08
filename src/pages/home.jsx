import {useEffect,useState} from "react";

function Home(){
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        .then(res => res.json())
        .then(data => setPokemons(data.results))
        .then(err => console.error(err));
    }, []);

    return(
        <div>
            
            <h2>
                Lista de Pokémon
            </h2>

            {pokemons.map((pokemon,index) => (
            <p key={index}>{pokemon.name}</p>
            ))}

        </div>
    );

}

export default Home;