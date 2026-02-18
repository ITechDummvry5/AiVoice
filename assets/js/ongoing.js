// /* ==================== Persona Setup ==================== */
// const persona = { name:"Nova", tone:"friendly", traits:["helpful"], memory:[] };
// let selectedVoice = null;
// const statusBox = document.getElementById("statusBox");
// let loaderInterval;

// /* ==================== Loader ==================== */
// function startLoader() {
//   if (!statusBox) return;
//   let dots = 0;
//   statusBox.innerText = "Nova is typing";
//   loaderInterval = setInterval(() => {
//     dots = (dots + 1) % 4;
//     statusBox.innerText = "Nova is typing" + ".".repeat(dots);
//   }, 500);
// }
// function stopLoader() {
//   clearInterval(loaderInterval);
//   if (statusBox) statusBox.innerText = "";
// }

// /* ==================== Generate Reply ==================== */
// async function generateReply(message, callback) {
//   persona.memory.push({ role:"user", content: message });
//   try {
//     startLoader();

//     const response = await fetch("http://localhost:11434/api/chat", {
//       method:"POST",
//       headers: { "Content-Type":"application/json" },
//       body: JSON.stringify({
//         model: "llama3:latest",
//         messages:[{ role:"user", content: message }]
//       })
//     });

//     if(!response.ok) throw new Error("Ollama API request failed");

//     const data = await response.json();
//     const aiText = data.message?.content || "No response";

//     let display = `<img class="smile" src="/assets/images/smile.png" alt="smile"> ${aiText}`;
//     persona.memory.push({ role:"assistant", content: aiText });

//     stopLoader();
//     if(callback) callback(display);
//     return display;

//   } catch(err) {
//     console.error("Ollama request failed:", err);
//     stopLoader();
//     if(statusBox) statusBox.innerText = "❗ Error contacting Nova";
//     if(callback) callback(errorMsg);
//     return errorMsg;
//   }
// }

// /* ==================== Send Text ==================== */
// async function sendText() {
//   const inputEl = document.getElementById("textInput");
//   const input = inputEl.value.trim();
//   if(!input) return;

//   generateReply(input, (reply)=>{
//     const responseBox = document.getElementById("responseBox");
//     responseBox.innerHTML += `<div>${reply}</div>`;
//     responseBox.scrollTop = responseBox.scrollHeight;

//     const textOnly = reply.replace(/<[^>]+>/g,"");
//     speak(textOnly);
//   });

//   inputEl.value="";
// }

// /* ==================== Voice Input ==================== */
// function startVoice() {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if(!SpeechRecognition) { alert("Speech recognition not supported"); return; }

//   const recognition = new SpeechRecognition();
//   recognition.lang = "en-US";

//   recognition.onresult = function(event) {
//     const transcript = event.results[0][0].transcript;
//     document.getElementById("textInput").value = transcript;
//     sendText();
//   };

//   recognition.start();
// }

// /* ==================== Text-to-Speech ==================== */
// function speak(text) {
//   if(!text) return;
//   const utterance = new SpeechSynthesisUtterance(text);
//   if(selectedVoice) utterance.voice = selectedVoice;
//   utterance.pitch = 1.2;
//   utterance.rate = 1;
//   window.speechSynthesis.speak(utterance);
// }

// /* ==================== Load Voices ==================== */
// function loadVoices() {
//   const voices = window.speechSynthesis.getVoices();
//   const voiceSelect = document.getElementById("voiceSelect");
//   if(!voiceSelect) return;

//   voiceSelect.innerHTML = '<option value="">Select Voice</option>';
//   voices.forEach((voice,index)=>{
//     const option = document.createElement("option");
//     option.value = index;
//     option.textContent = `${voice.name} (${voice.lang})`;
//     voiceSelect.appendChild(option);
//   });
// }

// /* ==================== Voice Change Handler ==================== */
// document.getElementById("voiceSelect")?.addEventListener("change",(e)=>{
//   const voices = window.speechSynthesis.getVoices();
//   selectedVoice = voices[e.target.value] || null;
// });

// /* ==================== Init ==================== */
// window.speechSynthesis.onvoiceschanged = loadVoices;
// window.addEventListener("load", loadVoices);
