class FlightFinder {
    constructor() {
        this.flights = [];
        this.passengers = 1;
        this.sortBy = 'price';
        this.destinationNames = {
            'COR': 'Córdoba',
            'MDZ': 'Mendoza', 
            'BRC': 'Bariloche',
            'EPA': 'El Palomar'
        };
        this.init();
    }

    async init() {
        await this.loadFlights();
        this.setupEventListeners();
        this.displayResults();
    }

    async loadFlights() {
        try {
            const response = await fetch('dataset.json');
            this.flights = await response.json();
            console.log(`✅ Cargados ${this.flights.length} vuelos`);
        } catch (error) {
            console.error('Error cargando vuelos:', error);
            this.showError('No se pudieron cargar los datos de vuelos');
        }
    }

    setupEventListeners() {
        document.getElementById('passengers').addEventListener('change', (e) => {
            this.passengers = parseInt(e.target.value);
            this.displayResults();
        });

        document.getElementById('sort').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.displayResults();
        });
    }

    findRoundTrips() {
        const maxBudget = 800;
        const results = [];
        
        const flightsByDestination = {};
        
        this.flights.forEach(flight => {
            if (!flightsByDestination[flight.destination]) {
                flightsByDestination[flight.destination] = [];
            }
            flightsByDestination[flight.destination].push(flight);
        });

        this.flights.forEach(outbound => {

            const possibleReturns = flightsByDestination[outbound.origin] || [];
            
            possibleReturns.forEach(inbound => {

                if (inbound.origin === outbound.destination && 
                    inbound.destination === outbound.origin &&
                    new Date(inbound.date) > new Date(outbound.date)) {
                    
                    const totalPrice = (outbound.price + inbound.price) * this.passengers;
                    
                    if (totalPrice <= maxBudget) {
                        const days = this.calculateDays(outbound.date, inbound.date);
                        
                        results.push({
                            outbound,
                            inbound,
                            totalPrice,
                            pricePerPerson: outbound.price + inbound.price,
                            destination: this.destinationNames[outbound.destination] || outbound.destination,
                            origin: this.destinationNames[outbound.origin] || outbound.origin,
                            dates: {
                                outbound: outbound.date,
                                inbound: inbound.date
                            },
                            days,
                            availability: Math.min(outbound.availability, inbound.availability)
                        });
                    }
                }
            });
        });
        
        return this.sortResults(results);
    }

    sortResults(results) {
        return results.sort((a, b) => {
            switch (this.sortBy) {
                case 'price':
                    return a.totalPrice - b.totalPrice;
                case 'days':
                    return b.days - a.days;
                case 'date':
                    return new Date(a.dates.outbound) - new Date(b.dates.outbound);
                default:
                    return a.totalPrice - b.totalPrice;
            }
        });
    }

    calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    displayResults() {
        const resultsContainer = document.getElementById('results');
        const loadingElement = document.getElementById('loading');
        
        loadingElement.style.display = 'flex';
        resultsContainer.innerHTML = '';


        setTimeout(() => {
            try {
                const roundTrips = this.findRoundTrips();
                loadingElement.style.display = 'none';

                if (roundTrips.length === 0) {
                    this.showNoResults();
                    return;
                }

                const limitedResults = roundTrips.slice(0, 50);
                
                limitedResults.forEach(trip => {
                    const card = this.createTripCard(trip);
                    resultsContainer.appendChild(card);
                });

                if (roundTrips.length > 50) {
                    this.showResultsCount(roundTrips.length);
                }
                
            } catch (error) {
                console.error('Error mostrando resultados:', error);
                this.showError('Error al procesar los resultados');
            }
        }, 100);
    }

    showNoResults() {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>😔 No encontramos viajes para ${this.passengers} persona(s) por menos de $800</h3>
                <p>Probá con menos pasajeros o revisá más tarde por nuevas ofertas</p>
            </div>
        `;
    }

    showResultsCount(total) {
        const resultsContainer = document.getElementById('results');
        const countElement = document.createElement('div');
        countElement.className = 'results-count';
        countElement.innerHTML = `
            <p style="text-align: center; color: #666; margin-top: 20px;">
                 Se encontraron ${total} resultados. Mostrando los primeros 50.
            </p>
        `;
        resultsContainer.appendChild(countElement);
    }

    showError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>❌ Error</h3>
                <p>${message}</p>
            </div>
        `;
    }

    createTripCard(trip) {
        const card = document.createElement('div');
        card.className = 'flight-card';
        
        const destinationEmoji = this.getDestinationEmoji(trip.destination);
        const daysText = trip.days === 1 ? 'día' : 'días';
        

        const formattedTotalPrice = this.formatPrice(trip.totalPrice);
        const formattedPricePerPerson = this.formatPrice(trip.pricePerPerson);
        
        card.innerHTML = `
            <h3>${destinationEmoji} ${trip.destination}</h3>
            
            <div class="destination-info">
                <strong>📍 Ruta:</strong> ${trip.origin} → ${trip.destination} → ${trip.origin}
            </div>
            
            <div class="price">${formattedTotalPrice}</div>
            
            <div class="details">
                <span>💰</span>
                <strong>Por persona:</strong> ${formattedPricePerPerson}
            </div>
            
            <div class="details">
                <span>📅</span>
                <strong>Ida:</strong> ${this.formatDate(trip.dates.outbound)}
            </div>
            
            <div class="details">
                <span>📅</span>
                <strong>Vuelta:</strong> ${this.formatDate(trip.dates.inbound)}
            </div>
            
            <div class="details">
                <span>⏱️</span>
                <strong>Duración:</strong> ${trip.days} ${daysText}
            </div>
            
            <div class="details">
                <span>👥</span>
                <strong>Asientos disponibles:</strong> ${trip.availability}
            </div>
        `;
        
        return card;
    }


    formatPrice(price) {

        return `$${parseFloat(price.toFixed(2))}`;
    }

    getDestinationEmoji(destination) {
        const emojis = {
            'Mendoza': '🏔️',
            'Bariloche': '❄️', 
            'Córdoba': '🌄',
            'El Palomar': '🏙️'
        };
        return emojis[destination] || '🎯';
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FlightFinder();
    });
} else {
    new FlightFinder();
}