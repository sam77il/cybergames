const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  INTERACT: "f",
};

const gameState = {
  nearItems: [],
  selectedItemIndex: 0,
  keyHandlerAttached: false,
  helpNotifyRef: null,
};

function initializeInteractionSystem() {
  gameState.helpNotifyRef = document.getElementById("game-screen-helpnotify");

  setupKeyboardControls();
}

function setupKeyboardControls() {
  if (gameState.keyHandlerAttached) return;

  document.removeEventListener("keydown", handleKeyNavigation);
  document.addEventListener("keydown", handleKeyNavigation);
  gameState.keyHandlerAttached = true;
}

function handleKeyNavigation(event) {
  if (!gameState.nearItems || gameState.nearItems.length === 0) return;

  switch (event.key) {
    case KEYS.UP:
      gameState.selectedItemIndex =
        (gameState.selectedItemIndex - 1 + gameState.nearItems.length) %
        gameState.nearItems.length;
      renderItemSelection();
      event.preventDefault();
      break;
    case KEYS.DOWN:
      gameState.selectedItemIndex =
        (gameState.selectedItemIndex + 1) % gameState.nearItems.length;
      renderItemSelection();
      event.preventDefault();
      break;
    case KEYS.INTERACT:
      if (gameState.nearItems.length > 0) {
        const selectedItem = gameState.nearItems[gameState.selectedItemIndex];
        selectedItem.collected = true;
        player.addInventoryItem(selectedItem);
        console.log(`Du hast aktiviert: ${selectedItem.name}`);
      }
      break;
  }
}

function renderItemSelection() {
  if (!gameState.helpNotifyRef) return;

  const itemElements = gameState.helpNotifyRef.querySelectorAll(
    ".game-screen-helpnotify-item"
  );

  itemElements.forEach((el) => {
    el.classList.remove("selected");
    el.style.backgroundColor = "";
    el.style.color = "";
  });

  if (
    itemElements.length > 0 &&
    gameState.selectedItemIndex < itemElements.length
  ) {
    const selectedElement = itemElements[gameState.selectedItemIndex];
    selectedElement.classList.add("selected");
    selectedElement.style.backgroundColor = "#4a89dc";
    selectedElement.style.color = "white";
  }
}

function updateHelpNotifyUI() {
  if (!gameState.helpNotifyRef) return;

  gameState.helpNotifyRef.innerHTML = "";
  gameState.helpNotifyRef.style.display = "block";

  gameState.nearItems.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "game-screen-helpnotify-item";
    itemElement.textContent = `F ${item.label}`;
    itemElement.dataset.index = index;

    if (index === gameState.selectedItemIndex) {
      itemElement.classList.add("selected");
      itemElement.style.backgroundColor = "#4a89dc";
      itemElement.style.color = "white";
    }

    gameState.helpNotifyRef.appendChild(itemElement);
  });
}

function areItemArraysEqual(items1, items2) {
  if (!items1 || !items2) return false;
  if (items1.length !== items2.length) return false;

  for (let i = 0; i < items1.length; i++) {
    if (!items1[i] || !items2[i]) return false;

    const id1 = items1[i].id || items1[i].name;
    const id2 = items2[i].id || items2[i].name;

    if (id1 !== id2) return false;
  }

  return true;
}

function checkSlot(inventory, newItem) {
  const existingItemIndex = inventory.findIndex(
    (item) => item.name === newItem.name
  );

  if (existingItemIndex !== -1) {
    inventory[existingItemIndex].amount += newItem.amount;

    return inventory;
  }

  // Suche nach einem freien Slot (maximal 4 Slots)
  for (let slot = 1; slot <= 4; slot++) {
    // Prüfen, ob der aktuelle Slot besetzt ist
    const isSlotOccupied = inventory.some((item) => item.slot === slot);

    if (!isSlotOccupied) {
      // Freier Slot gefunden, neues Item hinzufügen
      const itemToAdd = {
        name: newItem.name,
        label: newItem.label,
        amount: newItem.amount,
        slot,
      };
      console.log(itemToAdd);
      inventory.push(itemToAdd);
      console.log(`Item "${newItem.name}" in Slot ${slot} hinzugefügt.`);
      return inventory;
    }
  }

  // Alle Slots sind besetzt
  console.log("Alle Slots sind besetzt. Item konnte nicht hinzugefügt werden.");
  return;
}
