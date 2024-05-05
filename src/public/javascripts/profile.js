document.addEventListener("DOMContentLoaded", function() {
    const headers = document.querySelectorAll('.mid-header h3'); // Select all h3 elements inside .mid-header
    const imagesContainer = document.getElementById('imagesContainer'); // Container to load images

    headers.forEach(header => {
        header.addEventListener('click', function() {

            if (this.classList.contains('selected')) {
                return; // Do nothing if it's already selected
            }
            // Remove 'selected' class from all h3 elements
            headers.forEach(h => h.classList.remove('selected'));

            // Add 'selected' class to the clicked h3 element
            this.classList.add('selected');

            // Fetch and display images based on the id of the clicked header
            const typeId = this.id; // 'created-images' or 'saved-images'
            imagesContainer.innerHTML = '<div class="loading-message">Loading...</div>'; // Show loading message

            fetch(`/profile/${typeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok'); // Throw error if response not OK
                    }
                    return response.text();
                })
                .then(html => {
                    imagesContainer.innerHTML = html; // Inject HTML into the container
                })
                .catch(error => {
                    console.error('Failed to load images:', error);
                    imagesContainer.innerHTML = '<div class="error-message">Failed to load images. Please try again later.</div>'; // Show error message
                });
        });
    });
});


// function to unsave pin
const unSave = (event) =>{
    const button = event.target;
    const pinId = button.id;
  
    button.innerText = 'Unsaving...';
    button.disabled = true;
  
    fetch(`/unsave-pin/${pinId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming the server sends back a confirmation
    })
    .then(data => {
        console.log('Unsave successful', data);
        return fetch('/profile/saved-images'); 
    })
    .then(response => response.text()) 
    .then(html => {
        document.getElementById('imagesContainer').innerHTML = html; // Replace the current grid container's HTML
    })
    .catch(error => {
        console.error('Failed to unsave or reload the pins:', error);
        button.innerText = 'Unsave';
        button.disabled = false;
    });
   
  } 

//   function to delete created pin

const deletePin = (event) => {
    const button = event.target;
    const pinId = button.id;
  
    button.innerText = 'Deleting...';
    button.disabled = true;
  
    fetch(`/delete-pin/${pinId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Deletion successful', data);
        button.closest('.image-card').remove(); // Immediately remove the pin from the DOM
        return fetch('/profile/created-images');
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById('imagesContainer').innerHTML = html;
    })
    .catch(error => {
        console.error('Failed to delete or reload the pins:', error);
        button.innerText = 'Delete';
        button.disabled = false; // Re-enable the button to allow retry
        alert('Failed to delete the pin. Please try again.'); // Inform the user
    });
};