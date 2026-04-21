window.removeBackground = function(img, canvas, precision = 0.7) {
    const ctx = canvas.getContext('2d');
    const temp = document.createElement('canvas');
    const tctx = temp.getContext('2d');
    
    temp.width = canvas.width;
    temp.height = canvas.height;
    tctx.drawImage(img, 0, 0);
    
    const data = tctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const avg = (r + g + b) / 3;
        const sat = Math.max(r,g,b) - Math.min(r,g,b);
        
        if (avg > 220 || avg < 40 || (sat < 30 && avg > 100)) {
            data[i+3] = 0;
        }
    }
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.putImageData(tctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    ctx.globalCompositeOperation = 'source-over';
};
