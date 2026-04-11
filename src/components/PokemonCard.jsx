import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function PokemonCard({id}){
    const [pokemon, setPokemon] = useState(undefined);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("No encontrado");
            return res.json();
            })
        .then(data => setPokemon(data))
        .catch(error => {
            console.error(error);
            setPokemon(null);
        });

    }, [id]);

    if(pokemon == null) return null ;

    const imageUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${String(id).padStart(3, "0")}.png`;
    

    return(
        <div 
            className="card"
            onClick={() => navigate(`/pokemon/${id}`)}
            style={{cursor: "pointer"}}
        >
            <div className="imgarea">
                <img src={imageUrl} alt={id} />
            </div>
            <div className="info">
                <p className="id">#{pokemon.id}</p>
                <p className="name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
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