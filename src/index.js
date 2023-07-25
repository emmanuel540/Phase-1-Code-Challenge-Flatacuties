// Your code here
const characterBar = document.getElementById("character-bar");
const detailedInfoDiv = document.getElementById("detailed-info");
const votesForm = document.getElementById("votes-form");
const votesInput = document.getElementById("votes");
const voteCountElement = document.getElementById("vote-count");

// Function to fetch character details by ID
async function fetchCharacterDetails(id) {
  try {
    const response = await fetch(`/characters/${id}`);
    const character = await response.json();
    return character;
  } catch (error) {
    console.error("Error fetching character details:", error);
    return null;
  }
}
// Function to update character votes on the server
async function updateCharacterVotes(id, votes) {
    try {
      const response = await fetch(`/characters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes }),
      });
      const character = await response.json();
      return character.votes;
    } catch (error) {
      console.error("Error updating character votes:", error);
      return null;
    }
  }
  // Function to fetch all characters from the server
async function fetchAllCharacters() {
    try {
      const response = await fetch("http://localhost:3000/characters");
      const charactersData = await response.json();
      return charactersData;
    } catch (error) {
      console.error("Error fetching characters data:", error);
      return [];
    }
  }
  // Function to display characters in the character bar
function displayCharacters(characters) {
    characters.forEach((character) => {
      const characterNameSpan = document.createElement("span");
      characterNameSpan.textContent = character.name;
      characterNameSpan.addEventListener("click", () => {
        displayCharacterDetails(character.id);
      });
  
      characterBar.appendChild(characterNameSpan);
    });
  }
  // Function to display character details in the detailed-info div
async function displayCharacterDetails(id) {
    detailedInfoDiv.innerHTML = ""; // Clear previous content
  
    const character = await fetchCharacterDetails(id);
  
    if (!character) {
      console.error(`Character with ID ${id} not found.`);
      return;
    }
  
    const nameElement = document.createElement("p");
    nameElement.textContent = character.name;
    const imageElement = document.createElement("img");
  imageElement.setAttribute("src", character.image);
  imageElement.setAttribute("alt", character.name);
  imageElement.setAttribute("id", "image");

  voteCountElement.textContent = character.votes;

  votesForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const votesValue = parseInt(votesInput.value);

if (!isNaN(votesValue)) {
      const updatedVotes = await updateCharacterVotes(id, character.votes + votesValue);
      if (updatedVotes !== null) {
        voteCountElement.textContent = updatedVotes;
        votesInput.value = "";
      }
    }
  });

 detailedInfoDiv.appendChild(nameElement);
 detailedInfoDiv.appendChild(imageElement);
 detailedInfoDiv.appendChild(voteCountElement);
 detailedInfoDiv.appendChild(votesForm);
}

// Function to initialize the app
async function init() {
  const charactersData = await fetchAllCharacters();
  displayCharacters(charactersData);
}

init();