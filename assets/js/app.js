const persona = {
  name: "Nova",
  tone: "friendly",
  traits: ["helpful"],
  memory: []
};

// Currently selected voice
let selectedVoice = null;

// ------------------ Custom Q&A ------------------
const QA = [
  {
    questions: ["hello", "hi", "hey"],
    response: "Hello! How can I assist you today?"
  },
  {
    questions: ["your name" , "name"],
    response: `My name is ${persona.name}.`
  },
  {
    questions: ["how are you"],
    response: "I'm functioning perfectly!"
  }
];

// ------------------ Generate Reply ------------------
function generateReply(message) {
  persona.memory.push({ role: "user", content: message });

  let personality = "";
  personality += '<img src="/images/smile.png" alt="smile" style="width:20px; vertical-align:middle;"> ';
  if (persona.traits.includes("helpful")) personality += "I'm here to help. ";

  const lower = message.toLowerCase();
  let reply = QA.find(q => q.questions.some(keyword => lower.includes(keyword)))?.response;
  if (!reply) reply = "You said: " + message;

  reply = personality + reply;
  persona.memory.push({ role: "assistant", content: reply });
  return reply;
}

// ------------------ Send Text ------------------
function sendText() {
  const input = document.getElementById("textInput").value.trim();
  if (!input) return;

  const reply = generateReply(input);

  // Display HTML with image
  document.getElementById("responseBox").innerHTML = reply;

  // Strip HTML for speech
  const textOnly = reply.replace(/<[^>]+>/g, "");
  speak(textOnly);

  document.getElementById("textInput").value = "";
}

// ------------------ Voice Input ------------------
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert("Speech recognition not supported."); return; }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("textInput").value = transcript;
    sendText();
  };

  recognition.start();
}

// ------------------ Text-to-Speech ------------------
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.pitch = 1.2;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

// ------------------ Load Voices ------------------
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  if (!voiceSelect) return;

  voiceSelect.innerHTML = '<option value="">Select Voice</option>';
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// ------------------ Voice Change ------------------
document.getElementById("voiceSelect")?.addEventListener("change", (e) => {
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices[e.target.value] || null;
});

// ------------------ Init ------------------
window.speechSynthesis.onvoiceschanged = loadVoices;
window.addEventListener("load", loadVoices);
