function showHome() {
    document.getElementById("celender-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    document.getElementById("home-screen").classList.add("visible");
}

function showCelender() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("celender-screen").classList.remove("hidden");
    document.getElementById("celender-screen").classList.add("visible");
}