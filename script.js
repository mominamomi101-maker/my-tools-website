// Global variables
let uploadedAudioBlob = null;
let generatedAudioBlob = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Character counter
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    
    textInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
    
    // Upload area click
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('click', function() {
        document.getElementById('audioFile').click();
    });
    
    // File input change
    document.getElementById('audioFile').addEventListener('change', handleAudioUpload);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ccc';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            processAudioFile(file);
        }
        uploadArea.style.borderColor = '#ccc';
    });
});

// Handle audio upload
function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        processAudioFile(file);
    } else {
        alert('Please upload an audio file (MP3, WAV, M4A)');
    }
}

// Process audio file
function processAudioFile(file) {
    uploadedAudioBlob = file;
    
    // Create preview
    const audioUrl = URL.createObjectURL(file);
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioUrl;
    
    // Show preview, hide upload area
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('audioPreview').style.display = 'block';
    
    // Check audio duration
    audioPlayer.addEventListener('loadedmetadata', function() {
        if (audioPlayer.duration > 30) {
            alert('Audio should be 3-10 seconds for best results. Longer files will be trimmed.');
        }
    });
}

// Remove uploaded audio
function removeAudio() {
    uploadedAudioBlob = null;
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('audioPlayer').src = '';
}

// Generate speech (using ElevenLabs free tier as example - replace with your backend)
async function generateSpeech() {
    const text = document.getElementById('textInput').value;
    
    if (!text.trim()) {
        alert('Please enter some text to generate speech');
        return;
    }
    
    if (!uploadedAudioBlob) {
        alert('Please upload a voice sample first');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('result').style.display = 'none';
    
    // Note: This is a DEMO endpoint
    // For real voice cloning, you need to:
    // 1. Set up GPT-SoVITS or Chatterbox on your server
    // 2. Replace this API call with your backend endpoint
    
    try {
        // OPTION 1: Using ElevenLabs API (requires API key - sign up at elevenlabs.io for free tier)
        // const formData = new FormData();
        // formData.append('text', text);
        // formData.append('voice_sample', uploadedAudioBlob);
        
        // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/your-voice-id', {
        //     method: 'POST',
        //     headers: {
        //         'xi-api-key': 'YOUR_API_KEY_HERE',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         text: text,
        //         model_id: 'eleven_monolingual_v1'
        //     })
        // });
        
        // OPTION 2: For now, using demo - THIS IS A SIMULATION
        // In production, replace this with your actual backend
        await simulateVoiceGeneration(text);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating speech. Please try again.');
        document.getElementById('loading').style.display = 'none';
        document.getElementById('generateBtn').disabled = false;
    }
}

// DEMO function - Replace with real API call
async function simulateVoiceGeneration(text) {
    // This is a simulation - it uses browser's speech synthesis
    // In real implementation, you'd call your backend
    
    setTimeout(() => {
        // Simulate processing time
        document.getElementById('loading').style.display = 'none';
        
        // Create a simulated audio using Web Speech API (for demo only)
        // In production, use actual voice cloning API response
        const simulatedAudio = simulateAudioFromText(text);
        
        generatedAudioBlob = simulatedAudio;
        const audioUrl = URL.createObjectURL(simulatedAudio);
        const resultAudio = document.getElementById('resultAudio');
        resultAudio.src = audioUrl;
        
        document.getElementById('result').style.display = 'block';
        document.getElementById('generateBtn').disabled = false;
        
        // Track generation for analytics
        trackGeneration();
    }, 2000);
}

// Simulate audio creation (DEMO only - replace with real API)
function simulateAudioFromText(text) {
    // This creates a silent WAV file as placeholder
    // In production, this would be the actual generated voice from your backend
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = Math.max(1, text.length / 15); // Rough estimate
    const sampleRate = 44100;
    const frames = duration * sampleRate;
    const audioBuffer = audioContext.createBuffer(1, frames, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Create a simple sine wave (for demo only - not real voice)
    for (let i = 0; i < frames; i++) {
        channelData[i] = Math.sin(i * 440 * 2 * Math.PI / sampleRate) * 0.1;
    }
    
    // Convert to WAV blob
    const wavBlob = audioBufferToWav(audioBuffer);
    return wavBlob;
}

// Helper: Convert AudioBuffer to WAV blob
function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let samples = buffer.getChannelData(0);
    let wavBuffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(wavBuffer);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    
    // Write audio data
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
        let sample = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
    }
    
    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Download generated audio
function downloadAudio() {
    if (generatedAudioBlob) {
        const url = URL.createObjectURL(generatedAudioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice_clone_${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Track analytics (for ad revenue)
function trackGeneration() {
    // This would send data to your analytics
    console.log('Voice generation tracked');
    
    // For Adsterra or other ad networks, you'd call their tracking code here
    if (typeof adsbygoogle !== 'undefined') {
        // (adsbygoogle = window.adsbygoogle || []).push({});
    }
}

// Scroll to tool
function scrollToTool() {
    document.getElementById('tool').scrollIntoView({ behavior: 'smooth' });
}

// Simple ad integration (add this in HTML where you want ads)
// <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" data-ad-format="auto"></ins>
