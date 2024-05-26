document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM filters loaded');

    const typeSelect = document.getElementById('typeSelect');
    const subtypeSelect = document.getElementById('subtypeSelect');
    

    // Define additional filter options
    const additionalFilterOptions = {
        'Residential': `
            <div class="filter-group">
                <button id="floor-btn">Floor</button>
                <div id="floor-menu">
                    <input type="number" id="floorMin" name="propertyFilters[minFloor]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="floorMax" name="propertyFilters[maxFloor]" value="null" placeholder="Max">   
                </div>          
            </div>

            <div class="filter-group">
                <button id="levels-btn">Levels</button>
                <div id="levels-menu">
                    <input type="number" id="levelsMin" name="propertyFilters[minLevels]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="levelsMax" name="propertyFilters[maxLevels]" value="null" placeholder="Max">   
                </div>
                
            </div>

            <div class="filter-group">
                <button id="bathrooms-btn">Bathrooms</button>
                <div id="bathrooms-menu">
                    <input type="number" id="bathroomsMin" name="propertyFilters[minBathrooms]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="bathroomsMax" name="propertyFilters[maxBathrooms]" value="null" placeholder="Max">   
                </div>
            </div>

            <div class="filter-group">
                <button id="bedrooms-btn">Bedrooms</button>
                <div id="bedrooms-menu">
                    <input type="number" id="bedroomsMin" name="propertyFilters[minBedrooms]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="bedroomsMax" name="propertyFilters[maxBedrooms]" value="null" placeholder="Max">
                </div>
            </div>

            <div class="filter-group">
                <button id="year-btn">Year</button>
                <div id="year-menu">
                    <input type="number" id="yearMin" name="propertyFilters[minYear]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="yearMax" name="propertyFilters[maxYear]" value="null" placeholder="Max">
                </div>
            </div>


        </div>
        `,
        'Commercial': `
            <div class="filter-group">
                <button id="floor-btn">Floor</button>
                <div id="floor-menu">
                    <input type="number" id="floorMin" name="propertyFilters[minFloor]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="floorMax" name="propertyFilters[maxFloor]" value="null" placeholder="Max">   
                </div>          
            </div>

            <div class="filter-group">
                <button id="levels-btn">Levels</button>
                <div id="levels-menu">
                    <input type="number" id="levelsMin" name="propertyFilters[minLevels]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="levelsMax" name="propertyFilters[maxLevels]" value="null" placeholder="Max">   
                </div>
            
            </div>

            <div class="filter-group">
                <button id="bathrooms-btn">Bathrooms</button>
                <div id="bathrooms-menu">
                    <input type="number" id="bathroomsMin" name="propertyFilters[minBathrooms]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="bathroomsMax" name="propertyFilters[maxBathrooms]" value="null" placeholder="Max">   
                </div>
            </div>

            <div class="filter-group">
             <button id = "parking-btn"> Parking </button>
                <div id = "parking-menu">
                    <select id = "parking" name = "propertyFilters[parking]">
                        <option value = "null" >Any</option>
                        <option value = "true" >Yes</option>
                        <option value = "false" >No</option>
                    </select>
                </div>
            </div>

            <div class="filter-group">
                <button id="year-btn">Year</button>
                <div id="year-menu">
                    <input type="number" id="yearMin" name="propertyFilters[minYear]" value="null" placeholder="Min">
                    <span>-</span>
                    <input type="number" id="yearMax" name="propertyFilters[maxYear]" value="null" placeholder="Max">
                </div>
            </div>

        `,
        'Land': `
            <div class="filter-group">
                <button id = "buildable-btn"> Buildable </button>
                <div id = "parking-menu">
                    <select id = "parking" name = "propertyFilters[buildable]">
                        <option value = "null" >Any</option>
                        <option value = "true" >Yes</option>
                        <option value = "false" >No</option>
                    </select>
                </div>
            </div>
        `
    };

    // Update subtype options based on type selection
    typeSelect.addEventListener('change', function() {
        const type = typeSelect.value;
        subtypeSelect.innerHTML = ''; // Clear existing options
        
        if (type === 'Residential') {
            subtypeSelect.innerHTML = `
                <option value="null">All</option>
                <option value="Μονοκατοικία">House</option>
                <option value="Διαμέρισμα">Apartment</option>
                <option value="Στούντιο">Studio</option>
                <option value="Μεζονέτα">Maisonette</option>
            `;
        } else if (type === 'Commercial') {
            subtypeSelect.innerHTML = `
                <option value="null">All</option>
                <option value="Κατάστημα">Store</option>
                <option value="Γραφείο">Office</option>
                <option value="Αποθήκη">Warehouse</option>
            `;
        } else if (type === 'Land') {
            subtypeSelect.innerHTML = `
                <option value="null">All</option>
                <option value="Οικόπεδο">Land</option>
                <option value="Αγροτεμάχιο">Farm</option>
            `;
        } else {
            subtypeSelect.innerHTML = `
                <option value="null">Subtype</option>
            `;
        }
    });

    filtersBtn.addEventListener('click', function() {
        event.preventDefault();
        const selectedType = typeSelect.value;
        if (additionalFilters.style.display === 'flex') {
            additionalFilters.style.display = 'none';
        } else {
            additionalFilters.innerHTML = additionalFilterOptions[selectedType] || '';
            additionalFilters.style.display = additionalFilters.innerHTML ? 'flex' : 'none';
        }
    });

    additionalFilters.addEventListener('click', function(event) {
        
        const target = event.target; // Get the clicked element within the container
        if (target.tagName === 'BUTTON') {
            event.preventDefault();
            // Check if the clicked element is a button, and handle accordingly
            const menuId = target.id.replace('-btn', '-menu'); // Convert button id to menu id
            const menu = document.getElementById(menuId);
            if (menu) {
                toggleDisplay(menu); // Call toggle display function
            }
        }
    });

    // Function to toggle display
    function toggleDisplay(menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    }
});


