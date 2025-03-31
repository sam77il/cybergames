let shopMenu = {
  content: null,
  itemList: null,
  perkList: null,
  tab: null,
};

function Shop_Handler() {
  screens.shop.innerHTML = `
    <div class="menus-content pause-menu">
      <h2>Shop</h2>

      <header class="shop-menu-header">
        <ul class="shop-menu-list">
          <li><img class="img-btn small-btn" id="shop-items" src="./assets/img/international/items_btn.png"></li>
          <li><img class="img-btn small-btn" id="shop-perks" src="./assets/img/international/perks_btn.png"></li>
        </ul>
      </header>

      <div id="shop-content"></div>
      
      <div class="shop-menu-footer">
        <img class="img-btn small-btn" id="shop-back" src="./assets/img/${settings.language}_imgs/back_btn.png">
      </div>
    </div>
  `;
  shopMenu.content = document.querySelector("#shop-content");
  const SHOP_BACK = document.querySelector("#shop-back");
  const SHOP_ITEMS = document.querySelector("#shop-items");
  const SHOP_PERKS = document.querySelector("#shop-perks");

  SHOP_BACK.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    handlePauseMenu();
  });
  SHOP_ITEMS.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    ChangeShopScreen("items");
  });
  SHOP_PERKS.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    ChangeShopScreen("perks");
  });
}

function ChangeShopScreen(screen) {
  shopMenu.content.innerHTML = "";
  shopMenu.tab = screen;

  switch (screen) {
    case "items":
      shopMenu.content.innerHTML = `
        <h3>Items</h3>

        <div id="shop-menu-items" class="shop-menu-items"></div>
      `;
      shopMenu.itemList = document.querySelector("#shop-menu-items");
      for (let item of config.shop.items) {
        ShopItem(item);
      }
      const ITEMS = document.querySelectorAll(".shop-menu-item-buy");
      for (let button of ITEMS) {
        button.addEventListener("click", (event) => {
          game.sounds.ui.pause();
          game.sounds.ui.currentTime = 0;
          game.sounds.ui.play();
          if (game.player.coins >= Number(event.target.dataset.price)) {
            game.player.addInventoryItem(
              {
                name: items[event.target.dataset.item].name,
                label: items[event.target.dataset.item].label,
                amount: Number(event.target.dataset.amount),
                price: Number(event.target.dataset.price),
              },
              "shop"
            );

            game.player.updateCoins(
              "remove",
              {
                amount: Number(event.target.dataset.price),
              },
              "shop"
            );
          } else {
            Notify("Shop", "Du hast nicht genug Coins", "error", 3500);
          }
        });
      }
      break;
    case "perks":
      shopMenu.content.innerHTML = `
        <h3>Perks</h3>

        <div id="shop-menu-perks" class="shop-menu-perks"></div>
      `;
      shopMenu.perkList = document.querySelector("#shop-menu-perks");
      for (let perk of config.shop.perks) {
        ShopPerk(perk);
      }
      const PERKS = document.querySelectorAll(".shop-menu-perk-buy");
      for (let button of PERKS) {
        button.addEventListener("click", (event) => {
          game.sounds.ui.pause();
          game.sounds.ui.currentTime = 0;
          game.sounds.ui.play();
          if (game.player.coins >= Number(event.target.dataset.price)) {
            game.player.addPerk(event.target.dataset.perk);
            game.player.updateCoins(
              "remove",
              {
                amount: Number(event.target.dataset.price),
              },
              "shop"
            );
          } else {
            Notify("Shop", "Du hast nicht genug Coins", "error", 3500);
          }
        });
      }
      break;
    default:
      shopMenu.content.innerHTML = `
        <p>${locales[settings.language].settingsDefaultMessage}</p>
      `;

      break;
  }
}

function ShopItem({ item, amount, price }) {
  shopMenu.itemList.innerHTML += `
    <div class="shop-menu-item">
        <img src="./assets/img/items/${item}.png">
        <p>${amount}x</p>
        <button class="shop-menu-item-buy" data-item="${item}" data-price="${price}" data-amount="${amount}">${
    locales[settings.language].shopScreenBuy
  } ${price} Coins</button>
    </div>
  `;
}

function ShopPerk({ perk, price }) {
  shopMenu.perkList.innerHTML += `
    <div class="shop-menu-item">
        <img src="./assets/img/perks/${perk}.png">
        <button class="shop-menu-perk-buy" data-perk="${perk}" data-price="${price}">${
    locales[settings.language].shopScreenBuy
  } ${price} Coins</button>
    </div>
  `;
}
