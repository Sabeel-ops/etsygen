// Import Generative AI library from the specified URL
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your own API key
const API_KEY = "AIzaSyCoLQnJWSk6zPOsdZ0Hq0jNC6deWR7x8BE";

// Create an instance of the Generative AI class
const genAI = new GoogleGenerativeAI(API_KEY);

function copyResultSKU() {
  const resultContainerSKU = document.getElementById('resultContainerSKU');
  const resultText = resultContainerSKU.innerText;

  // Create a textarea element to temporarily hold the text
  const textarea = document.createElement('textarea');
  textarea.value = resultText;

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select and copy the text from the textarea
  textarea.select();
  document.execCommand('copy');

  // Remove the textarea from the document
  document.body.removeChild(textarea);

  // Provide some feedback, e.g., alert or console.log
  alert('SKU copied to clipboard!');
}

// Function to convert a file to Generative AI part
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

// Function to generate text using Generative AI
async function generateText() {
  // Disable the button while generating content
  const generateButton = document.getElementById("generateButton");
  generateButton.disabled = true;

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const nicheInput = document.getElementById("nicheInput").value;

  // Check if nicheInput is empty, if so, use an empty string as the niche value
  const nichePrompt = nicheInput ? `Niche: ${nicheInput}` : "The neiche is: ";

  const prompts = [
    `Generate an SEO optimized Etsy title for this product that will rank well on Etsy ${nichePrompt}`,
    `Generate 20 SEO optimized Etsy tags separated by commas for this product that will rank well on Etsy. Do not enclose them in quotes ${nichePrompt}`,
  ];

  const imageInput = document.getElementById("imageInput");

  try{
    const fileName = imageInput.files[0].name;
    displayResult("resultContainerSKU", fileName);
  }
  catch (error) {
    console.error("Error generating text:", error);
  }

  if (imageInput.files.length === 0) {
    alert("Please select an image.");
    // Re-enable the button if an error occurs
    generateButton.disabled = false;
    return;
  }

  const imageParts = await Promise.all(
    [...imageInput.files].map(fileToGenerativePart)
  );

  try {
    const results = await Promise.all(prompts.map((prompt) => {
      return model.generateContent([prompt, ...imageParts]);
    }));

    displayResult("resultContainer1", results[0]);
    displayResult("resultContainer2", results[1]);

    // Calculate and display SKU
   
  } catch (error) {
    console.error("Error generating text:", error);
  } finally {
    // Re-enable the button after displaying the results
    generateButton.disabled = false;
  }
}

// Function to display the generated result
function displayResult(containerId, result) {
  const response = result.response;
  const text = response.text();
  const resultContainer = document.getElementById(containerId);
  resultContainer.textContent = text;
}

// Event listener for the button click
document.getElementById("generateButton").addEventListener("click", generateText);
