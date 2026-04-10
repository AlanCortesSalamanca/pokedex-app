import {useEffect,useState} from "react";
import PokemonCard from "../components/PokemonCard";

function Home(){
    const [allPokemons, setAllPokemons] = useState([]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1100")
        .then(res => res.json())
        .then(data => setAllPokemons(data.results))
        .catch(err => console.error(err));
    }, []);

    const suggestions = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6);

    const handleSearch = () => {
        if (!search) {
            setResults([]);
            return;
        }

        const filtered = allPokemons.filter(pokemon => {
            const id = pokemon.url.split("/")[6];
            return(
                pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
                id.includes(search)
            );

        });

        if (filtered.length === 0){
            alert("No se encontraron resultados");
        }

        setResults(filtered);
        setVisibleCount(20);
    };

    const dataToShow = results.length > 0 ? results : allPokemons;

    return(
        <div>
            
            <header className="filter-h">
                <div className="filter-container">

                    <div className="filter-left">
                        <label htmlFor="searchInput"> Nombre o número</label>

                        <div className="search-row">
                            <input 
                                type="text"
                                id="searchInput"
                                placeholder="Ej: Pikachu o 255"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }} 
                            />
                            

                            <button onClick={handleSearch}>
                                Buscar
                            </button>
                            
                            {search && (
                                <div className="suggestions">
                                    {suggestions.map((p) => {
                                        const id = p.url.split("/")[6];

                                        return(
                                            <div
                                                key={id}
                                                onClick={() => setSearch(p.name)}
                                                className="suggestion-item"
                                            >
                                                {p.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                       

                        <p className="subtitle">
                            ¡Utiliza la busqueda avanzada para explorar Pokemon por tipo, debilidad, habilidad y mucho mas!
                        </p>

                    </div>

                    <div className="filter-right">
                        <div className="search-banner">
                            <h2>
                                Busca un pokémon por su nombre o utilizando su número en la Pokedex Nacional
                            </h2>
                        </div>
                    </div>
                </div>
            </header>
            
            


            <div className="container">
                {dataToShow.slice(0, visibleCount).map((pokemon) => {
                    const id = pokemon.url.split("/")[6];          
                    return(<
                    PokemonCard 
                    key={id}
                    id={id}
                    />
                    );
                })}
            </div>

            {visibleCount < dataToShow.length && (
                <button onClick={() => setVisibleCount(prev => prev + 20)}>
                    Mostrar Mas Pokémons
                </button>
            )}

        </div>
    );

}

export default Home;