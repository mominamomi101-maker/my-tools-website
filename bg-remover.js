// Simple AI-like background removal using edge detection
function removeBackground(image, canvas, precision = 0.5) {
    const ctx = canvas.getContext('2d');
   
