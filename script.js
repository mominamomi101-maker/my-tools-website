let img, canvas, ctx, currentTool = 'remove', isDrawing = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadArea').addEventListener('click', () => document.getElementById('imageInput').click());
    document.getElementById('imageInput').addEventListener('change', handleUpload);
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.control').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tool + 'Ctrl').classList.add('active');
            currentTool = e.target.dataset.tool;
        });
    });
    
    ['precision','brushSize','brightness'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            document.getElementById(id + 'Val').textContent = e.target.value;
        });
    });
});

function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        img = new Image();
        img.onload = () => {
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('editor').style.display = 'grid';
            initCanvas();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function initCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    const maxW = 600, maxH = 500;
    let { width, height } = img;
    if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW/width, maxH/height);
        width *= ratio; height *= ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
}

function removeBG() {
    const precision = document.getElementById('precision').value / 100;
    window.removeBackground(img, canvas, precision);
    setTimeout(showDownload, 500);
}

function showDownload() {
    document.getElementById('editor').style.display = 'none';
    document.getElementById('download').style.display = 'block';
    
    const preview = document.getElementById('preview');
    const pctx = preview.getContext('2d');
    preview.width = canvas.width;
    preview.height = canvas.height;
    pctx.drawImage(canvas, 0, 0);
}

function download(type) {
    const preview = document.getElementById('preview');
    const link = document.createElement('a');
    link.download = `removebg-${Date.now()}.${type}`;
    link.href = preview.toDataURL(`image/${type}`, 1);
    link.click();
}

function newImage() {
    location.reload();
}

function toggleBrush() {
    // Brush toggle logic
}

function startDraw(e) { if (currentTool === 'brush') isDrawing = true; }
function draw(e) { if (isDrawing && currentTool === 'brush') { /* brush */ } }
function stopDraw() { isDrawing = false; }
function applyAdjust() { /* adjustments */ }
