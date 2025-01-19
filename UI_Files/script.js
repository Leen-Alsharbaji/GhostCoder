
function handleUserInput() {
    
    const userInput = document.getElementById('input').value;
    

    if (userInput.trim() === '') {
        return; 
    }

    createUserMessage(userInput);

    
    document.getElementById('input').value = '';
    
   
    generateText(userInput);
}

// Attach the function to the Send button
document.getElementById('send-btn').addEventListener('click', handleUserInput);

function createUserMessage(userInput) {
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('messages');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('d-flex', 'flex-row', 'justify-content-end', 'mb-4');
    
    const userContent = document.createElement('div');
    userContent.classList.add('p-3', 'ms-3');
    
    const paragraph = document.createElement('p');
    paragraph.classList.add('small', 'mb-0');
    paragraph.id = 'user';
    paragraph.innerHTML = formatText(userInput); // Use the formatted text here
    
    const image = document.createElement('img');
    image.src = 'images\the ghost.svg';
    image.style.cssText = "width: 45px; height: 100%;";
    
    mainContainer.appendChild(messageDiv);
    messageDiv.appendChild(userContent);
    userContent.appendChild(paragraph);
    messageDiv.appendChild(image);
    
    document.querySelector('.messages').appendChild(mainContainer);
}

async function generateText(userInput) {
    const prompt = userInput;
    const url = 'http://localhost:5001/api/v1/generate';

    const requestOptions = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "max_context_length": 2048,
            "max_length": 300,
            "prompt":   `You are a useful assistant that helps with all kinds of tasks. Please provide helpful, clear, and concise responses. Here's the user's request: ${userInput}`,
            "quiet": false,
            "rep_pen": 1.2,
            "rep_pen_range": 512,
            "rep_pen_slope": 0.8,
            "temperature": 0.7,
            "tfs": 0.95,
            "top_a": 0.6,
            "top_k": 50,
            "top_p": 0.8,
            "typical": 0.15,
            "sampler_order": [6, 0, 1, 3, 4, 2, 5],
            "singleline": false,
            "frmttriminc": true,
            "frmtrmblln": false
        }
        
        )
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        // Access the "text" property of the first object in the "results" array
        const generatedText = data.results[0].text;

        // Call the function to display the bot's message with formatted text
        botMessages(generatedText);

    } catch (error) {
        console.error('Error:', error);
        botMessages("An error occurred. Please try again later.");
    }
}

function botMessages(botInput) {
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('messages');

    const image = document.createElement('img');
    image.src = 'images\the ghost.svg';
    image.style.cssText = "width: 45px; height: 100%;";

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-4');
   
    const botContent = document.createElement('div');
    botContent.classList.add('ms-3', 'botmessage');
    
    const paragraph = document.createElement('p');
    paragraph.classList.add('small', 'mb-0');
    paragraph.id = 'bot';
    paragraph.innerHTML = formatText(botInput); // Use the formatted text here

    messageDiv.appendChild(image);
    mainContainer.appendChild(messageDiv);
    messageDiv.appendChild(botContent);
    botContent.appendChild(paragraph);
    
    document.querySelector('.messages').appendChild(mainContainer);
}

function formatText(text) {
    // Escape HTML special characters to prevent issues with rendering
    text = text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

    // Format bold text (e.g., **bold text** becomes <b>bold text</b>)
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Format code blocks (optional): Triple backticks (```code```) to <pre><code>code</code></pre>
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Format inline code (single backticks): `code` to <code>code</code>
    text = text.replace(/`([^`]*)`/g, '<code>$1</code>');

    // Format links (e.g., https://example.com becomes <a href="https://example.com">https://example.com</a>)
    text = text.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank">$&</a>');

    return text;
}
