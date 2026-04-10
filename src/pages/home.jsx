import {useEffect,useState} from "react";
import PokemonCard from "../components/PokemonCard";

function Home(){
    const [allPokemons, setAllPokemons] = useState([]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const [sortOrder, setSortOrder] = useState("numberAsc");

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

    
    const handleSurprise = () => {
        const randomIndex = Math.floor(Math.random() * allPokemons.length);
        const randomPokemon = allPokemons[randomIndex];
        
        setResults([randomPokemon]);
    };

    const sortedData = [...(results.length > 0 ? results : allPokemons)].sort((a,b) => {
        const idA = Number(a.url.split("/")[6]);
        const idB = Number(b.url.split("/")[6]);

        switch(sortOrder){
            case "numberAsc":
                return idA - idB;
            case "numberDesc":
                return idB - idA;
            case "nameAsc":
                return a.name.localeCompare(b.name);
            case "nameDesc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    const dataToShow = sortedData;


    return(
        <div>
            
            <header className="filter-h">
                <div className="filter-container">

                    <div className="filter-left">
                        <label htmlFor="searchInput"> Name or Number</label>

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
                                search
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
                            Use the Advanced Search to Explore Pokémon by type, weakness, Ability, and more!!!    
                        </p>

                    </div>

                    <div className="filter-right">
                        <div className="search-banner">
                            <h2>
                                Search for a Pokémon by name or using its National Pokédex number.
                            </h2>
                        </div>
                    </div>
                </div>
            </header>


            <div className="container">
                <section className="filters">
                    <button className="surprise-btn" onClick={handleSurprise}>
                        surprise Me!
                    </button>


                        <select className="sort"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}>
                            
                            <option value="numberAsc">Lower Number (First)</option>
                            <option value="numberDesc">Highest Number (First)</option>
                            <option value="nameAsc">A-Z</option>
                            <option value="nameDesc">Z-A</option>

                        </select>
                </section>
            </div>
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
                    Load more Pokémon
                </button>
            )}

        </div>
    );

}

export default Home;