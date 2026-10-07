// ============================================
// THÈME GAMING — version provisoire (remplacée par la suite)
// ============================================
(function () {
  enregistrerTheme('gaming', {
    monter(zone) {
      zone.innerHTML = `
        <section class="gaming-provisoire">
          <h1 data-i18n="theme.gaming"></h1>
          <p data-i18n="commun.a-venir"></p>
        </section>`;
    },
    demonter() {}
  });
})();
