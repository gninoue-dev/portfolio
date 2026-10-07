// ============================================
// THÈME PERSONNEL — version provisoire (remplacée par la suite)
// ============================================
(function () {
  enregistrerTheme('personnel', {
    monter(zone) {
      zone.innerHTML = `
        <section class="personnel-provisoire">
          <h1 data-i18n="theme.personnel"></h1>
          <p data-i18n="commun.a-venir"></p>
        </section>`;
    },
    demonter() {}
  });
})();
