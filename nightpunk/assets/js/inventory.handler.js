const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
};

const gameState = {
  nearItems: [],
  selectedItemIndex: 0,
  selectedInventoryItemSlot: 0,
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

function setupInventoryControls() {
  document.removeEventListener("keydown", handleInventoryNavigation);
  document.addEventListener("keydown", handleInventoryNavigation);
}

function handleInventoryNavigation(event) {
  switch (event.key) {
    case settings.controls.itemslot1:
      if (game.player.dead) return;
      gameState.selectedInventoryItemSlot = 1;
      renderInventoryItemSelection();
      event.preventDefault();
      break;
    case settings.controls.itemslot2:
      if (game.player.dead) return;
      gameState.selectedInventoryItemSlot = 2;
      renderInventoryItemSelection();
      event.preventDefault();
      break;
    case settings.controls.itemslot3:
      if (game.player.dead) return;
      gameState.selectedInventoryItemSlot = 3;
      renderInventoryItemSelection();
      event.preventDefault();
      break;
    case settings.controls.itemslot4:
      if (game.player.dead) return;
      gameState.selectedInventoryItemSlot = 4;
      renderInventoryItemSelection();
      event.preventDefault();
      break;
    case settings.controls.drop:
      if (game.player.dead) return;
      handleDropInventoryItem();
      event.preventDefault();
      break;
  }
}

function handleDropInventoryItem() {
  if (
    gameState.selectedInventoryItemSlot > 0 &&
    game.player.inventory.find(
      (item) => item.slot === gameState.selectedInventoryItemSlot
    )?.name
  ) {
    console.log(
      "Dropping Item: " +
        game.player.inventory.find(
          (item) => item.slot === gameState.selectedInventoryItemSlot
        )?.name
    );
    const itemToDrop = game.player.inventory.find(
      (item) => item.slot === gameState.selectedInventoryItemSlot
    );
    const itemToDrop_Copy = { ...itemToDrop };
    game.player.removeInventoryItem(
      itemToDrop_Copy,
      itemToDrop_Copy.amount,
      true
    );
  }
}

function renderInventoryItemSelection(empty) {
  if (
    !game.player.inventory.find(
      (item) => item.slot === gameState.selectedInventoryItemSlot
    )?.name &&
    !empty
  ) {
    return;
  }

  if (
    gameState.selectedInventoryItemSlot === game.player.selectedItem?.slot ||
    empty
  ) {
    gameState.selectedInventoryItemSlot = null;
  }

  let inventorySlots = document.querySelectorAll(".game-screen-inventory-slot");

  inventorySlots.forEach((el) => {
    el.style.backgroundImage = 'url("./assets/img/inventory/empty.png")';
  });

  if (gameState.selectedInventoryItemSlot) {
    game.ui.inventory[
      "slot" + gameState.selectedInventoryItemSlot
    ].style.backgroundImage = 'url("./assets/img/inventory/selected.png")';
    game.player.selectedItem = game.player.inventory.find(
      (item) => item.slot === gameState.selectedInventoryItemSlot
    );
  } else {
    game.player.selectedItem = null;
  }
  game.player.updatePlayerSheet();
}

function handleKeyNavigation(event) {
  if (!gameState.nearItems || gameState.nearItems.length === 0) return;

  switch (event.key) {
    case KEYS.UP:
      if (game.player.dead) return;
      gameState.selectedItemIndex =
        (gameState.selectedItemIndex - 1 + gameState.nearItems.length) %
        gameState.nearItems.length;
      renderItemSelection();
      event.preventDefault();
      break;
    case KEYS.DOWN:
      if (game.player.dead) return;
      gameState.selectedItemIndex =
        (gameState.selectedItemIndex + 1) % gameState.nearItems.length;
      renderItemSelection();
      event.preventDefault();
      break;
    case settings.controls.interact:
      if (game.player.dead) return;
      if (gameState.nearItems.length > 0) {
        const selectedItem = gameState.nearItems[gameState.selectedItemIndex];
        selectedItem.collected = true;
        game.player.addInventoryItem(selectedItem);
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
    el.style.backgroundColor = "#4b4b4b";
  });

  if (
    itemElements.length > 0 &&
    gameState.selectedItemIndex < itemElements.length
  ) {
    const selectedElement = itemElements[gameState.selectedItemIndex];
    selectedElement.classList.add("selected");
    selectedElement.style.backgroundColor = "#4a89dc";
  }
}

function updateHelpNotifyUI() {
  if (!gameState.helpNotifyRef) return;

  gameState.helpNotifyRef.innerHTML = "";
  gameState.helpNotifyRef.style.display = "block";

  gameState.nearItems.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "game-screen-helpnotify-item";
    itemElement.textContent = `F ${item.label} ${item.amount}x`;
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

function checkAddSlot(inventory, newItem) {
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
      inventory.push(itemToAdd);
      console.log(`Item "${newItem.name}" in Slot ${slot} hinzugefügt.`);
      return inventory;
    }
  }

  // Alle Slots sind besetzt
  Notify(
    locales[settings.language].notifyInventoryTitle,
    locales[settings.language].notifyInventorySlotsTaken,
    "error",
    3500
  );
  return;
}
