// ============================================
// L'ÎLE DES FRAGMENTS — Graphismes
// Tout est dessiné en code (pixel art procédural) :
// aucune image externe, aucun asset protégé.
// ============================================
(function () {
  const JeuIle = window.JeuIle = window.JeuIle || {};

  const PALETTE = {
    eauProfonde: '#0f2c4d',
    eau: '#17466f',
    eauClaire: '#2a6a9a',
    ecume: '#9fe3ff',
    sable: '#d6b479',
    sableOmbre: '#b48f58',
    herbe: '#3d7a4c',
    herbeClaire: '#4f9459',
    herbeSombre: '#2c5e3c',
    chemin: '#8c6b45',
    cheminClair: '#a8845a',
    cheminSombre: '#6f5235',
    dalle: '#6d7488',
    dalleClaire: '#8a92a6',
    dalleSombre: '#4f5566',
    feuillage: '#2f7048',
    feuillageClair: '#4a9a5e',
    feuillageSombre: '#1c4a31',
    tronc: '#5e3c25',
    troncSombre: '#3e2717',
    roche: '#6d7480',
    rocheClaire: '#949cab',
    rocheSombre: '#4a505b',
    mur: '#b0835a',
    murSombre: '#8a633f',
    toit: '#8e2f45',
    toitClair: '#b2465c',
    toitSombre: '#62202f',
    lumiereChaude: '#ffd166',
    lumiereFroide: '#7fe3ff',
    rune: '#7fc1ff',
    runeActive: '#ffd166',
    contour: '#151021',
    peau: '#7a4a2a',
    peauOmbre: '#5c361d',
    cape: '#2ec4b6',
    capeSombre: '#1d8a80',
    echarpe: '#ff6b35',
    pantalon: '#2a2238',
    blanc: '#f8f1e5',
    orbe: '#8affc1',
    champignon: '#c39bff',
    bugRose: '#ff3d9a',
    bugCyan: '#3df2ff'
  };
  JeuIle.PALETTE = PALETTE;

  // Générateur pseudo-aléatoire déterministe (mulberry32)
  function aleatoireGraine(graine) {
    let a = graine >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let r = Math.imul(a ^ a >>> 15, 1 | a);
      r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r;
      return ((r ^ r >>> 14) >>> 0) / 4294967296;
    };
  }
  JeuIle.aleatoireGraine = aleatoireGraine;

  function creerCanevas(largeur, hauteur, dessin) {
    const canevas = document.createElement('canvas');
    canevas.width = largeur;
    canevas.height = hauteur;
    const ctx = canevas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    if (dessin) dessin(ctx);
    return canevas;
  }
  JeuIle.creerCanevas = creerCanevas;

  function pixel(ctx, x, y, couleur, l = 1, h = 1) {
    ctx.fillStyle = couleur;
    ctx.fillRect(Math.round(x), Math.round(y), l, h);
  }
  JeuIle.pixel = pixel;

  // Disque "pixel" (sans anticrénelage)
  function disque(ctx, cx, cy, r, couleur) {
    ctx.fillStyle = couleur;
    for (let y = -r; y <= r; y++) {
      const demiLargeur = Math.floor(Math.sqrt(r * r - y * y) + 0.35);
      ctx.fillRect(Math.round(cx - demiLargeur), Math.round(cy + y), demiLargeur * 2 + 1, 1);
    }
  }
  JeuIle.disque = disque;

  function ellipse(ctx, cx, cy, rx, ry, couleur) {
    ctx.fillStyle = couleur;
    for (let y = -ry; y <= ry; y++) {
      const demi = Math.floor(rx * Math.sqrt(1 - (y * y) / (ry * ry)) + 0.35);
      ctx.fillRect(Math.round(cx - demi), Math.round(cy + y), demi * 2 + 1, 1);
    }
  }
  JeuIle.ellipse = ellipse;

  // ---------- Arbres ----------
  function creerArbre(graine) {
    const alea = aleatoireGraine(graine);
    const estSapin = alea() < 0.35;
    return creerCanevas(32, 44, ctx => {
      // tronc
      pixel(ctx, 14, 30, PALETTE.troncSombre, 5, 11);
      pixel(ctx, 15, 30, PALETTE.tronc, 3, 11);
      pixel(ctx, 13, 40, PALETTE.troncSombre, 7, 1);
      if (estSapin) {
        const etages = [[16, 6, 4], [16, 12, 7], [16, 19, 10], [16, 26, 12]];
        etages.forEach(([cx, haut, demi], i) => {
          for (let y = 0; y < 9; y++) {
            const l = Math.round((demi * (y + 1)) / 9);
            pixel(ctx, cx - l - 1, haut + y, PALETTE.contour, l * 2 + 3, 1);
          }
          for (let y = 0; y < 8; y++) {
            const l = Math.round((demi * (y + 1)) / 9);
            pixel(ctx, cx - l, haut + y, i % 2 ? PALETTE.feuillage : PALETTE.feuillageSombre, l * 2 + 1, 1);
            pixel(ctx, cx - l, haut + y, PALETTE.feuillageClair, Math.max(1, Math.floor(l * 0.6)), 1);
          }
        });
      } else {
        const touffes = [[16, 22, 11], [10, 18, 7], [22, 17, 7], [16, 12, 8]];
        touffes.forEach(([x, y, r]) => disque(ctx, x, y, r + 1, PALETTE.contour));
        touffes.forEach(([x, y, r]) => disque(ctx, x, y, r, PALETTE.feuillageSombre));
        touffes.forEach(([x, y, r]) => disque(ctx, x - 1, y - 1, r - 2, PALETTE.feuillage));
        touffes.forEach(([x, y, r]) => disque(ctx, x - 3, y - 3, Math.max(1, r - 6), PALETTE.feuillageClair));
        const dansFeuillage = (x, y) => touffes.some(([tx, ty, r]) => (x - tx) ** 2 + (y - ty) ** 2 < (r - 1) ** 2);
        for (let i = 0; i < 26; i++) {
          const x = 6 + Math.floor(alea() * 20);
          const y = 6 + Math.floor(alea() * 24);
          if (dansFeuillage(x, y)) pixel(ctx, x, y, alea() < 0.5 ? PALETTE.feuillageClair : PALETTE.feuillageSombre);
        }
        // quelques fruits lumineux, pour la magie
        if (alea() < 0.3) {
          pixel(ctx, 9 + Math.floor(alea() * 14), 12 + Math.floor(alea() * 12), '#ffb3c7');
          pixel(ctx, 9 + Math.floor(alea() * 14), 12 + Math.floor(alea() * 12), '#ffb3c7');
        }
      }
    });
  }

  function creerRocher(graine) {
    const alea = aleatoireGraine(graine);
    return creerCanevas(18, 14, ctx => {
      ellipse(ctx, 9, 8, 8, 5, PALETTE.contour);
      ellipse(ctx, 9, 8, 7, 4, PALETTE.rocheSombre);
      ellipse(ctx, 8, 7, 5, 3, PALETTE.roche);
      ellipse(ctx, 7, 6, 2, 1, PALETTE.rocheClaire);
      if (alea() < 0.5) pixel(ctx, 12, 9, PALETTE.feuillage, 3, 1);
    });
  }

  // ---------- Maison du village ----------
  function creerMaison(variante) {
    return creerCanevas(44, 46, ctx => {
      const toit = variante % 2 ? PALETTE.toit : '#2f5d8a';
      const toitClair = variante % 2 ? PALETTE.toitClair : '#4479ad';
      const toitSombre = variante % 2 ? PALETTE.toitSombre : '#1f3f60';
      // murs
      pixel(ctx, 5, 22, PALETTE.contour, 34, 23);
      pixel(ctx, 6, 23, PALETTE.mur, 32, 21);
      for (let y = 26; y < 44; y += 4) pixel(ctx, 6, y, PALETTE.murSombre, 32, 1);
      // toit en triangle
      for (let y = 0; y < 18; y++) {
        const demi = Math.round(4 + y * 1.25);
        pixel(ctx, 22 - demi - 1, 6 + y, PALETTE.contour, demi * 2 + 2, 1);
        pixel(ctx, 22 - demi, 6 + y, y % 3 === 2 ? toitSombre : toit, demi * 2, 1);
        pixel(ctx, 22 - demi, 6 + y, toitClair, Math.max(1, Math.floor(demi * 0.5)), 1);
      }
      pixel(ctx, 1, 23, PALETTE.contour, 42, 2);
      pixel(ctx, 2, 23, toitSombre, 40, 1);
      // porte
      pixel(ctx, 18, 32, PALETTE.contour, 9, 13);
      pixel(ctx, 19, 33, PALETTE.troncSombre, 7, 12);
      pixel(ctx, 24, 39, PALETTE.lumiereChaude, 1, 1);
      // fenêtres éclairées
      [[9, 29], [30, 29]].forEach(([x, y]) => {
        pixel(ctx, x - 1, y - 1, PALETTE.contour, 7, 7);
        pixel(ctx, x, y, PALETTE.lumiereChaude, 5, 5);
        pixel(ctx, x + 2, y, PALETTE.murSombre, 1, 5);
        pixel(ctx, x, y + 2, PALETTE.murSombre, 5, 1);
      });
      // cheminée
      pixel(ctx, 30, 6, PALETTE.contour, 6, 9);
      pixel(ctx, 31, 7, PALETTE.rocheSombre, 4, 8);
    });
  }

  function creerPuits() {
    return creerCanevas(22, 24, ctx => {
      pixel(ctx, 3, 4, PALETTE.troncSombre, 2, 12);
      pixel(ctx, 17, 4, PALETTE.troncSombre, 2, 12);
      pixel(ctx, 1, 2, PALETTE.contour, 20, 4);
      pixel(ctx, 2, 3, PALETTE.toit, 18, 2);
      ellipse(ctx, 11, 16, 9, 6, PALETTE.contour);
      ellipse(ctx, 11, 16, 8, 5, PALETTE.roche);
      ellipse(ctx, 11, 15, 6, 3, PALETTE.eauProfonde);
      pixel(ctx, 8, 14, PALETTE.ecume, 2, 1);
      pixel(ctx, 10, 6, PALETTE.contour, 1, 7);
    });
  }

  // ---------- Stèle de projet ----------
  function creerStele(allumee) {
    return creerCanevas(16, 30, ctx => {
      pixel(ctx, 1, 25, PALETTE.contour, 14, 5);
      pixel(ctx, 2, 26, PALETTE.dalleSombre, 12, 3);
      pixel(ctx, 3, 2, PALETTE.contour, 10, 24);
      pixel(ctx, 4, 1, PALETTE.contour, 8, 1);
      pixel(ctx, 4, 2, PALETTE.dalle, 8, 23);
      pixel(ctx, 4, 2, PALETTE.dalleClaire, 2, 23);
      pixel(ctx, 11, 2, PALETTE.dalleSombre, 1, 23);
      const rune = allumee ? PALETTE.runeActive : PALETTE.rune;
      // glyphe original : chevrons de code < / >
      [[6, 7], [5, 8], [6, 9], [9, 7], [10, 8], [9, 9], [8, 6], [8, 7], [7, 8], [7, 9], [7, 10]].forEach(([x, y]) => pixel(ctx, x, y, rune));
      pixel(ctx, 6, 14, rune, 4, 1);
      pixel(ctx, 6, 17, rune, 3, 1);
      pixel(ctx, 6, 20, rune, 4, 1);
      if (allumee) pixel(ctx, 4, 24, PALETTE.runeActive, 8, 1);
    });
  }

  // ---------- Phare ----------
  function creerPhare(allume) {
    return creerCanevas(34, 86, ctx => {
      // socle
      pixel(ctx, 3, 74, PALETTE.contour, 28, 12);
      pixel(ctx, 4, 75, PALETTE.rocheSombre, 26, 10);
      pixel(ctx, 4, 75, PALETTE.roche, 26, 3);
      // tour effilée rayée
      for (let y = 22; y < 75; y++) {
        const demi = Math.round(7 + (y - 22) * 0.12);
        const bande = Math.floor((y - 22) / 8) % 2 === 0;
        pixel(ctx, 17 - demi - 1, y, PALETTE.contour, demi * 2 + 2, 1);
        pixel(ctx, 17 - demi, y, bande ? '#ece4d4' : '#b8323f', demi * 2, 1);
        pixel(ctx, 17 + demi - 3, y, bande ? '#c9bfac' : '#8a2530', 3, 1);
      }
      // porte
      pixel(ctx, 14, 64, PALETTE.contour, 7, 11);
      pixel(ctx, 15, 65, PALETTE.troncSombre, 5, 10);
      // balcon
      pixel(ctx, 6, 20, PALETTE.contour, 22, 3);
      pixel(ctx, 7, 21, PALETTE.rocheSombre, 20, 1);
      // salle de la lanterne
      pixel(ctx, 10, 8, PALETTE.contour, 14, 12);
      pixel(ctx, 11, 9, allume ? '#fff3b0' : '#2b3550', 12, 11);
      if (allume) pixel(ctx, 13, 11, '#ffffff', 8, 6);
      pixel(ctx, 16, 9, PALETTE.contour, 1, 11);
      // coupole
      for (let y = 0; y < 8; y++) {
        const demi = Math.round(1 + y * 0.9);
        pixel(ctx, 17 - demi - 1, y, PALETTE.contour, demi * 2 + 2, 1);
        pixel(ctx, 17 - demi, y, '#b8323f', demi * 2, 1);
      }
    });
  }

  // ---------- Pylône de lumière (arène du boss) ----------
  function creerPylone(etat) {
    return creerCanevas(16, 30, ctx => {
      pixel(ctx, 2, 22, PALETTE.contour, 12, 8);
      pixel(ctx, 3, 23, PALETTE.dalleSombre, 10, 6);
      pixel(ctx, 3, 23, PALETTE.dalle, 10, 2);
      const coeur = etat === 'actif' ? '#fff3b0' : etat === 'pret' ? PALETTE.lumiereFroide : '#3b4560';
      const coeurSombre = etat === 'actif' ? PALETTE.lumiereChaude : etat === 'pret' ? '#3aa7c9' : '#262d40';
      for (let y = 0; y < 20; y++) {
        const demi = y < 10 ? Math.floor(y / 2.2) : Math.floor((20 - y) / 2.2);
        pixel(ctx, 8 - demi - 1, 2 + y, PALETTE.contour, demi * 2 + 2, 1);
        pixel(ctx, 8 - demi, 2 + y, coeurSombre, demi * 2, 1);
        pixel(ctx, 8 - demi, 2 + y, coeur, Math.max(1, demi), 1);
      }
    });
  }

  function creerPanneau() {
    return creerCanevas(16, 18, ctx => {
      pixel(ctx, 7, 8, PALETTE.troncSombre, 2, 10);
      pixel(ctx, 1, 1, PALETTE.contour, 14, 9);
      pixel(ctx, 2, 2, PALETTE.tronc, 12, 7);
      pixel(ctx, 2, 2, '#7d5636', 12, 1);
      pixel(ctx, 4, 4, '#d9b48a', 8, 1);
      pixel(ctx, 4, 6, '#d9b48a', 6, 1);
    });
  }

  function creerChampignon(graine) {
    const alea = aleatoireGraine(graine);
    const couleur = alea() < 0.5 ? PALETTE.champignon : PALETTE.lumiereFroide;
    return creerCanevas(8, 8, ctx => {
      pixel(ctx, 3, 4, '#e8dccb', 2, 4);
      pixel(ctx, 1, 2, couleur, 6, 2);
      pixel(ctx, 2, 1, couleur, 4, 1);
      pixel(ctx, 2, 2, '#ffffff', 1, 1);
    });
  }

  JeuIle.creerSprites = function () {
    return {
      arbres: Array.from({ length: 8 }, (_, i) => creerArbre(101 + i * 17)),
      rochers: Array.from({ length: 3 }, (_, i) => creerRocher(7 + i)),
      maisons: [creerMaison(0), creerMaison(1), creerMaison(2)],
      puits: creerPuits(),
      stele: creerStele(false),
      steleAllumee: creerStele(true),
      phare: creerPhare(false),
      phareAllume: creerPhare(true),
      pylone: creerPylone('eteint'),
      pylonePret: creerPylone('pret'),
      pyloneActif: creerPylone('actif'),
      panneau: creerPanneau(),
      champignons: [creerChampignon(1), creerChampignon(2)]
    };
  };

  // ---------- Personnages (dessinés à chaque image) ----------

  // Le voyageur à la lanterne. direction : bas | haut | gauche | droite
  JeuIle.dessinerJoueur = function (ctx, x, y, direction, pas, temps, clignote) {
    x = Math.round(x); y = Math.round(y);
    const enMarche = pas !== null;
    const phase = enMarche ? Math.floor(pas) % 2 : 0;
    const respiration = enMarche ? 0 : Math.round(Math.sin(temps * 2.4) * 0.5 + 0.5) * 0;
    const corpsY = y - 13 + (enMarche && phase ? -1 : 0) + respiration;

    // ombre
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x - 4, y - 1, 9, 2);

    if (clignote && Math.floor(temps * 16) % 2) return;

    // jambes
    const jambeG = enMarche && phase ? -1 : 0;
    const jambeD = enMarche && !phase ? -1 : 0;
    pixel(ctx, x - 3, y - 4 + jambeG, PALETTE.contour, 3, 4 - jambeG);
    pixel(ctx, x + 1, y - 4 + jambeD, PALETTE.contour, 3, 4 - jambeD);
    pixel(ctx, x - 2, y - 4 + jambeG, PALETTE.pantalon, 1, 3 - jambeG);
    pixel(ctx, x + 2, y - 4 + jambeD, PALETTE.pantalon, 1, 3 - jambeD);

    // cape
    pixel(ctx, x - 5, corpsY + 5, PALETTE.contour, 11, 6);
    pixel(ctx, x - 4, corpsY + 5, PALETTE.cape, 9, 5);
    pixel(ctx, x - 4, corpsY + 9, PALETTE.capeSombre, 9, 1);
    if (direction === 'gauche') pixel(ctx, x + 2, corpsY + 6, PALETTE.capeSombre, 2, 3);
    if (direction === 'droite') pixel(ctx, x - 3, corpsY + 6, PALETTE.capeSombre, 2, 3);

    // écharpe qui flotte
    const flottement = Math.round(Math.sin(temps * 8) * 1);
    pixel(ctx, x - 4, corpsY + 4, PALETTE.echarpe, 9, 2);
    if (direction !== 'haut') {
      const cote = direction === 'gauche' ? 4 : -6;
      pixel(ctx, x + cote, corpsY + 5 + flottement, PALETTE.echarpe, 2, 3);
    } else {
      pixel(ctx, x - 1, corpsY + 6, PALETTE.echarpe, 2, 4);
    }

    // tête et capuche
    pixel(ctx, x - 4, corpsY - 2, PALETTE.contour, 9, 7);
    pixel(ctx, x - 3, corpsY - 3, PALETTE.contour, 7, 1);
    pixel(ctx, x - 3, corpsY - 2, PALETTE.cape, 7, 6);
    pixel(ctx, x - 3, corpsY - 2, '#5fe0d3', 3, 1);
    if (direction === 'bas') {
      pixel(ctx, x - 2, corpsY, PALETTE.peau, 5, 4);
      pixel(ctx, x - 2, corpsY + 3, PALETTE.peauOmbre, 5, 1);
      pixel(ctx, x - 1, corpsY + 1, PALETTE.blanc);
      pixel(ctx, x + 1, corpsY + 1, PALETTE.blanc);
    } else if (direction === 'gauche') {
      pixel(ctx, x - 3, corpsY, PALETTE.peau, 4, 4);
      pixel(ctx, x - 3, corpsY + 3, PALETTE.peauOmbre, 4, 1);
      pixel(ctx, x - 2, corpsY + 1, PALETTE.blanc);
    } else if (direction === 'droite') {
      pixel(ctx, x, corpsY, PALETTE.peau, 4, 4);
      pixel(ctx, x, corpsY + 3, PALETTE.peauOmbre, 4, 1);
      pixel(ctx, x + 2, corpsY + 1, PALETTE.blanc);
    } else {
      pixel(ctx, x - 3, corpsY - 2, PALETTE.capeSombre, 7, 6);
      pixel(ctx, x - 1, corpsY + 1, PALETTE.cape, 3, 2);
    }

    // lanterne (balancement)
    const balancement = Math.round(Math.sin(temps * (enMarche ? 9 : 2.2)) * (enMarche ? 1.4 : 0.6));
    const coteLanterne = direction === 'gauche' ? -8 : direction === 'haut' ? -7 : 6;
    if (direction !== 'haut') {
      const lx = x + coteLanterne + balancement;
      const ly = corpsY + 7;
      pixel(ctx, lx + 1, ly - 2, PALETTE.contour, 1, 2);
      pixel(ctx, lx, ly, PALETTE.contour, 3, 4);
      pixel(ctx, lx, ly + 1, PALETTE.lumiereChaude, 3, 2);
      pixel(ctx, lx + 1, ly + 1, '#fffbe0', 1, 1);
    }
  };

  // Position de la lanterne (pour la source de lumière)
  JeuIle.positionLanterne = function (x, y, direction) {
    const cote = direction === 'gauche' ? -7 : direction === 'haut' ? -6 : 7;
    return { x: x + cote, y: y - 4 };
  };

  // L'Archiviste : un vieux sage encapuchonné, original
  JeuIle.dessinerArchiviste = function (ctx, x, y, temps, regardeGauche) {
    x = Math.round(x); y = Math.round(y);
    const flotte = Math.round(Math.sin(temps * 1.8));
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x - 6, y - 1, 13, 2);
    // robe
    for (let i = 0; i < 12; i++) {
      const demi = 3 + Math.floor(i / 3);
      pixel(ctx, x - demi - 1, y - 14 + i + flotte, PALETTE.contour, demi * 2 + 3, 1);
      pixel(ctx, x - demi, y - 14 + i + flotte, i > 9 ? '#3d2a5c' : '#5a3f86', demi * 2 + 1, 1);
    }
    pixel(ctx, x - 1, y - 12 + flotte, '#d8c27a', 3, 8);
    // tête
    pixel(ctx, x - 4, y - 21 + flotte, PALETTE.contour, 9, 8);
    pixel(ctx, x - 3, y - 21 + flotte, '#5a3f86', 7, 7);
    pixel(ctx, x - 2, y - 19 + flotte, '#a87650', 5, 4);
    // barbe
    pixel(ctx, x - 2, y - 16 + flotte, '#e8e2d4', 5, 4);
    pixel(ctx, x - 1, y - 12 + flotte, '#e8e2d4', 3, 2);
    // yeux brillants
    pixel(ctx, x - 1, y - 18 + flotte, PALETTE.lumiereFroide);
    pixel(ctx, x + 1, y - 18 + flotte, PALETTE.lumiereFroide);
    // bâton avec cristal
    const bx = regardeGauche ? x - 8 : x + 7;
    pixel(ctx, bx, y - 22 + flotte, PALETTE.troncSombre, 1, 21);
    pixel(ctx, bx - 1, y - 25 + flotte, PALETTE.lumiereFroide, 3, 3);
    pixel(ctx, bx, y - 24 + flotte, '#ffffff');
  };

  // Le Grand Bug : amas de pixels instables, original
  JeuIle.dessinerBug = function (ctx, x, y, temps, cibleX, cibleY, degat, alea) {
    const flotte = Math.sin(temps * 2) * 3;
    const cy = y + flotte;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const decalages = [[-2, 0, PALETTE.bugRose], [2, 0, PALETTE.bugCyan]];
    decalages.forEach(([dx, dy, couleur]) => {
      ctx.fillStyle = couleur;
      for (let i = 0; i < 46; i++) {
        const angle = i * 2.39996 + temps * (i % 2 ? 0.7 : -0.5);
        const rayon = (i % 7) * 2.3 + Math.sin(temps * 3 + i) * 1.5;
        const taille = 2 + (i % 3);
        ctx.fillRect(Math.round(x + dx + Math.cos(angle) * rayon - taille / 2), Math.round(cy + dy + Math.sin(angle) * rayon * 0.9 - taille / 2), taille, taille);
      }
    });
    ctx.restore();
    // glitchs horizontaux
    for (let i = 0; i < 4; i++) {
      if (alea() < 0.5) {
        ctx.fillStyle = alea() < 0.5 ? PALETTE.bugRose : PALETTE.bugCyan;
        ctx.fillRect(Math.round(x - 18 + alea() * 20), Math.round(cy - 14 + alea() * 28), Math.round(4 + alea() * 14), 1);
      }
    }
    // œil
    disque(ctx, x, cy, 6, PALETTE.contour);
    disque(ctx, x, cy, 5, degat > 0 ? '#ffffff' : '#f2f2ff');
    const angle = Math.atan2(cibleY - cy, cibleX - x);
    disque(ctx, x + Math.cos(angle) * 2.5, cy + Math.sin(angle) * 2.5, 2, degat > 0 ? PALETTE.bugRose : PALETTE.contour);
  };

  // Feu de camp animé
  JeuIle.dessinerFeu = function (ctx, x, y, temps) {
    x = Math.round(x); y = Math.round(y);
    pixel(ctx, x - 7, y - 3, PALETTE.troncSombre, 14, 3);
    pixel(ctx, x - 5, y - 4, PALETTE.tronc, 10, 2);
    [[-6, -1], [5, -1], [-3, 0], [2, 0]].forEach(([dx, dy]) => pixel(ctx, x + dx, y + dy, PALETTE.rocheSombre, 3, 2));
    for (let i = 0; i < 7; i++) {
      const h = 5 + Math.round(Math.sin(temps * 9 + i * 1.7) * 2 + (i === 3 ? 4 : 0));
      const couleur = i === 3 ? '#fff3b0' : i % 2 ? '#ffb347' : '#ff6b35';
      pixel(ctx, x - 4 + i, y - 4 - h, couleur, 1, h);
    }
    pixel(ctx, x - 1, y - 8, '#ffffff', 2, 2);
  };
})();
