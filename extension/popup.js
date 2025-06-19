document.getElementById("defineBtn").addEventListener("click", getDefinition);
document.getElementById("translateBtn").addEventListener("click", translateWord);

async function getDefinition() {
  const word = document.getElementById("wordInput").value;
  if (!word) return;
  try {
    const res = await fetch("http://127.0.0.1:5000/define", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word }),
    });
    const data = await res.json();

    document.getElementById("definitionText").textContent = data.definition;

    const suggestions = data.suggestions || [];
    const list = document.getElementById("suggestionsList");
    list.innerHTML = "";
    suggestions.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("definitionText").textContent = "Error fetching definition.";
  }
}

async function translateWord() {
  const word = document.getElementById("wordInput").value;
  const lang = document.getElementById("langSelect").value;

  if (!word) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, lang }),
    });
    const data = await res.json();

    document.getElementById("translatedText").textContent = data.translated || "Not available.";
  } catch (error) {
    console.error("Translate Error:", error);
    document.getElementById("translatedText").textContent = "Translation failed.";
  }
}

(async function () {
  try {
    const res = await fetch("http://127.0.0.1:5000/word-of-the-day");
    const data = await res.json();
    document.getElementById("wordOfDayText").textContent = `${data.word}: ${data.definition}`;
  } catch (error) {
    document.getElementById("wordOfDayText").textContent = "Error loading Word of the Day.";
  }
})();

