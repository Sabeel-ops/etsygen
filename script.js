// Import Generative AI library from the specified URL
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your own API key
const API_KEY = "AIzaSyCoLQnJWSk6zPOsdZ0Hq0jNC6deWR7x8BE";
  
// Create an instance of the Generative AI class
const genAI = new GoogleGenerativeAI(API_KEY);



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

    const prompts = [
      "Generate an SEO optimized Etsy title for this product that will rank well on Etsy",
      "Generate relevant tags for this product on Etsy",
    ];

    const imageInput = document.getElementById("imageInput");

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

