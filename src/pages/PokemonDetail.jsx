import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PokemonDetail() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [weaknesses, setWeaknesses] = useState([]);
    const [evolutions, setEvolutions] = useState([]); 
    const [prevPokemon, setPrevPokemon] = useState(null);
    const [nextPokemon, setNextPokemon] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {
        try {
            // 1. POKEMON
            const resPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const dataPokemon = await resPokemon.json();
            setPokemon(dataPokemon);

            // 2. SPECIES
            const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            const dataSpecies = await resSpecies.json();
            setSpecies(dataSpecies);

            // 3. WEAKNESSES
            let allWeaknesses = [];
            

            for (let t of dataPokemon.types) {
            const resType = await fetch(`https://pokeapi.co/api/v2/type/${t.type.name}`);
            const dataType = await resType.json();

            const weak = dataType.damage_relations.double_damage_from.map(
            d => d.name
            );

            allWeaknesses.push(...weak);
            }

            const unique = [...new Set(allWeaknesses)];
            setWeaknesses(unique);

            if (dataSpecies.evolution_chain) {
                const resEvo = await fetch(dataSpecies.evolution_chain.url);
                const dataEvo = await resEvo.json();

                const evoArray = [];
                let current = dataEvo.chain;

                while (current) {
                    const evo = current.species;

                    // 🔥 fetch extra para traer tipos
                    const evoId = evo.url.split("/").filter(Boolean).pop();
                    const resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoId}`);
                    const dataPoke = await resPoke.json();

                    evoArray.push({
                    name: evo.name,
                    id: evoId,
                    types: dataPoke.types
                    });

                    if (current.evolves_to.length > 0) {
                    current = current.evolves_to[0];
                    } else {
                    current = null;
                    }
                }

                setEvolutions(evoArray);

                // PREV
                if (id > 1) {
                const resPrev = await fetch(`https://pokeapi.co/api/v2/pokemon/${Number(id) - 1}`);
                const dataPrev = await resPrev.json();
                setPrevPokemon(dataPrev);
                }

                // NEXT
                const resNext = await fetch(`https://pokeapi.co/api/v2/pokemon/${Number(id) + 1}`);
                const dataNext = await resNext.json();
                setNextPokemon(dataNext);
            }

        } catch (error) {
        console.error("Error cargando datos:", error);
        }
    };

    fetchData();
    }, [id]);

    if (!pokemon || !species) return <p>Loading...</p>;

    const description = species.flavor_text_entries.find(
        entry => entry.language.name === "en"
    );

    


    return (
        
        
        <section className="container">
            <section className="pokedex-header">

                <div className="pokedex-pokemon-pagination">

                    {prevPokemon && (
                    <Link to={`/pokemon/${prevPokemon.id}`} className="previous">
                        <div className="pokedex-pokemon-pagination-wrapper">
                        <span>⬅</span>
                        <span className="pokemon-number">
                            #{String(prevPokemon.id).padStart(4, "0")}
                        </span>
                        <span className="pokemon-name">
                            {prevPokemon.name}
                        </span>
                        </div>
                    </Link>
                    )}

                    {nextPokemon && (
                    <Link to={`/pokemon/${nextPokemon.id}`} className="next">
                        <div className="pokedex-pokemon-pagination-wrapper">
                        <span className="pokemon-number">
                            #{String(nextPokemon.id).padStart(4, "0")}
                        </span>
                        <span className="pokemon-name">
                            {nextPokemon.name}
                        </span>
                        <span>➡</span>
                        </div>
                    </Link>
                    )}

                </div>

                <div className="pokedex-pokemon-pagination-title">
                    <div>
                    {pokemon.name}
                    <span className="pokemon-number">
                        #{String(pokemon.id).padStart(4, "0")}
                    </span>
                    </div>
                </div>

                </section>

        <div className="column-6 push-1">

                <div className="pokedex-pokemon-profile">
                    <div className="profile-images">
                        <img
                        src={pokemon.sprites.other["official-artwork"].front_default}
                        alt={pokemon.name}
                        />
                    </div>
                </div>

            
                <div className="pokemon-stats-info">
                    <div className="stats-grid">

                        {pokemon.stats.map((stat) => {
                        const maxBars = 15;
                        const filled = Math.round((stat.base_stat / 255) * maxBars);

                        return (
                            <div className="stat" key={stat.stat.name}>

                            <div className="stat-bars">
                                {[...Array(maxBars)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`bar ${i < filled ? "active" : ""}`}
                                />
                                ))}
                            </div>

                            <span>
                                {stat.stat.name
                                .replace("special-attack", "Sp. Atk")
                                .replace("special-defense", "Sp. Def")}
                            </span>

                            </div>
                        );
                        })}

                    </div>
                </div>

            </div>

       
        <div className="column-6 push-7">

            <div className="pokedex-pokemon-details-right">

          
            <div className="version-descriptions">
                <p>
                {description?.flavor_text.replace(/\f/g, " ")}
                </p>
            </div>

            
            <div className="version-labels">
                <span className="version-label">🔵</span>
                <span className="version-label">🔴</span>
            </div>

           
            <div className="info">

                <div className="pokemon-ability-info">

                <div className="left-column">
                    <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                </div>

                <div className="right-column">
                    <p><strong>Abilities:</strong></p>

                    <ul>
                    {pokemon.abilities.map(a => (
                        <li key={a.ability.name}>
                        {a.ability.name}
                        </li>
                    ))}
                    </ul>
                </div>

                </div>

                
                <div className="pokedex-pokemon-attributes">

                <h3>Type</h3>

                <div className="types">
                    {pokemon.types.map(t => (
                    <span
                        key={t.type.name}
                        className={`type ${t.type.name}`}
                    >
                        {t.type.name}
                    </span>
                    ))}
                </div>

                </div>

                <div className="dtm-weaknesses">
                    <h3>Debilidades</h3>

                    <div className="types">
                        {weaknesses.map(w => (
                        <span key={w} className={`type ${w}`}>
                            {w}
                        </span>
                        ))}
                    </div>
                    </div>

                </div>
            </div>

        </div>

        <div className="evolution-section">
                <h2>Evolutions</h2>

                    <div className="evolution-list">
                        {evolutions.map((evo) => {
                            return (
                            <div key={evo.name} className="evolution-card">

                                <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                                alt={evo.name}
                                />

                                <p>{evo.name}</p>
                                <span>#{evo.id.padStart(4, "0")}</span>

                                
                                <div className="types">
                                {evo.types.map(t => (
                                    <span
                                    key={t.type.name}
                                    className={`type ${t.type.name}`}
                                    >
                                    {t.type.name}
                                    </span>
                                ))}
                                </div>

                            </div>
                            );
                        })}
                    </div>
            </div>

        </section>
    );
}

export default PokemonDetail;