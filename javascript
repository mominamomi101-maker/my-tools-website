// Real OpenAI API integration
async function generateRealImage(prompt, style) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // Apna API key dalen
    const enhancedPrompt = `${prompt}, ${style}, highly detailed, 4k`;
    
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: enhancedPrompt,
                n: 1,
                size: '1024x1024'
            })
        });
        
        const data = await response.json();
        return data.data[0].url;
    } catch (error) {
        console.error('API Error:', error);
        return dummyImages[Math.floor(Math.random() * dummyImages.length)];
    }
}
