const generateForm = document.querySelector(".generate-form");
const ImageGallary = document.querySelector(".image-gallary");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard = (ImageDataArray) => {
   ImageDataArray.ForEach((imgObject, index) => {
      const imgCard = ImageGallary.querySelectorAll(".image-card")[index];
      const imgElement = imgCard.querySelector("img");
      const downloadBtn = imgCard.querySelector(".dowload-btn")

      // Set the image source to the Ai-generated image data
      const aiGeneratedImg = `data:image/jpeg;based,${imgObject.b64_json}`;
      imgElement.src = aiGeneratedImg;

      // When the image is loaded, remove the loading class and set dowlaod attributes 
      imgElement.onload = () => {
         imgCard.classList.remove("Loading");
         downloadBtn.setAttribute("download", `${new Date().getTime()}.jpeg`);
      }
   });
}

const generateAiImages = async (userPrompt, userImgQuality) => {
   try {
      // Send request to the openAI to generate image based on user inputs
      const response = await fetch("https://api.openai.com/v1/images/generations", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
         },
         body: JSON.stringify({
            prompt: userPrompt,
            n: parseInt(userImgQuality),
            size: "512x512",
            response_format: "b64_json"
         })
      });

      if(!response.ok) throw new Error("Faild to generate images! please try again.");

      const { data } = await response.json(); // Get data from the responce
      updateImageCard([...data]);
   } catch (error) {
      alert(error.massage);
   } finally{
      isImageGenerating = false;
   }
}

const handleFormSubmission = (e) => {
   e.preventDefault();
   if(isImageGenerating) return;
   isImageGenerating = true;

   // Get user input and image quality   value from the form
   const userPrompt = e.srcElement[0].value;
   const userImgQuality = e.srcElement[1].value;

   // Creating HTML markup for image cards with loading state
   const imgCardMarkup = Array.from({length: userImgQuality}, () => 
      `<div class="image-card loading">
         <img src="IMG/icons8-loading.gif" alt="image">
         <a href="#" class="download-btn">
            <img src="IMG/icons8-download-26.png" alt="download icon">
         </a>
      </div>`
   ).join("");

   ImageGallary.innerHTML = imgCardMarkup;
   generateAiImages(userPrompt, userImgQuality);
}

generateForm.addEventListener("submit", handleFormSubmission);