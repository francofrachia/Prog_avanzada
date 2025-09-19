import getData from '../utils/getData';

const Character = async () => {
    const id = location.hash.slice(2); 
    const launch = await getData(id);

    if (!launch) {
        return '<div class="Error">Launch not found</div>';
    }

    const view = `
    <div class="Characters-inner">
        <article class="Characters-card">
            <img src="${launch.links.patch?.small || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=300&fit=crop'}" alt="${launch.name}">
            <h2>${launch.name}</h2>
        </article>

        <article class="Characters-card">
            <h3>Flight Number: <span>${launch.flight_number || 'Unknown'}</span></h3>
            <h3>Launch Date: <span>${launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'Unknown'}</span></h3>
            <h3>Success: <span>${launch.success ? 'Yes' : 'No'}</span></h3>
            <h3>Rocket: <span>${launch.rocket || 'Unknown'}</span></h3>
            <h3>Details: <span>${launch.details || 'No details available'}</span></h3>
            
            ${launch.failures && launch.failures.length > 0 ? `
                <h3>Failures: </h3>
                <ul>
                    ${launch.failures.map(failure => `
                        <li>${failure.reason} (Time: ${failure.time})</li>
                    `).join('')}
                </ul>
            ` : '<h3>Failures: <span>None</span></h3>'}
        </article>
    </div>
    `;

    return view;
}

export default Character;