// Dummy AI image data (real implementation would use OpenAI API)
const dummyImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3133?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76fdd7f4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578494027861-07bb1ef434d4?w=400&h=300&fit=crop'
];

let generatedImages = [];

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    
    document.getElementById('generateBtn').addEventListener('click', generateImage);
    document.getElementById('promptInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateImage();
    });
});

// Generate AI Image (Simulated)
function generateImage() {
    const prompt = document.getElementById('promptInput').value;
    const style = document.getElementById('styleSelect').value;
    
    if (!prompt.trim()) {
        alert('Please enter a prompt!');
        return;
    }
    
    const btn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const span = btn.querySelector('span');
    
    // Show loading
    btn.disabled = true;
    loader.style.display = 'block';
    span.textContent = 'Generating...';
    
    // Simulate AI generation (3-5 seconds)
    setTimeout(() => {
        // Generate random image URL (in real app, call OpenAI API)
        const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)];
        
        const imageData = {
            url: randomImage,
            prompt: prompt,
            style: style,
            timestamp: new Date().toISOString()
        };
        
        generatedImages.unshift(imageData);
        addToGallery(imageData);
        
        // Reset form
        document.getElementById('promptInput').value = '';
        
        // Hide loading
        loader.style.display = 'none';
        span.textContent = 'Generate Image';
        btn.disabled = false;
        
        // Show modal
        showImageModal(randomImage);
        
    }, Math.random() * 2000 + 3000);
}

// Add image to gallery
function addToGallery(imageData) {
    const galleryGrid = document.getElementById('galleryGrid');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${imageData.url}" alt="${imageData.prompt}" onclick="showImageModal('${imageData.url}')">
        <div class="prompt">"${imageData.prompt}" - ${imageData.style}</div>
    `;
    galleryGrid.insertBefore(item, galleryGrid.firstChild);
    
    // Keep only last 12 images
    while (galleryGrid.children.length > 12) {
        galleryGrid.removeChild(galleryGrid.lastChild);
    }
}

// Load initial gallery
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    dummyImages.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${url}" alt="AI Generated Image" onclick="showImageModal('${url}')">
            <div class="prompt">Beautiful landscape - realistic</div>
        `;
        galleryGrid.appendChild(item);
    });
}

// Modal functions
function showImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
    modal.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('imageModal').style.display = 'none';
});

document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Download functionality
document.querySelector('.download-btn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = document.getElementById('modalImage').src;
    link.download = 'ai-generated-image.jpg';
    link.click();
});

// Share functionality
document.querySelector('.share-btn').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Image',
            text: 'Check out this amazing AI generated image!',
            url: document.getElementById('modalImage').src
        });
    } else {
        alert('Share feature not available. Copy the image URL!');
    }
});
