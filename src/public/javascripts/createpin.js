function previewImage() {
    const fileInput = document.getElementById('file-input');
    const previewImg = document.getElementById('preview-img');
    const preUploadContent = document.getElementById('pre-upload-content');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
            preUploadContent.style.display = 'none'
            previewImg.style.display = 'block'; // Show the preview image
        };

        reader.readAsDataURL(fileInput.files[0]); // Read the image file as a data URL
    }
}