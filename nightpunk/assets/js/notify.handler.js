const NOTIFY_LIST = document.querySelector("#notifys");

function Notify(title, msg, type, duration) {
  let sound = new Audio("./assets/sounds/notify.mp3");
  sound.play();
  let icon = null;
  let color = null;
  if (type === "info") {
    icon = `<i class="fa-solid fa-circle-info"></i>`;
    color = "blue";
  } else if (type === "warning") {
    icon = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    color = "orange";
  } else if (type === "error") {
    icon = `<i class="fa-solid fa-circle-exclamation"></i>`;
    color = "red";
  } else if (type === "success") {
    icon = `<i class="fa-solid fa-circle-check"></i>`;
    color = "green";
  }

  const notify = document.createElement("div");
  notify.classList.add("notify");
  notify.style.border = "1px solid " + color;
  NOTIFY_LIST.appendChild(notify);
  notify.innerHTML += `
    <div class="notify-icon">
        <p style="color: ${color};">${icon}</p>
    </div>
    <div class="notify-content">
        <header>
            <h3>${title}</h3>
        </header>
        <p>${msg}</p>
    </div>
    `;

  setTimeout(() => {
    notify.remove();
  }, duration);
}
