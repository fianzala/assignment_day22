// ASSIGNMENT DAY 22 : Add const usesLocalCart, function updateLocalCartDisplay(), function addSelectionToLocalCart(), changeQuantityByStep(), showLocalCartStatus().
// Day 16 · product-interaction.js (shared by product detail 1, 2 and 3)
// Day 15: Number(), subtotal, checkout bar.
// Day 16: switch (stock per variant), if / else if / else (stock badge, stepper, validation,
// free shipping) and for (unit list in the checkout bar).
const form = document.querySelector('#productForm');
const priceElement = document.querySelector('#productPrice');
const variantInput = document.querySelector('#variant');
const quantityInput = document.querySelector('#quantity');
const variantLabel = document.querySelector('label[for="variant"]').textContent; // "Ukuran" / "Warna" / "Varian"
const summary = document.querySelector('#selectionSummary');
const subtotalText = document.querySelector('#subtotalText');
const checkoutBar = document.querySelector('#checkoutBar');
const checkoutButton = document.querySelector('#checkoutButton');
const checkoutToast = document.querySelector('#toast');
// Day 16 elements
const stockBadge = document.querySelector('#stockBadge');
const formMessage = document.querySelector('#formMessage');
const minusButton = document.querySelector('#quantityMinus');
const plusButton = document.querySelector('#quantityPlus');
const unitList = document.querySelector('#unitList');
const shippingInfo = document.querySelector('#shippingInfo');
const FREE_SHIPPING_MIN = 300000;
// ASSIGNMENT DAY 22 : Penanda bahwa form ini menggunakan keranjang lokal.
const usesLocalCart = form.dataset.interaction === 'local-cart';
let localCartQuantity = 0;
// ASSIGNMENT DAY 22 : Simpan detail item per ukuran dalam memori halaman.
const localCartItems = [];

// Day 16 · Step 1: stock per variant with switch (practice numbers, not real API data)
function getStock(variant) {
  // Product 2 (API): the API has ONE total stock, script.js puts it in form.dataset.stock
  if (form.dataset.stock !== undefined) {
    return Number(form.dataset.stock);
  }
  let stock;
  switch (variant) {
    case 'S':
      stock = 5;
      break;
    case 'M':
      stock = 3;
      break;
    case 'L':
      stock = 0;
      break;
    case 'Putih':
      stock = 6;
      break;
    case 'Hitam':
      stock = 2;
      break;
    case 'Krem':
      stock = 0;
      break;
    default:
      stock = -1;                                           // unknown variant
  }
  return stock;
}

function showMessage(text) {
  formMessage.textContent = text;
  formMessage.classList.remove('is-success');
  formMessage.hidden = false;
}

function hideMessage() {
  formMessage.textContent = '';
  formMessage.classList.remove('is-success');
  formMessage.hidden = true;
}

// Day 16 · Step 2: stock badge with if / else if / else (runs every time the variant changes)
function updateStockBadge() {
  const variant = variantInput.value;
  const stock = getStock(variant);
  stockBadge.classList.remove('is-ok', 'is-low', 'is-empty');
  if (usesLocalCart) {
    stockBadge.textContent = Number.isSafeInteger(stock) && stock >= 0
      ? 'Stok total: ' + stock + ' · Keranjang lokal: ' + localCartQuantity
      : 'Data stok total tidak valid.';
    stockBadge.hidden = false;
    return;
  }
  if (variant === '') {
    stockBadge.hidden = true;
    return;
  } else if (stock === -1) {
    stockBadge.textContent = variantLabel + ' tidak dikenal';
    stockBadge.classList.add('is-empty');
  } else if (stock === 0) {
    stockBadge.textContent = variantLabel + ' ' + variant + ' habis';
    stockBadge.classList.add('is-empty');
  } else if (stock <= 3) {
    stockBadge.textContent = 'Sisa ' + stock + ', segera habis!';
    stockBadge.classList.add('is-low');
  } else {
    stockBadge.textContent = stock + ' tersedia';
    stockBadge.classList.add('is-ok');
  }
  stockBadge.hidden = false;
}

