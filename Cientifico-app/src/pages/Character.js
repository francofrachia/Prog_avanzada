import getData from '../utils/getData';

const Character = async () => {
    const id = location.hash.slice(2); // Remove #/ from hash
    const character = await getData(id);
    
    if (!character) {
        return `<div class="Error">Character not found</div>`;
    }

    const view = `
    <div class="Characters-inner">
        <article class="Characters-card">
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
        </article>

        <article class="Characters-card">
            <h3>Episodes: <span>${character.episode ? character.episode.length : 0}</span></h3>
            <h3>Status: <span>${character.status}</span></h3>
            <h3>Species: <span>${character.species}</span></h3>
            <h3>Gender: <span>${character.gender}</span></h3>
            <h3>Origin: <span>${character.origin ? character.origin.name : 'Unknown'}</span></h3>
            <h3>Location: <span>${character.location ? character.location.name : 'Unknown'}</span></h3>
        </article>
    </div>
    `;
    
    return view;
};

export default Character;