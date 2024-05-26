document.addEventListener('DOMContentLoaded', () => {
    const favouriteButton = document.getElementById('favoriteBtn');

    favouriteButton.addEventListener('click', () => {
        if (favouriteButton.classList.contains('added')) {
            // Revert to original state
            favouriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favourites';
            favouriteButton.classList.remove('added');
        } else {
            // Change to added state
            favouriteButton.innerHTML = '<i class="fa fa-heart"></i> Added';
            favouriteButton.classList.add('added');
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const priceBtn = document.getElementById('price-btn');
    const priceMenu = document.getElementById('price-menu');
    const surfaceBtn = document.getElementById('surface-btn');
    const surfaceMenu = document.getElementById('surface-menu');
    
    // Helper function to toggle display
    const toggleDisplay = (menu_show) => {
        if (menu_show.style.display === 'none' || !menu_show.style.display) {
            menu_show.style.display = 'flex';
            

        } else {
            menu.style.display = 'none';
        }
    };

    priceBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    
        
        toggleDisplay(priceMenu);
    });

    surfaceBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    
    
        toggleDisplay(surfaceMenu);
    });



    document.addEventListener('click', (event) => {
        // Hide the menu if the click is outside the menu and the button
        if (surfaceMenu.style.display === 'flex' && !surfaceMenu.contains(event.target) && !surfaceBtn.contains(event.target)) {
          surfaceMenu.style.display = 'none';
        }
        if (priceMenu.style.display === 'flex' && !priceMenu.contains(event.target) && !priceBtn.contains(event.target)) {
            priceMenu.style.display = 'none';
          }
      });
    
      
    
    


  

});