if (!usesLocalCart) {
variantInput.addEventListener('change', () => {
  hideMessage();
  checkoutBar.hidden = true;                                // old summary no longer matches the choice
  updateStockBadge();
  const stock = getStock(variantInput.value);
  if (stock > 0 && Number(quantityInput.value) > stock) {
    quantityInput.value = stock;                            // keep the quantity inside the new stock
  }
});

// Day 16 · Step 3: stepper − / + with if / else (min 1, max = stock of the chosen variant)
minusButton.addEventListener('click', () => {
  const quantity = Number(quantityInput.value);
  if (quantity > 1) {
    quantityInput.value = quantity - 1;
    hideMessage();
  } else {
    showMessage('Jumlah minimal 1.');
  }
});

plusButton.addEventListener('click', () => {
  const quantity = Number(quantityInput.value);
  const stock = getStock(variantInput.value);
  if (variantInput.value === '') {
    showMessage('Pilih ' + variantLabel.toLowerCase() + ' dulu.');
  } else if (stock === 0) {
    showMessage(variantLabel + ' ' + variantInput.value + ' sedang habis.');
  } else if (quantity >= stock) {
    showMessage('Maksimal ' + stock + ', sesuai stok.');
  } else {
    quantityInput.value = quantity + 1;
    hideMessage();
  }
});

}

// ASSIGNMENT DAY 22 : Memvalidasi pilihan dan memperbarui ringkasan subtotal.
// Logika submit lama diekstrak untuk dipakai ulang oleh event input/change.
function updateSelectionSummary() {
  const price = Number(priceElement.dataset.price);         // string -> number
  const quantity = Number(quantityInput.value);             // string -> number
  const variant = variantInput.value;                       // string
  const stock = getStock(variant);
  // ASSIGNMENT DAY 22 : Kurangi stok dengan jumlah yang sudah masuk keranjang lokal.
  const remainingStock = usesLocalCart ? Math.max(0, stock - localCartQuantity) : stock;
  unitList.textContent = '';                                // clear units from the last submit

  // Step 4: validation with if / else if / else. The first true wins, so the order matters.
  let error = '';
  if (usesLocalCart && (!Number.isSafeInteger(stock) || stock < 0)) {
    error = 'Data stok total tidak valid.';
  } else if (variant === '' || !Array.from(variantInput.options).some((option) => option.value === variant)) {
    error = 'Pilih ' + variantLabel.toLowerCase() + ' dulu.';
  } else if (stock === -1) {
    error = variantLabel + ' tidak valid.';
  } else if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    error = 'Jumlah harus bilangan bulat positif.';
  } else if (!Number.isFinite(price) || price <= 0) {
    error = 'Harga produk belum tersedia.';
  } else if (stock === 0) {
    error = variantLabel + ' ' + variant + ' sedang habis.';
  } else if (quantity > remainingStock) {
    error = 'Jumlah melebihi stok (sisa ' + remainingStock + ').';
  }

  if (error !== '') {
    showMessage(error);
    checkoutBar.hidden = true;
    summary.textContent = '';
    subtotalText.textContent = 'Rp0';
    shippingInfo.textContent = '';
    return false;
  }
  hideMessage();

  // Day 15 code: subtotal + summary
  let subtotal = 0;
  subtotal += price * quantity;
  summary.textContent = variantLabel + ': ' + variant
    + ' · Jumlah: ' + quantity
    + ' · Harga: Rp' + price.toLocaleString('id-ID');
  subtotalText.textContent = 'Rp' + subtotal.toLocaleString('id-ID');

  // ASSIGNMENT DAY 22 : Gratis ongkir berdasarkan keranjang ditambah pilihan baru.
  const cartTotal = usesLocalCart
    ? localCartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
  const totalForFreeShipping = cartTotal + subtotal;
  if (totalForFreeShipping >= FREE_SHIPPING_MIN) {
    shippingInfo.textContent = 'Gratis ongkir!';
    shippingInfo.classList.add('is-free');
  } else {
    const missing = FREE_SHIPPING_MIN - totalForFreeShipping;
    shippingInfo.textContent = 'Tambah Rp' + missing.toLocaleString('id-ID') + ' lagi untuk gratis ongkir';
    shippingInfo.classList.remove('is-free');
  }

  // Step 6: one chip per unit with for
  for (let unit = 1; unit <= quantity; unit += 1) {
    const item = document.createElement('li');
    item.textContent = 'Unit ' + unit + ' · ' + variant;
    unitList.appendChild(item);
  }
  // Same result with while. Use ONE version at a time (comment out the for above first).
  // let unit = 1;
  // while (unit <= quantity) {
  //   const item = document.createElement('li');
  //   item.textContent = 'Unit ' + unit + ' · ' + variant;
  //   unitList.appendChild(item);
  //   unit += 1;                                           // without this the loop never stops
  // }

  checkoutBar.hidden = false;
  return true;
}

