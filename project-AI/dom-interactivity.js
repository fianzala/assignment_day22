// Penghubung event saja; gunakan fungsi dari product-interaction.js.
// product-interaction.js harus dimuat terlebih dahulu dengan defer.
if (usesLocalCart) {
  variantInput.addEventListener('change', updateSelectionSummary);
  variantInput.addEventListener('change', updateSelectedSizeIndicator);
  updateSelectedSizeIndicator();
  quantityInput.addEventListener('input', updateSelectionSummary);
  minusButton.addEventListener('click', () => changeQuantityByStep(-1));
  plusButton.addEventListener('click', () => changeQuantityByStep(1));
  form.addEventListener('submit', addSelectionToLocalCart);
  document.querySelector('.bag-button').addEventListener('click', showLocalCartStatus);
  checkoutButton.addEventListener('click', showLocalCartStatus);
  const cartDrawer = document.querySelector('#cartDrawer');
  document.querySelector('#closeCartDrawer').addEventListener('click', closeLocalCartDrawer);
  cartDrawer.addEventListener('click', (event) => {
    if (event.target !== cartDrawer) return;
    const bounds = cartDrawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      closeLocalCartDrawer();
    }
  });
  cartDrawer.addEventListener('close', () => document.body.classList.remove('cart-drawer-open'));
  updateLocalCartDisplay();
}