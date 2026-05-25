const scenes = {
  kill: {
    key: "F1",
    label: "ACE MOMENT",
    playlist: "kill",
    demoAudioSrc: null,
    sounds: ["Ace clean hit 03", "One tap cheer", "Entry frag pulse", "High-light snap"]
  },
  win: {
    key: "F2",
    label: "ROUND WIN",
    playlist: "win",
    demoAudioSrc: null,
    sounds: ["Round secured", "Victory rise", "Team clean win", "Scoreboard pop"]
  },
  retry: {
    key: "F3",
    label: "WE GO AGAIN",
    playlist: "retry",
    demoAudioSrc: null,
    sounds: ["Next round energy", "Still winnable", "Reset and swing", "Almost had it"]
  },
  team: {
    key: "F4",
    label: "TEAM VOICE",
    playlist: "team",
    demoAudioSrc: null,
    sounds: ["Nice trade", "Hold together", "Good comms", "Stack and go"]
  },
  stream: {
    key: "F5",
    label: "STREAM POP",
    playlist: "stream",
    demoAudioSrc: null,
    sounds: ["Chat clip moment", "Replay sting", "Stream pop hit", "Audience bump"]
  }
};

const keyToScene = {
  F1: "kill",
  F2: "win",
  F3: "retry",
  F4: "team",
  F5: "stream"
};

const keycaps = Array.from(document.querySelectorAll(".keycap"));
const playlistCards = Array.from(document.querySelectorAll(".playlist-card"));
const sceneLabel = document.querySelector("#sceneLabel");
const soundName = document.querySelector("#soundName");
const soundStrip = document.querySelector(".sound-strip");
const waveform = document.querySelector(".waveform");
const demoPanel = document.querySelector(".demo-panel");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeScene = "kill";
let lastSound = "";
let animationTimer = 0;

function chooseSound(scene) {
  if (scene.sounds.length === 1) {
    return scene.sounds[0];
  }

  let next = scene.sounds[Math.floor(Math.random() * scene.sounds.length)];
  if (next === lastSound) {
    const currentIndex = scene.sounds.indexOf(next);
    next = scene.sounds[(currentIndex + 1) % scene.sounds.length];
  }

  lastSound = next;
  return next;
}

function restartClassAnimation(element, className) {
  if (!element || reducedMotion) {
    return;
  }

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function activateScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) {
    return;
  }

  activeScene = sceneId;
  demoPanel?.setAttribute("data-active-scene", sceneId);

  keycaps.forEach((keycap) => {
    const isActive = keycap.dataset.scene === sceneId;
    keycap.classList.toggle("active", isActive);
    keycap.setAttribute("aria-pressed", String(isActive));
  });

  playlistCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.playlist === scene.playlist);
  });

  if (sceneLabel) {
    sceneLabel.textContent = scene.label;
  }

  if (soundName) {
    soundName.textContent = chooseSound(scene);
  }

  restartClassAnimation(soundStrip, "is-rolling");
  restartClassAnimation(waveform, "is-playing");

  window.clearTimeout(animationTimer);
  animationTimer = window.setTimeout(() => {
    soundStrip?.classList.remove("is-rolling");
    waveform?.classList.remove("is-playing");
  }, 1100);
}

keycaps.forEach((keycap) => {
  keycap.addEventListener("click", () => activateScene(keycap.dataset.scene));
});

document.addEventListener("keydown", (event) => {
  const sceneId = keyToScene[event.key];
  if (!sceneId) {
    return;
  }

  event.preventDefault();
  activateScene(sceneId);
});

activateScene(activeScene);
