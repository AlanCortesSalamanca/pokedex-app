function PokemonCard({name, index}){
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;

    return(
        <div className="card">
            <img src={imageUrl} alt={name} />
            <p>{name}</p>
        </div>
    );
}

export default PokemonCard;