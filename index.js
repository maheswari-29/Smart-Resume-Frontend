// ========== ELEMENTS ==========
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const toggle = document.getElementById("themeToggle");
const analyzeBtn = document.querySelector(".analyze-btn");
const BACKEND_URL = "https://smart-resume-analyzer-backend-1-ekre.onrender.com";

// ========== DRAG & DROP / TOUCH ==========
function updateFileDisplay(file) {
  fileName.textContent = file.name;
  fileName.classList.remove("hidden");
}

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => e.preventDefault());
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    updateFileDisplay(e.dataTransfer.files[0]);
  }
});

// Mobile touch support: tap to select
dropZone.addEventListener("touchstart", () => fileInput.click());

// File input change
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) updateFileDisplay(fileInput.files[0]);
});

// ========== THEME TOGGLE ==========
toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ========== SKILL RENDER ==========
function renderSkills(container, skills) {
  container.innerHTML = "";
  if (!skills || skills.length === 0) {
    container.innerHTML = "<span>None</span>";
    return;
  }
  skills.forEach(skill => {
    const span = document.createElement("span");
    span.textContent = skill;
    container.appendChild(span);
  });
}

// ========== SCORE ANIMATION ==========
function animateScore(percent) {
  const circle = document.querySelector(".progress");
  const value = document.querySelector(".score-value");
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  value.textContent = percent + "%";
}

// ========== ANALYZE BUTTON ==========
analyzeBtn.addEventListener("click", async () => {
  const resume = fileInput.files[0];
  const jd = document.querySelector(".jd-textarea").value.trim();

  if (!resume || !jd) {
    alert("Upload resume and paste job description");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("job_description", jd);

  try {
    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Backend returned an error");

    const data = await res.json();

    animateScore(data.match_percentage);
    renderSkills(document.querySelector(".matched-list"), data.matched_skills);
    renderSkills(document.querySelector(".missing-list"), data.missing_skills);

    document.querySelector(".results").classList.remove("hidden");
  } catch (err) {
    alert("Backend not reachable or error occurred");
    console.error(err);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Resume";
  }
});
