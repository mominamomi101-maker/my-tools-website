// ✅ COMPLETE WORKING BACKGROUND REMOVER
function removeBackground(image, canvas, precision = 0.5) {
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        const hsv = rgbToHsv(r, g, b);
        
        const isBright = hsv[2] > (0.9 - precision * 0.3);
        const isDark = hsv[2] < (0.1 + precision * 0.2);
        const isLowSat = hsv[1] < (0.2 + precision * 0.3);
        const isUniform = Math.max(r, g, b) - Math.min(r, g, b) < 60;
        
        if (isBright || isDark || (isLowSat && isUniform)) {
            data[i + 3] = 0; // Transparent
        }
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    
    showDownloadSection();
    alert('✅ Background Removed!');
}

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    
    if (max === min) h = 0;
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}
