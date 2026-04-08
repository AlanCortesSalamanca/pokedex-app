import {useEffect, useState} from "react";

function PokemonCard({name, index}){
    const [pokemon, setPokemon] = useState(null);

    useEffect(() =>{
        fetch(`http://pokeapi.co/api/v2/pokemon/${name}`)
        .then(res => res.json())
        .then(data => setPokemon(data))
        .catch(error => console.error(error));

    }, [name]);

    if(!pokemon) return <p>Cargando...</p>

    return(
        <div className="card">
            <div className="imgarea">
                <img src={pokemon.sprites.front_default} alt={name} />
            </div>
            <div className="info">
                <p className="id">#{pokemon.id}</p>
                <p className="name">{pokemon.name}</p>
            </div>
            <div className="types">{
                pokemon.types.map((type, index) => (
                    <span key={index} className={`type ${type.type.name}`}>
                        {type.type.name}
                    </span>
                ))
                }
            </div>
        </div>
    );
}

export default PokemonCard;