import getData from '../utils/getData';

const Home = async () => {
    const launches = await getData();
    
    if (!launches || launches.length === 0) {
        return '<div class="Error">No launches found</div>';
    }

    const view = `
        <div class="Launches">
            ${launches.map(launch => `
                <article class="Launch-item">
                    <a href="#/${launch.id}" data-link>
                        <img src="${launch.links.patch?.small || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop'}" alt="${launch.name}">
                        <h2>${launch.name}</h2>
                    </a>
                </article>
            `).join('')}
        </div>
    `;

    return view;
}

export default Home;