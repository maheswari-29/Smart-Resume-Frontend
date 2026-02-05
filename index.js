// DRAG & DROP
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

dropZone.onclick = () => fileInput.click();

fileInput.onchange = () => {
  fileName.textContent = fileInput.files[0].name;
  fileName.classList.remove("hidden");
};

dropZone.ondragover = (e) => {
  e.preventDefault();
};

dropZone.ondrop = (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  fileName.textContent = e.dataTransfer.files[0].name;
  fileName.classList.remove("hidden");
};

// DARK MODE
const toggle = document.getElementById("themeToggle");
toggle.textContent = "☀️";

toggle.onclick = () => {
  document.body.classList.toggle("dark");
  toggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
};

const BACKEND_URL = "https://smart-resume-analyzer-backend-1-ekre.onrender.com";

const spinner = document.getElementById("spinner");
const loadingText = document.getElementById("loadingText");

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

function animateScore(percent) {
  const circle = document.querySelector(".progress");
  const value = document.querySelector(".score-value");
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.style.strokeDashoffset = offset;
  value.textContent = percent + "%";
}

document.querySelector(".analyze-btn").onclick = async () => {
  const btn = document.querySelector(".analyze-btn");
  const resume = fileInput.files[0];
  const jd = document.querySelector(".jd-textarea").value.trim();

  if (!resume || !jd) {
    alert("Upload resume and paste job description");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Analyzing...";
  spinner.classList.remove("hidden");
  loadingText.classList.remove("hidden");

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("job_description", jd);

  try {
    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    animateScore(data.match_percentage);
    renderSkills(document.querySelector(".matched-list"), data.matched_skills);
    renderSkills(document.querySelector(".missing-list"), data.missing_skills);

    document.querySelector(".results").classList.remove("hidden");
  } catch {
    alert("Backend not reachable");
  } finally {
    spinner.classList.add("hidden");
    loadingText.classList.add("hidden");
    btn.disabled = false;
    btn.textContent = "Analyze Resume";
  }
};
