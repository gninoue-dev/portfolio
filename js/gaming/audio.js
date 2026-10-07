// ============================================
// L'ÎLE DES FRAGMENTS — Audio synthétisé (Web Audio)
// Aucun fichier son : musique et effets générés en direct.
// Coupé par défaut ; le contexte n'est créé qu'au premier
// clic sur "Son", donc jamais de lecture automatique.
// ============================================
(function () {
  const JeuIle = window.JeuIle = window.JeuIle || {};

  const frequence = note => 440 * Math.pow(2, (note - 69) / 12);

  // Suites d'accords (notes MIDI) par ambiance
  const AMBIANCES = {
    exploration: { accords: [[57, 64, 69, 72], [53, 60, 65, 69], [48, 55, 64, 67], [55, 62, 67, 71]], gamme: [69, 72, 74, 76, 79, 81, 84], tempo: 0.42, basse: false },
    boss: { accords: [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 63], [45, 52, 57, 61]], gamme: [62, 65, 67, 69, 72, 74], tempo: 0.2, basse: true },
    fin: { accords: [[60, 64, 67, 72], [65, 69, 72, 77], [57, 60, 64, 69], [67, 71, 74, 79]], gamme: [72, 74, 76, 79, 81, 84, 86], tempo: 0.3, basse: false }
  };

  class Audio {
    constructor() {
      this.actif = false;
      this.ctx = null;
      this.ambiance = 'exploration';
      this.minuteur = null;
    }

    initialiser() {
      if (this.ctx) return;
      const Contexte = window.AudioContext || window.webkitAudioContext;
      if (!Contexte) return;
      this.ctx = new Contexte();
      this.maitre = this.ctx.createGain();
      this.maitre.gain.value = 0.0;
      this.compresseur = this.ctx.createDynamicsCompressor();
      this.maitre.connect(this.compresseur).connect(this.ctx.destination);

      this.busMusique = this.ctx.createGain();
      this.busMusique.gain.value = 0.32;
      this.filtreMusique = this.ctx.createBiquadFilter();
      this.filtreMusique.type = 'lowpass';
      this.filtreMusique.frequency.value = 1800;
      this.busMusique.connect(this.filtreMusique).connect(this.maitre);

      // écho léger
      this.echo = this.ctx.createDelay();
      this.echo.delayTime.value = 0.32;
      this.retour = this.ctx.createGain();
      this.retour.gain.value = 0.28;
      this.echo.connect(this.retour).connect(this.echo);
      this.retour.connect(this.filtreMusique);

      this.busEffets = this.ctx.createGain();
      this.busEffets.gain.value = 0.5;
      this.busEffets.connect(this.maitre);

      this.prochainTemps = 0;
      this.pasMusique = 0;
    }

    basculer() {
      this.definirActif(!this.actif);
      return this.actif;
    }

    definirActif(actif) {
      this.actif = actif;
      if (actif) {
        this.initialiser();
        if (!this.ctx) { this.actif = false; return; }
        this.ctx.resume();
        this.maitre.gain.setTargetAtTime(0.8, this.ctx.currentTime, 0.4);
        this.demarrerMusique();
      } else if (this.ctx) {
        this.maitre.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
        this.arreterMusique();
      }
    }

    suspendre() {
      if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
    }

    reprendre() {
      if (this.ctx && this.actif) this.ctx.resume();
    }

    detruire() {
      this.arreterMusique();
      if (this.ctx) this.ctx.close();
      this.ctx = null;
      this.actif = false;
    }

    changerAmbiance(nom) {
      this.ambiance = nom;
    }

    // ---------- Musique générative ----------
    demarrerMusique() {
      if (this.minuteur) return;
      this.prochainTemps = this.ctx.currentTime + 0.1;
      this.minuteur = window.setInterval(() => this.planifier(), 90);
    }

    arreterMusique() {
      window.clearInterval(this.minuteur);
      this.minuteur = null;
    }

    planifier() {
      if (!this.ctx || !this.actif) return;
      const ambiance = AMBIANCES[this.ambiance];
      while (this.prochainTemps < this.ctx.currentTime + 0.3) {
        const temps = this.prochainTemps;
        const pasParAccord = Math.round(3.4 / ambiance.tempo);
        const accord = ambiance.accords[Math.floor(this.pasMusique / pasParAccord) % ambiance.accords.length];
        if (this.pasMusique % pasParAccord === 0) {
          accord.forEach(note => this.nappe(frequence(note), temps, ambiance.tempo * pasParAccord));
        }
        if (ambiance.basse && this.pasMusique % 2 === 0) this.pincement(frequence(accord[0] - 12), temps, 0.18, 'triangle', 0.22);
        if (Math.random() < (ambiance.basse ? 0.5 : 0.38)) {
          const note = ambiance.gamme[Math.floor(Math.random() * ambiance.gamme.length)];
          this.pincement(frequence(note), temps, 0.6, 'sine', 0.09, true);
        }
        this.pasMusique++;
        this.prochainTemps += ambiance.tempo;
      }
    }

    nappe(f, debut, duree) {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, debut);
      gain.gain.linearRampToValueAtTime(0.045, debut + 1.2);
      gain.gain.linearRampToValueAtTime(0, debut + duree + 0.8);
      gain.connect(this.busMusique);
      [-4, 4].forEach(desaccord => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f;
        osc.detune.value = desaccord;
        osc.connect(gain);
        osc.start(debut);
        osc.stop(debut + duree + 1);
      });
    }

    pincement(f, debut, duree, type, volume, avecEcho) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, debut);
      gain.gain.linearRampToValueAtTime(volume, debut + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree);
      osc.connect(gain).connect(this.busMusique);
      if (avecEcho) gain.connect(this.echo);
      osc.start(debut);
      osc.stop(debut + duree + 0.05);
    }

    // ---------- Effets ----------
    ton(f, duree, type = 'square', volume = 0.12, glisse = 0, delai = 0) {
      if (!this.actif || !this.ctx) return;
      const debut = this.ctx.currentTime + delai;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, debut);
      if (glisse) osc.frequency.exponentialRampToValueAtTime(Math.max(30, f + glisse), debut + duree);
      gain.gain.setValueAtTime(volume, debut);
      gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree);
      osc.connect(gain).connect(this.busEffets);
      osc.start(debut);
      osc.stop(debut + duree + 0.02);
    }

    bruit(duree, volume = 0.3, frequenceFiltre = 1200) {
      if (!this.actif || !this.ctx) return;
      const taille = Math.floor(this.ctx.sampleRate * duree);
      const tampon = this.ctx.createBuffer(1, taille, this.ctx.sampleRate);
      const donnees = tampon.getChannelData(0);
      for (let i = 0; i < taille; i++) donnees[i] = (Math.random() * 2 - 1) * (1 - i / taille);
      const source = this.ctx.createBufferSource();
      source.buffer = tampon;
      const filtre = this.ctx.createBiquadFilter();
      filtre.type = 'lowpass';
      filtre.frequency.value = frequenceFiltre;
      const gain = this.ctx.createGain();
      gain.gain.value = volume;
      source.connect(filtre).connect(gain).connect(this.busEffets);
      source.start();
    }

    jouer(effet) {
      if (!this.actif) return;
      switch (effet) {
        case 'orbe':
          [76, 81, 88].forEach((n, i) => this.ton(frequence(n), 0.25, 'sine', 0.16, 0, i * 0.06));
          break;
        case 'dialogue':
          this.ton(frequence(70 + Math.floor(Math.random() * 6)), 0.05, 'square', 0.05);
          break;
        case 'interagir':
          this.ton(frequence(72), 0.12, 'triangle', 0.15, 200);
          break;
        case 'stele':
          [64, 71, 76].forEach((n, i) => this.ton(frequence(n), 0.5, 'triangle', 0.12, 0, i * 0.08));
          break;
        case 'fragment':
          [72, 76, 79, 84, 88].forEach((n, i) => this.ton(frequence(n), 0.5, 'square', 0.07, 0, i * 0.09));
          break;
        case 'succes':
          [79, 84, 88, 91].forEach((n, i) => this.ton(frequence(n), 0.3, 'triangle', 0.13, 0, i * 0.07));
          break;
        case 'coup':
          this.bruit(0.25, 0.35, 900);
          this.ton(140, 0.25, 'sawtooth', 0.12, -90);
          break;
        case 'tir':
          this.ton(520, 0.18, 'square', 0.05, -300);
          break;
        case 'charge':
          this.ton(frequence(60 + Math.floor(Math.random() * 3) * 4), 0.06, 'sine', 0.06);
          break;
        case 'pylone':
          [60, 67, 72, 79].forEach((n, i) => this.ton(frequence(n), 0.6, 'sawtooth', 0.06, 0, i * 0.05));
          this.bruit(0.4, 0.12, 3000);
          break;
        case 'boss-touche':
          this.ton(220, 0.4, 'sawtooth', 0.14, -150);
          this.bruit(0.3, 0.25, 2000);
          break;
        case 'explosion':
          this.bruit(1.4, 0.5, 1400);
          this.ton(90, 1.2, 'sawtooth', 0.15, -60);
          break;
        case 'refus':
          this.ton(160, 0.18, 'square', 0.07, -40);
          break;
        case 'eveil':
          [48, 55, 60, 64, 67, 72].forEach((n, i) => this.ton(frequence(n), 1.2, 'triangle', 0.08, 0, i * 0.07));
          break;
        default:
          break;
      }
    }
  }

  JeuIle.Audio = Audio;
})();
