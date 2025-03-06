let CHARACTERS_LIST = null;

function CharacterSelection_Handler() {
  CHARACTER_SELECTION.innerHTML = `
    <button id="character-selection-createchar" type="button">${locales.de.characterSelectionCreateCharButton}</button>
    <button id="character-selection-back" type="button">${locales.de.characterSelectionBackButton}</button>
    <div id="characters-list"></div>
  `;
  let CHARACTER_SELECTION_CREATECHAR = document.querySelector(
    "#character-selection-createchar"
  );
  let CHARACTER_SELECTION_BACK = document.querySelector(
    "#character-selection-back"
  );
  CHARACTERS_LIST = document.querySelector("#characters-list");
  CHARACTER_SELECTION_BACK.addEventListener("click", async () => {
    await ChangeScreen("main-menu");
  });
  CHARACTER_SELECTION_CREATECHAR.addEventListener("click", async () => {
    await ChangeScreen("character-creation");
  });
  InitiateCharacters();
}

function InitiateCharacters() {
  let characters = localStorage.getItem("characters");
  console.log(characters);

  if (characters) {
    characters = JSON.parse(characters);

    for (let character of characters) {
      CharacterItem(character);
    }

    const CHARACTER_SELECTION_DELETE = document.querySelectorAll(
      ".character-selection-delete"
    );
    const CHARACTER_SELECTION_START = document.querySelectorAll(
      ".character-selection-start"
    );

    for (let button of CHARACTER_SELECTION_START) {
      button.addEventListener("click", StartGame);
    }
    for (let button of CHARACTER_SELECTION_DELETE) {
      button.addEventListener("click", handleDeleteCharacter);
    }
  }
}

function CharacterItem({ name, type, level, coins, id }) {
  CHARACTERS_LIST.innerHTML += `
    <div>
      <p>${locales.de.characterSelectionName}: ${name}</p>
      <p>${locales.de.characterSelectionType}: ${type || "Normalo"}</p>
      <p>${locales.de.characterSelectionLevel}: ${level}</p>
      <p>${locales.de.characterSelectionCoins}: ${coins}</p>
      <button class="character-selection-start" data-id="${id}">${
    locales.de.characterSelectionPlayButton
  } <b>${name}</b></button>
      <button class="character-selection-delete" data-id="${id}">${
    locales.de.characterSelectionDeleteButton
  }</button>
    </div>
  `;
}

async function StartGame() {
  await ChangeScreen("game-screen");
  initPlayArea();
}

function handleDeleteCharacter(e) {
  const oldCharacters = JSON.parse(localStorage.getItem("characters"));
  const newCharacters = oldCharacters.filter(
    (character) => Number(character.id) !== Number(e.target.dataset.id)
  );

  localStorage.setItem("characters", JSON.stringify(newCharacters));
  e.target.parentElement.remove();
}

async function CharacterCreation_Handler() {
  const characters = JSON.parse(localStorage.getItem("characters"));

  if (characters && characters.length >= 3) {
    alert("Du hast das Maximum an Charaktären erreicht");
    ChangeScreen("character-selection");
    return;
  }

  CHARACTER_CREATION.innerHTML = `
        <h2>${locales.de.characterCreationTitle}</h2>
        <form id="character-creation-form">
            <label for="character-creation-form-name">${locales.de.characterCreationName}: </label>
            <input id="character-creation-form-name" type="text" placeholder="${locales.de.characterCreationName}..." name="name" required />
            <br>
            <p>${locales.de.characterCreationType}: </p>
            <input type="radio" id="character-creation-form-type-punk" name="type" value="${locales.de.characterCreationTypePunk}" required>
            <label for="character-creation-form-type-punk">${locales.de.characterCreationTypePunk} </label>
            <br />
            <input type="radio" id="character-creation-form-type-net" name="type" value="${locales.de.characterCreationTypeNet}" required>
            <label for="character-creation-form-type-net">${locales.de.characterCreationTypeNet} </label>
            <br />
            <input type="radio" id="character-creation-form-type-psycho" name="type" value="${locales.de.characterCreationTypePsycho}" required>
            <label for="character-creation-form-type-psycho">${locales.de.characterCreationTypePsycho} </label>
            <br />
            <button type="submit">${locales.de.characterCreationSubmitButton}</button>
            <button id="character-creation-form-back" type="button">${locales.de.characterCreationBackButton}</button>
        </form>
      `;
  const CHARACTER_CREATION_FORM_BACK = document.querySelector(
    "#character-creation-form-back"
  );
  CHARACTER_CREATION_FORM_BACK.addEventListener("click", async () => {
    await ChangeScreen("character-selection");
  });
  const CHARACTER_CREATION_FORM = document.querySelector(
    "#character-creation-form"
  );
  CHARACTER_CREATION_FORM.addEventListener(
    "submit",
    handleCreateCharacterSubmit
  );
}

async function handleCreateCharacterSubmit(e) {
  e.preventDefault();
  const charName = document.querySelector(
    "#character-creation-form-name"
  ).value;
  let charType = "Normalo";
  const charTypeRadios = document.getElementsByName("type");
  for (let radio of charTypeRadios) {
    if (radio.checked) {
      charType = radio.value;
    }
  }
  console.log(charType);
  const characters = JSON.parse(localStorage.getItem("characters"));
  let newCharacters = null;

  if (characters) {
    newCharacters = characters;
    newCharacters.push({
      id: Date.now(),
      name: charName,
      type: charType,
      level: 1,
      coins: 0,
      items: {},
      perks: [],
    });
  } else {
    newCharacters = [
      {
        id: Date.now(),
        name: charName,
        level: 1,
        coins: 0,
        items: {},
        perks: [],
      },
    ];
  }
  console.log(newCharacters);
  localStorage.setItem("characters", JSON.stringify(newCharacters));
  await ChangeScreen("character-selection");
}
