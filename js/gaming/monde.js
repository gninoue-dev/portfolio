// ============================================
// L'ÎLE DES FRAGMENTS — Génération du monde
// Île déterministe (même graine à chaque visite) :
// relief, chemins, zones, objets et collisions.
// ============================================
(function () {
  const JeuIle = window.JeuIle = window.JeuIle || {};
  const { PALETTE, aleatoireGraine, creerCanevas, pixel } = JeuIle;

  const T = 16;
  const LARGEUR = 72;
  const HAUTEUR = 56;
  const SOL = { eau: 0, sable: 1, herbe: 2, chemin: 3, dalle: 4 };

  // Zones du portfolio (coordonnées en tuiles)
  const ZONES = {
    camp: { x: 36, y: 29, r: 4 },
    village: { x: 17, y: 15, r: 8 },
    foret: { x: 54, y: 14, r: 10 },
    ruines: { x: 17, y: 41, r: 8 },
    arene: { x: 53, y: 41, r: 7 },
    pointe: { x: 60, y: 46, r: 3 }
  };

  // Bruit de valeur lissé, pour des côtes naturelles
  function creerBruit(alea, taille) {
    const grille = Array.from({ length: taille * taille }, () => alea());
    const valeur = (x, y) => grille[((y % taille) + taille) % taille * taille + ((x % taille) + taille) % taille];
    return function (x, y) {
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const fx = x - x0, fy = y - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const haut = valeur(x0, y0) * (1 - sx) + valeur(x0 + 1, y0) * sx;
      const bas = valeur(x0, y0 + 1) * (1 - sx) + valeur(x0 + 1, y0 + 1) * sx;
      return haut * (1 - sy) + bas * sy;
    };
  }

  const distance = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  JeuIle.creerMonde = function (sprites) {
    const alea = aleatoireGraine(2026);
    const bruit = creerBruit(alea, 32);
    const tuiles = new Uint8Array(LARGEUR * HAUTEUR);
    const index = (x, y) => y * LARGEUR + x;
    const dansCarte = (x, y) => x >= 0 && y >= 0 && x < LARGEUR && y < HAUTEUR;
    const tuile = (x, y) => (dansCarte(x, y) ? tuiles[index(x, y)] : SOL.eau);
    const reserve = new Uint8Array(LARGEUR * HAUTEUR); // 1 = pas d'arbre ni de rocher

    // ---------- Relief de l'île ----------
    for (let y = 0; y < HAUTEUR; y++) {
      for (let x = 0; x < LARGEUR; x++) {
        const nx = (x - 36) / 32, ny = (y - 28) / 24;
        let valeur = 1 - nx * nx - ny * ny;
        valeur += (bruit(x / 6, y / 6) - 0.5) * 0.42 + (bruit(x / 2.5 + 40, y / 2.5) - 0.5) * 0.12;
        Object.values(ZONES).forEach(z => {
          valeur = Math.max(valeur, 0.4 * (1 - distance(x, y, z.x, z.y) / (z.r + 4)));
        });
        tuiles[index(x, y)] = valeur < 0 ? SOL.eau : valeur < 0.1 ? SOL.sable : SOL.herbe;
      }
    }

    // ---------- Chemins depuis le camp ----------
    function tracerChemin(points) {
      for (let i = 0; i < points.length - 1; i++) {
        const [ax, ay] = points[i], [bx, by] = points[i + 1];
        const longueur = Math.ceil(distance(ax, ay, bx, by) * 3);
        for (let s = 0; s <= longueur; s++) {
          const k = s / longueur;
          const ondulation = Math.sin(k * Math.PI * 2 + i) * 0.8;
          const px = ax + (bx - ax) * k + ondulation * (by - ay) / (longueur / 3 || 1) * 0.3;
          const py = ay + (by - ay) * k;
          for (let dy = -1; dy <= 0; dy++) {
            for (let dx = -1; dx <= 0; dx++) {
              const tx = Math.round(px + dx), ty = Math.round(py + dy);
              if (!dansCarte(tx, ty)) continue;
              if (tuile(tx, ty) !== SOL.eau) tuiles[index(tx, ty)] = SOL.chemin;
              for (let ry = -2; ry <= 2; ry++) for (let rx = -2; rx <= 2; rx++) {
                if (dansCarte(tx + rx, ty + ry)) reserve[index(tx + rx, ty + ry)] = 1;
              }
            }
          }
        }
      }
    }
    tracerChemin([[36, 29], [30, 24], [22, 19], [18, 17]]);
    tracerChemin([[37, 28], [43, 22], [50, 17], [54, 14]]);
    tracerChemin([[35, 30], [29, 35], [21, 39], [18, 41]]);
    tracerChemin([[37, 30], [43, 35], [48, 38], [53, 41]]);

    // ---------- Places dallées ----------
    function daller(zone, rayon, taux) {
      for (let y = zone.y - rayon; y <= zone.y + rayon; y++) {
        for (let x = zone.x - rayon; x <= zone.x + rayon; x++) {
          if (!dansCarte(x, y) || distance(x, y, zone.x, zone.y) > rayon) continue;
          if (tuile(x, y) !== SOL.eau && alea() < taux) tuiles[index(x, y)] = SOL.dalle;
          reserve[index(x, y)] = 1;
        }
      }
    }
    daller(ZONES.ruines, 7, 0.82);
    daller(ZONES.arene, 6, 0.95);
    daller(ZONES.camp, 3, 0);
    for (let y = ZONES.pointe.y - 3; y <= ZONES.pointe.y + 3; y++) {
      for (let x = ZONES.pointe.x - 3; x <= ZONES.pointe.x + 3; x++) if (dansCarte(x, y)) reserve[index(x, y)] = 1;
    }

    // ---------- Objets ----------
    const objets = [];
    const centre = t => t * T + T / 2;
    function reserver(tx, ty, rayon) {
      for (let y = ty - rayon; y <= ty + rayon; y++) for (let x = tx - rayon; x <= tx + rayon; x++) {
        if (dansCarte(x, y)) reserve[index(x, y)] = 1;
      }
    }
    function ajouter(objet) {
      objets.push(objet);
      return objet;
    }

    // Camp et feu
    const feu = ajouter({
      type: 'feu', x: centre(36), y: centre(29), solide: { r: 7 },
      lumiere: { r: 70, couleur: '255,170,80', intensite: 0.9, scintille: true }
    });
    reserver(36, 29, 3);

    // Village (À propos)
    [[12, 10, 0], [20, 9, 1], [25, 14, 2]].forEach(([tx, ty, variante]) => {
      ajouter({
        type: 'maison', x: centre(tx), y: centre(ty) + 6, sprite: sprites.maisons[variante], ox: 22, oy: 44,
        solide: { l: 36, h: 18 },
        lumiere: { r: 34, couleur: '255,200,110', intensite: 0.55, decalageY: -14 }
      });
      reserver(tx, ty, 2);
    });
    ajouter({ type: 'puits', x: centre(13), y: centre(16), sprite: sprites.puits, ox: 11, oy: 22, solide: { r: 8 } });
    reserver(13, 16, 1);
    const archiviste = ajouter({
      type: 'archiviste', x: centre(18), y: centre(16), solide: { r: 6 },
      lumiere: { r: 40, couleur: '127,227,255', intensite: 0.55, decalageY: -24 },
      interaction: { type: 'archiviste', rayon: 26 }
    });
    reserver(18, 16, 2);

    // Forêt des savoirs (Compétences) : orbes
    const orbes = [];
    const positionsOrbes = [];
    let essais = 0;
    while (positionsOrbes.length < 16 && essais < 4000) {
      essais++;
      const angle = alea() * Math.PI * 2;
      const rayon = 2 + alea() * (ZONES.foret.r - 1);
      const tx = Math.round(ZONES.foret.x + Math.cos(angle) * rayon * 1.15);
      const ty = Math.round(ZONES.foret.y + Math.sin(angle) * rayon * 0.85);
      if (tuile(tx, ty) !== SOL.herbe && tuile(tx, ty) !== SOL.chemin) continue;
      if (positionsOrbes.some(([x, y]) => distance(x, y, tx, ty) < 3.2)) continue;
      // jamais au bord de l'eau
      let presEau = false;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (tuile(tx + dx, ty + dy) === SOL.eau) presEau = true;
      if (presEau) continue;
      positionsOrbes.push([tx, ty]);
    }
    positionsOrbes.forEach(([tx, ty], i) => {
      const orbe = ajouter({
        type: 'orbe', x: centre(tx), y: centre(ty), indice: i, phase: alea() * 6.28,
        lumiere: { r: 30, couleur: '138,255,193', intensite: 0.75, decalageY: -8 },
        interaction: { type: 'orbe', rayon: 14, auto: true }
      });
      orbes.push(orbe);
      reserver(tx, ty, 1);
    });

    // Ruines des projets : stèles en cercle
    const steles = [];
    const nombreSteles = 10;
    for (let i = 0; i < nombreSteles; i++) {
      const angle = -Math.PI / 2 + (i / nombreSteles) * Math.PI * 2 + Math.PI / nombreSteles;
      const x = centre(ZONES.ruines.x) + Math.cos(angle) * 84;
      const y = centre(ZONES.ruines.y) + Math.sin(angle) * 70;
      steles.push(ajouter({
        type: 'stele', x, y, indice: i, sprite: sprites.stele, ox: 8, oy: 29, solide: { l: 12, h: 6 },
        lumiere: { r: 22, couleur: '127,193,255', intensite: 0.45, decalageY: -16 },
        interaction: { type: 'stele', rayon: 22 }
      }));
    }

    // Arène et phare (Contact)
    const pylones = [0, 1, 2].map(i => {
      const angle = -Math.PI / 2 + i * (Math.PI * 2 / 3);
      return ajouter({
        type: 'pylone', x: centre(ZONES.arene.x) + Math.cos(angle) * 62, y: centre(ZONES.arene.y) + Math.sin(angle) * 54,
        indice: i, sprite: sprites.pylone, ox: 8, oy: 29, solide: { r: 5 }, charge: 0, actif: false,
        lumiere: { r: 26, couleur: '127,227,255', intensite: 0, decalageY: -14 },
        interaction: { type: 'pylone', rayon: 24, auto: true }
      });
    });
    const phare = ajouter({
      type: 'phare', x: centre(60), y: centre(46), sprite: sprites.phare, ox: 17, oy: 85, solide: { l: 26, h: 10 },
      lumiere: { r: 60, couleur: '255,243,176', intensite: 0, decalageY: -74 },
      interaction: { type: 'phare', rayon: 30 }
    });

    // Panneaux (tutoriel et noms de zones)
    [
      { tx: 39, ty: 30, cle: 'jeu.panneau-camp' },
      { tx: 23, ty: 21, cle: 'jeu.panneau-village' },
      { tx: 47, ty: 21, cle: 'jeu.panneau-foret' },
      { tx: 25, ty: 38, cle: 'jeu.panneau-ruines' },
      { tx: 45, ty: 37, cle: 'jeu.panneau-arene' }
    ].forEach(p => {
      ajouter({
        type: 'panneau', x: centre(p.tx), y: centre(p.ty), sprite: sprites.panneau, ox: 8, oy: 17, solide: { r: 4 },
        interaction: { type: 'panneau', rayon: 20, cle: p.cle }
      });
      reserver(p.tx, p.ty, 1);
    });

    // Arbres et rochers : seulement sur une case sur deux (damier),
    // ce qui garantit toujours un passage entre deux obstacles.
    for (let y = 1; y < HAUTEUR - 1; y++) {
      for (let x = 1; x < LARGEUR - 1; x++) {
        if ((x + y) % 2 !== 0 || reserve[index(x, y)]) continue;
        const sol = tuile(x, y);
        if (sol !== SOL.herbe && sol !== SOL.sable) continue;
        let voisinEau = false;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (tuile(x + dx, y + dy) === SOL.eau) voisinEau = true;
        if (voisinEau) continue;
        const dansForet = distance(x, y, ZONES.foret.x, ZONES.foret.y) < ZONES.foret.r + 3;
        const probaArbre = sol === SOL.sable ? 0 : dansForet ? 0.62 : 0.13;
        const jx = Math.round((alea() - 0.5) * 4), jy = Math.round((alea() - 0.5) * 4);
        const tirage = alea();
        if (tirage < probaArbre) {
          ajouter({
            type: 'arbre', x: centre(x) + jx, y: centre(y) + jy, sprite: sprites.arbres[Math.floor(alea() * sprites.arbres.length)],
            ox: 16, oy: 41, solide: { r: 4 }
          });
        } else if (tirage < probaArbre + 0.025) {
          ajouter({
            type: 'rocher', x: centre(x) + jx, y: centre(y) + jy, sprite: sprites.rochers[Math.floor(alea() * 3)],
            ox: 9, oy: 12, solide: { r: 5 }
          });
        }
      }
    }

    // Champignons lumineux (décor de la forêt)
    for (let i = 0; i < 26; i++) {
      const angle = alea() * Math.PI * 2;
      const rayon = alea() * (ZONES.foret.r + 2);
      const tx = Math.round(ZONES.foret.x + Math.cos(angle) * rayon);
      const ty = Math.round(ZONES.foret.y + Math.sin(angle) * rayon);
      if (tuile(tx, ty) !== SOL.herbe) continue;
      ajouter({
        type: 'champignon', x: centre(tx) + Math.round((alea() - 0.5) * 10), y: centre(ty) + 6,
        sprite: sprites.champignons[i % 2], ox: 4, oy: 7, decor: true,
        lumiere: { r: 12, couleur: i % 2 ? '127,227,255' : '195,155,255', intensite: 0.5, decalageY: -3 }
      });
    }

    // ---------- Grille de collision ----------
    const grilleSolides = Array.from({ length: LARGEUR * HAUTEUR }, () => []);
    objets.forEach(objet => {
      if (!objet.solide) return;
      const rayon = objet.solide.r || Math.max(objet.solide.l, objet.solide.h) / 2;
      const x0 = Math.floor((objet.x - rayon) / T), x1 = Math.floor((objet.x + rayon) / T);
      const y0 = Math.floor((objet.y - rayon) / T), y1 = Math.floor((objet.y + rayon) / T);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (dansCarte(x, y)) grilleSolides[index(x, y)].push(objet);
    });

    // ---------- Pré-rendu du sol ----------
    const sol = creerCanevas(LARGEUR * T, HAUTEUR * T, ctx => {
      const aleaSol = aleatoireGraine(77);
      const couleurs = {
        [SOL.eau]: [PALETTE.eauProfonde, PALETTE.eau],
        [SOL.sable]: [PALETTE.sable, PALETTE.sableOmbre],
        [SOL.herbe]: [PALETTE.herbe, PALETTE.herbeSombre],
        [SOL.chemin]: [PALETTE.chemin, PALETTE.cheminSombre],
        [SOL.dalle]: [PALETTE.dalle, PALETTE.dalleSombre]
      };
      for (let y = 0; y < HAUTEUR; y++) {
        for (let x = 0; x < LARGEUR; x++) {
          const type = tuile(x, y);
          const [base, ombre] = couleurs[type];
          const px0 = x * T, py0 = y * T;
          if (type === SOL.eau) {
            // eau plus claire près des côtes
            let pres = false;
            for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (tuile(x + dx, y + dy) !== SOL.eau) pres = true;
            pixel(ctx, px0, py0, pres ? PALETTE.eau : PALETTE.eauProfonde, T, T);
          } else if (type === SOL.dalle) {
            pixel(ctx, px0, py0, base, T, T);
            pixel(ctx, px0, py0 + T - 1, ombre, T, 1);
            pixel(ctx, px0 + T - 1, py0, ombre, 1, T);
            pixel(ctx, px0, py0, PALETTE.dalleClaire, T - 1, 1);
            if (aleaSol() < 0.3) pixel(ctx, px0 + 3 + Math.floor(aleaSol() * 8), py0 + 4 + Math.floor(aleaSol() * 8), ombre, 4, 1);
            if (aleaSol() < 0.25) pixel(ctx, px0 + 2 + Math.floor(aleaSol() * 10), py0 + 2 + Math.floor(aleaSol() * 10), PALETTE.herbeSombre, 2, 2);
          } else {
            pixel(ctx, px0, py0, base, T, T);
            for (let i = 0; i < 7; i++) {
              pixel(ctx, px0 + Math.floor(aleaSol() * T), py0 + Math.floor(aleaSol() * T), aleaSol() < 0.5 ? ombre : (type === SOL.herbe ? PALETTE.herbeClaire : type === SOL.chemin ? PALETTE.cheminClair : '#e6c991'), 1, aleaSol() < 0.5 ? 1 : 2);
            }
            if (type === SOL.herbe && aleaSol() < 0.08) {
              const fx = px0 + 3 + Math.floor(aleaSol() * 10), fy = py0 + 3 + Math.floor(aleaSol() * 10);
              const fleur = ['#ffd166', '#ff8fab', '#c39bff', '#ffffff'][Math.floor(aleaSol() * 4)];
              pixel(ctx, fx, fy, fleur); pixel(ctx, fx + 2, fy + 1, fleur); pixel(ctx, fx + 1, fy + 3, fleur);
            }
          }
        }
      }
      // transitions : bord herbe dentelé et écume
      for (let y = 0; y < HAUTEUR; y++) {
        for (let x = 0; x < LARGEUR; x++) {
          const type = tuile(x, y);
          const px0 = x * T, py0 = y * T;
          if (type === SOL.herbe || type === SOL.chemin) {
            if (tuile(x, y + 1) === SOL.sable) for (let i = 0; i < T; i += 2) pixel(ctx, px0 + i, py0 + T, PALETTE.herbeSombre, 2, 1 + (i * 7 % 3));
            if (tuile(x, y - 1) === SOL.sable) for (let i = 0; i < T; i += 3) pixel(ctx, px0 + i, py0 - 1, PALETTE.herbe, 2, 1);
          }
          if (type !== SOL.eau) {
            if (tuile(x, y + 1) === SOL.eau) {
              pixel(ctx, px0, py0 + T, PALETTE.sableOmbre, T, 2);
              pixel(ctx, px0, py0 + T + 2, PALETTE.ecume, T, 1);
            }
            if (tuile(x, y - 1) === SOL.eau) pixel(ctx, px0, py0 - 1, PALETTE.ecume, T, 1);
            if (tuile(x - 1, y) === SOL.eau) pixel(ctx, px0 - 1, py0, PALETTE.ecume, 1, T);
            if (tuile(x + 1, y) === SOL.eau) pixel(ctx, px0 + T, py0, PALETTE.ecume, 1, T);
          }
        }
      }
    });

    // Tuiles d'eau visibles depuis la terre (pour l'animation des reflets)
    const reflets = [];
    const aleaReflets = aleatoireGraine(5);
    for (let y = 0; y < HAUTEUR; y++) for (let x = 0; x < LARGEUR; x++) {
      if (tuile(x, y) === SOL.eau && aleaReflets() < 0.35) reflets.push({ x: x * T + aleaReflets() * 12, y: y * T + aleaReflets() * 14, phase: aleaReflets() * 6.28 });
    }

    return {
      T, LARGEUR, HAUTEUR, SOL, ZONES, tuiles, tuile, objets, grilleSolides, sol, reflets,
      feu, archiviste, orbes, steles, pylones, phare,
      depart: { x: centre(36), y: centre(31) + 4 },
      centreArene: { x: centre(ZONES.arene.x), y: centre(ZONES.arene.y) },
      rayonArene: 6.6 * T
    };
  };
})();
