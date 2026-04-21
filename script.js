let originalImage = null;
let editedImage = null;
let canvas = null;
let ctx = null;
let currentTool = 'remove-bg';

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const editorSection = document.getElementById('editorSection');
    const downloadSection = document.getElementById('downloadSection');

    // Upload functionality
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    imageInput.addEventListener('change', handleImageUpload);

    // Tool switching
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
            showControls(currentTool);
        });
    });

    // Slider value updates
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function() {
            document.getElementById(this.id + 'Value').textContent = this.value;
        });
    });
});

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').style.background = '#f0f8ff';
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').style.background = 'white';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        loadImage(files[0]);
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function loadImage(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            showEditor();
            drawImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showEditor() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('editorSection').style.display = 'flex';
}

function drawImage(img) {
    canvas = document.getElementById('editorCanvas');
    ctx = canvas.getContext('2d');
    
    const maxWidth = 600;
    const maxHeight = 500;
    let { width, height } = img;
    
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
}

function showControls(tool) {
    document.querySelectorAll('.controls').forEach(control => {
        control.style.display = 'none';
    });
    document.getElementById(tool + 'Controls').style.display = 'block';
}

function applyRemoveBG() {
    if (!originalImage || !canvas) return;
    
    const edgePrecision = document.getElementById('edgePrecision').value / 100;
    removeBackground(originalImage, canvas, edgePrecision);
}

function applyRetouch() {
    // Retouch implementation
    const brushSize = document.getElementById('brushSize').value;
    const opacity = document.getElementById('opacity').value / 100;
    // Add brush stroke functionality here
}

function downloadImage(format) {
    const previewCanvas = document.getElementById('previewCanvas');
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    previewCanvas.getContext('2d').drawImage(canvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = `edited-image.${format}`;
    link.href = previewCanvas.toDataURL(`image/${format}`);
    link.click();
    
    showDownloadSection();
}

function showDownloadSection() {
    document.getElementById('editorSection').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'block';
}

function newImage() {
    location.reload();
          }
