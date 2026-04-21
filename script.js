let img, canvas, ctx, currentTool = 'remove', isDrawing = false, stats = 1247;

document.addEventListener('DOMContentLoaded', function() {
    // Upload
    document.getElementById('uploadArea').onclick = () => document.getElementById('imageInput').click();
    document.getElementById('imageInput').onchange = handleUpload;
    
    // Tools
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.control').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tool + 'Ctrl').classList.add('active');
            currentTool = e.target.dataset.tool;
        };
    });
    
    // Sliders
    ['precision','brushSize','brightness'].forEach(id => {
        document.getElementById(id).oninput = (e) => {
            document.getElementById(id + 'Val').textContent = e.target.value;
        };
    });
});

function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        img = new Image();
        img.onload = () => {
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('editor').style.display = 'grid';
            initCanvas();
        };
        img.src = ev.target.result;
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
    ctx.drawImage(img, 0, 0);
    
    canvas.onmousedown = startDraw;
    canvas.onmousemove = draw;
    canvas.onmouseup = stopDraw;
}

function removeBG() {
    showLoading();
    setTimeout(() => {
        const precision = document.getElementById('precision').value / 100;
        window.removeBackground(img, canvas, precision);
        hideLoading();
        setTimeout(showDownload, 500);
        updateStats();
    }, 2000);
}

function showLoading() {
    document.body.innerHTML += `
        <div class="loading" id="tempLoading">
            <div class="spinner"></div>
            <p>AI Magic... <span id="count">3</span>s</p>
        </div>
    `;
    let count = 3;
    const timer = setInterval(() => {
        count--;
        document.getElementById('count').textContent = count;
        if (count < 0) clearInterval(timer);
    }, 1000);
}

function hideLoading() {
    const loading = document.getElementById('tempLoading');
    if (loading) loading.remove();
}

function showDownload() {
    document.getElementById('editor').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'block';
    
    const preview = document.getElementById('previewCanvas');
    preview.width = canvas.width;
    preview.height = canvas.height;
    preview.getContext('2d').drawImage(canvas, 0, 0);
}

function downloadImage(type) {
    const preview = document.getElementById('previewCanvas');
    const a = document.createElement('a');
    a.download = `removebg-${Date.now()}.${type}`;
    a.href = preview.toDataURL(`image/${type}`, 1);
    a.click();
}

function shareImage() {
    if (navigator.share) {
        navigator.share({ title: 'AI RemoveBG', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('✅ Link Copied to Share!');
    }
}

function whatsappShare() {
    const msg = encodeURIComponent('🔥 AI RemoveBG Tool - Perfect!\n' + window.location.href);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('✅ Website Link Copied!');
}

function editAgain() {
    document.getElementById('downloadSection').style.display = 'none';
    document.getElementById('editor').style.display = 'grid';
}

function newImage() {
    location.reload();
}

function updateStats() {
    stats++;
    if (document.getElementById('stats')) {
        document.getElementById('stats').textContent = stats.toLocaleString();
    }
}

function startDraw(e) { if (currentTool === 'brush') isDrawing = true; }
function draw(e) { if (isDrawing && currentTool === 'brush') {} }
function stopDraw() { isDrawing = false; }