if (!usesLocalCart) {
form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSelectionSummary();
});
checkoutButton.addEventListener('click', () => {
  checkoutToast.textContent = 'Demo: halaman pembayaran belum tersedia.';
  checkoutToast.classList.add('is-visible');
  setTimeout(() => checkoutToast.classList.remove('is-visible'), 2500);
});
}
// Expected (product 1, Rp150.000): S · 2 -> Subtotal Rp300.000, "Gratis ongkir!", 2 units
// M · 1 -> Rp150.000, "Tambah Rp150.000 lagi untuk gratis ongkir" | M · 4 -> "Jumlah melebihi stok (sisa 3)."
// L -> badge "Ukuran L habis", submit -> "Ukuran L sedang habis."
// Product 2: script.js fills data-price and data-stock from the API before the button is enabled.

// ASSIGNMENT DAY 22 : Memperbarui jumlah cart lokal dan status stok total.
function updateLocalCartDisplay() {
  document.querySelector('#bag-count').textContent = String(localCartQuantity);
  document.querySelector('.bag-button').setAttribute('aria-label', 'Keranjang belanja, ' + localCartQuantity + ' item');
  updateStockBadge();
}

// ASSIGNMENT DAY 22 : Menambahkan pilihan valid ke cart lokal dan memberi feedback.
function addSelectionToLocalCart(event) {
  event.preventDefault();
  if (!updateSelectionSummary()) return;
  const quantity = Number(quantityInput.value);
  const existingItem = localCartItems.find((item) => item.variant === variantInput.value);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    localCartItems.push({
      name: document.querySelector('#product-title').textContent,
      image: document.querySelector('#hero-image').src,
      variant: variantInput.value,
      quantity,
      price: Number(priceElement.dataset.price),
    });
  }
  localCartQuantity = localCartItems.reduce((total, item) => total + item.quantity, 0);
  updateLocalCartDisplay();
  showMessage('Berhasil menambahkan ' + quantity + ' unit ukuran ' + variantInput.value + '. Keranjang lokal: ' + localCartQuantity + ' unit.');
  formMessage.classList.add('is-success');
}

// ASSIGNMENT DAY 22 : Mengubah quantity melalui tombol stepper dengan validasi.
function changeQuantityByStep(step) {
  const quantity = Number(quantityInput.value);
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    updateSelectionSummary();
    return;
  }
  if (quantity + step < 1) {
    showMessage('Jumlah minimal 1.');
    return;
  }
  quantityInput.value = String(quantity + step);
  updateSelectionSummary();
}

// ASSIGNMENT DAY 22 : Membuka panel detail keranjang lokal tanpa checkout.
function showLocalCartStatus() {
  renderLocalCartItems();
  document.querySelector('#cartDrawer').showModal();
  document.body.classList.add('cart-drawer-open');
}

// ASSIGNMENT DAY 22 : Render thumbnail, detail item, subtotal, dan total keranjang.
function renderLocalCartItems() {
  const list = document.querySelector('#cartDrawerItems');
  list.replaceChildren();
  let totalPrice = 0;
  localCartItems.forEach((item) => {
    const row = document.createElement('li');
    row.className = 'cart-drawer-item';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.name;
    const selection = document.createElement('p');
    selection.textContent = 'Ukuran: ' + item.variant + ' · Jumlah: ' + item.quantity;
    const itemSubtotal = document.createElement('p');
    const value = item.price * item.quantity;
    itemSubtotal.textContent = 'Subtotal: Rp' + value.toLocaleString('id-ID');
    details.append(title, selection, itemSubtotal);
    row.append(image, details);
    list.append(row);
    totalPrice += value;
  });
  document.querySelector('#emptyCartMessage').hidden = localCartItems.length > 0;
  document.querySelector('#cartDrawerTotal').textContent = 'Rp' + totalPrice.toLocaleString('id-ID');
}

// ASSIGNMENT DAY 22 : Menutup panel keranjang melalui tombol atau backdrop.
function closeLocalCartDrawer() {
  document.querySelector('#cartDrawer').close();
}


// ASSIGNMENT DAY 22 : Sinkronkan warna bulatan ukuran dengan pilihan dropdown.
function updateSelectedSizeIndicator() {
  document.querySelectorAll('#accords span').forEach((size) => {
    const isSelected = size.textContent.trim() === variantInput.value;
    size.classList.toggle('is-selected', isSelected);
    if (isSelected) {
      size.setAttribute('aria-current', 'true');
    } else {
      size.removeAttribute('aria-current');
    }
  });
}
