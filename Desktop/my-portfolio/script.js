function toggleMode() {
  const body = document.body;
  const toggleBtn = document.querySelector(".toggle-btn");
  body.classList.toggle('dark');

  // Change icon 🌙☀️
  if(body.classList.contains("dark")){
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
