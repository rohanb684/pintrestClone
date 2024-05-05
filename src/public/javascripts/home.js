const menuitems = document.getElementById('menu-items');
const searchInput = document.querySelector('.search-bar input');

const toggleMenu = () =>{
    if (menuitems.style.display === 'flex' ) {
        menuitems.style.display = 'none';
      } else {
        menuitems.style.display = 'flex';
      }
}

//function to save pin
const savePin = (event) => {
  const button = event.target;
  const pinId = button.id;  
  console.log("Saving Pin ID:", pinId);

  button.innerText = 'Saving...';  
  button.disabled = true;  

  fetch('/save-pin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pinId: pinId })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log('Save successful', data);
      button.innerText = 'Saved';  // Change the button text to 'Saved'
      button.className = 'saved-btn';  // Change the button class
  })
  .catch(error => {
      console.error('Failed to save the pin:', error);
      button.innerText = 'Save';  // Revert button text if there's an error
      button.disabled = false;  // Re-enable the button
  });
};


//Filter home images 
let timeout;
const searchPins = (event) =>{
    clearTimeout(timeout);
    
        timeout = setTimeout(() => {
            const query = event.target.value.trim();    
            fetch(`/search-pins?query=${encodeURIComponent(query)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    document.getElementById('imagesContainer').innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading the images:', error);
                    document.getElementById('imagesContainer').innerHTML = `<div class="error-message">Failed to load images. Please try again later.</div>`;
                });
        }, 300); 
}