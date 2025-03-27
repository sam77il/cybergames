let CHARACTERS_LIST = null;

function CharacterSelection_Handler() {
  screens.character_selection.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <h2 class="characters-selection-title">Characters</h2>

      <div id="characters-list"></div>

      <div class="character-selection-actions">
        <img class="img-btn" id="character-selection-createchar" src="./assets/img/de_imgs/newchar_btn.png">
        <img class="img-btn" id="character-selection-back" src="./assets/img/de_imgs/back_btn.png">
      </div>
    </div>
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
  console.log(JSON.parse(characters));

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
      button.addEventListener("click", handleLevelSelection);
    }
    for (let button of CHARACTER_SELECTION_DELETE) {
      button.addEventListener("click", handleDeleteCharacter);
    }
  }
}

function CharacterItem({ name, type, levels, coins, deaths, kills, id }) {
  CHARACTERS_LIST.innerHTML += `
    <div class="character-selection-item">
      <p>${
        locales[settings.language].characterSelectionName
      }: <b>${name}</b></p>
      <p>${
        locales[settings.language].characterSelectionType
      }: <b>${type}</b></p>
      <p>${locales[settings.language].characterSelectionLevel}: <b>${
    levels.length
  }</b></p>
      <p>${
        locales[settings.language].characterSelectionCoins
      }: <b>${coins}</b></p>
      <p>Stats: <b>${kills}K/${deaths}D</b></p>
      <div class="character-selection-item-actions">
        <img class="character-selection-start img-btn small-btn" src="./assets/img/de_imgs/play_btn.png" data-id="${id}">
        <img class="character-selection-delete img-btn small-btn" src="./assets/img/de_imgs/delete_btn.png" data-id="${id}">
      </div>
    </div>
  `;
}

async function handleLevelSelection(event) {
  await ChangeScreen("level-selection");
  LevelSelection_Handler(event.target.dataset.id);
  // initiateGameCanvas(event.target.dataset.id);
}

function handleDeleteCharacter(event) {
  const oldCharacters = JSON.parse(localStorage.getItem("characters"));
  const newCharacters = oldCharacters.filter(
    (character) => Number(character.id) !== Number(event.target.dataset.id)
  );

  localStorage.setItem("characters", JSON.stringify(newCharacters));
  event.target.parentElement.parentElement.remove();
  Notify("Charakter", "Charakter erfolgreich gelöscht", "success", 3000);
}

async function CharacterCreation_Handler() {
  const characters = JSON.parse(localStorage.getItem("characters"));

  if (characters && characters.length >= 3) {
    alert("Du hast das Maximum an Charaktären erreicht");
    ChangeScreen("character-selection");
    return;
  }

  screens.character_creation.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <h2 class="characters-selection-title">${
        locales[settings.language].characterCreationTitle
      }</h2>
    
      <form id="character-creation-form">
        <div class="character-creation-form-content">
          <div>
            <label for="character-creation-form-name">${
              locales[settings.language].characterCreationName
            }: </label>
            <input id="character-creation-form-name" type="text" placeholder="${
              locales[settings.language].characterCreationName
            }..." name="name" required />
          </div>
          
          <p>${locales[settings.language].characterCreationType}: </p>
          <div>
            <input type="radio" id="character-creation-form-type-punk" name="type" value="${
              locales[settings.language].characterCreationTypePunk
            }" required>
            <label for="character-creation-form-type-punk">${
              locales[settings.language].characterCreationTypePunk
            } </label>
          </div>
          <div>
            <input type="radio" id="character-creation-form-type-net" name="type" value="${
              locales[settings.language].characterCreationTypeNet
            }" required>
            <label for="character-creation-form-type-net">${
              locales[settings.language].characterCreationTypeNet
            } </label>
          </div>
          <div>
            <input type="radio" id="character-creation-form-type-psycho" name="type" value="${
              locales[settings.language].characterCreationTypePsycho
            }" required>
            <label for="character-creation-form-type-psycho">${
              locales[settings.language].characterCreationTypePsycho
            } </label>
          </div>
        </div>
        
        <div class="character-creation-actions">
          <button type="submit"><img class="img-btn" src="./assets/img/de_imgs/create_btn.png"></button>
          <img id="character-creation-form-back" class="img-btn" src="./assets/img/de_imgs/back_btn.png">
        </div>
      </form>
    </div>
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
      levels: [
        {
          level: 1,
          itemsCollected: [],
          coinsCollected: [],
        },
      ],
      coins: 0,
      deaths: 0,
      kills: 0,
      inventory: [],
      perks: [],
    });
  } else {
    newCharacters = [
      {
        id: Date.now(),
        name: charName,
        type: charType,
        levels: [
          {
            level: 1,
            itemsCollected: [],
            coinsCollected: [],
          },
        ],
        coins: 0,
        deaths: 0,
        kills: 0,
        inventory: [],
        perks: [],
      },
    ];
  }
  Notify("Charakter", "Charakter erfolgreich erstellt", "success", 3000);
  localStorage.setItem("characters", JSON.stringify(newCharacters));
  await ChangeScreen("character-selection");
}
