/**
 * PORTFÓLIO CINEMATOGRÁFICO 3D — PEDRO
 * Direção Artística: Inspirada na linguagem visual de Joseph Santamaria
 * Tecnologias: HTML5, CSS3, JavaScript Puro, Three.js
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. ESTADO GLOBAL & DADOS
  // ---------------------------------------------------------------------------
  const state = {
    scrollY: 0,
    scrollProgress: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    isMobile: window.innerWidth <= 900,
    audioActive: false,
    activeSkill: 'frontend',
    activeSection: 'hero',
    clock: new THREE.Clock()
  };

  // Base de dados das Habilidades Técnicas
  const SKILLS_DATA = {
    frontend: {
      tag: 'COMPETÊNCIA CORE',
      category: 'INTERFACE & EXPERIÊNCIA',
      title: 'Front-end',
      desc: 'Criação de interfaces digitais responsivas, acessíveis e focadas no usuário. Aplicação prática de design systems, tipografia apurada e harmonia visual para garantir navegabilidade fluida e intuitiva.',
      app: 'Web Apps, Landing Pages & Portfólios',
      focus: 'Usabilidade, Fluidez & Performance'
    },
    html5: {
      tag: 'ESTRUTURAÇÃO BASE',
      category: 'SEMÂNTICA & ACESSIBILIDADE',
      title: 'HTML5',
      desc: 'Estruturação semântica rigorosa com suporte completo a leitores de tela e padrões WAI-ARIA. Otimização de hierarquia de títulos, metatags para SEO técnico e separação estrita de camadas.',
      app: 'Aplicações Web Modernas',
      focus: 'Semântica Pura, Acessibilidade & SEO'
    },
    css3: {
      tag: 'ESTILIZAÇÃO AVANÇADA',
      category: 'DESIGN SYSTEM & ANIMAÇÃO',
      title: 'CSS3',
      desc: 'Domínio de layouts modernos (Flexbox e CSS Grid), variáveis personalizadas (Custom Properties), glassmorphism refinado, microinterações e transições com aceleração por hardware.',
      app: 'Sistemas Visuais & Microinterações',
      focus: 'Consistência Estética & Responsividade'
    },
    javascript: {
      tag: 'LÓGICA & COMPORTAMENTO',
      category: 'PROGRAMAÇÃO NATIVA',
      title: 'JavaScript',
      desc: 'Desenvolvimento com JavaScript puro (Vanilla JS), manipulação direta do DOM, consumo de APIs assíncronas, controle de eventos de alta frequência e integração de pipelines tridimensionais.',
      app: 'Aplicações Interativas & Integrações',
      focus: 'Código Organizado, Performance & Modularidade'
    },
    ai: {
      tag: 'TECNOLOGIA EMERGENTE',
      category: 'AUTOMAÇÃO & MODELOS GENERATIVOS',
      title: 'Inteligência Artificial',
      desc: 'Exploração prática e integração de ferramentas de Inteligência Artificial para otimização de fluxos de desenvolvimento, geração de soluções inteligentes e automação de processos digitais.',
      app: 'Workflows Produtivos & Soluções Inteligentes',
      focus: 'Aceleração Criativa & Resolução de Problemas'
    }
  };

  // ---------------------------------------------------------------------------
  // 2. DETECÇÃO DE SUPORTE WEBGL
  // ---------------------------------------------------------------------------
  function checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 3. MOTOR TRIDIMENSIONAL THREE.JS
  // ---------------------------------------------------------------------------
  class CinematicScene {
    constructor() {
      this.container = document.getElementById('webgl-container');
      this.canvas = document.getElementById('webgl-canvas');
      
      if (!checkWebGLSupport()) {
        console.warn('WebGL não suportado neste navegador. Carregando modo fallback elegante.');
        if (this.container) this.container.style.display = 'none';
        return;
      }

      this.init();
      this.setupLights();
      this.createScenes();
      this.bindEvents();
      this.render();
    }

    init() {
      // Criação da Cena e Névoa Cinematográfica
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x050507);
      this.scene.fog = new THREE.FogExp2(0x050507, 0.022);

      // Câmera com FOV cinematográfico
      const fov = state.isMobile ? 55 : 45;
      this.camera = new THREE.PerspectiveCamera(fov, state.windowWidth / state.windowHeight, 0.1, 1000);
      this.camera.position.set(0, 0.8, 12);
      this.targetLookAt = new THREE.Vector3(0, 0, 0);
      this.currentLookAt = new THREE.Vector3(0, 0, 0);

      // Renderer de Alta Fidelidade
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(state.windowWidth, state.windowHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      // Materiais Reutilizáveis com Acabamento Físico Minimalista
      this.materials = {
        darkTitanium: new THREE.MeshStandardMaterial({
          color: 0x181B24,
          metalness: 0.85,
          roughness: 0.25
        }),
        wireframeMat: new THREE.MeshBasicMaterial({
          color: 0x60A5FA,
          wireframe: true,
          transparent: true,
          opacity: 0.25
        }),
        accentBlue: new THREE.MeshStandardMaterial({
          color: 0x60A5FA,
          metalness: 0.5,
          roughness: 0.2,
          emissive: 0x1d3557,
          emissiveIntensity: 0.35
        }),
        accentViolet: new THREE.MeshStandardMaterial({
          color: 0x8B5CF6,
          metalness: 0.6,
          roughness: 0.25,
          emissive: 0x3c1361,
          emissiveIntensity: 0.35
        }),
        accentEmerald: new THREE.MeshStandardMaterial({
          color: 0x10B981,
          metalness: 0.4,
          roughness: 0.3,
          emissive: 0x064e3b,
          emissiveIntensity: 0.4
        }),
        glassTranslucent: new THREE.MeshPhysicalMaterial({
          color: 0x222634,
          metalness: 0.1,
          roughness: 0.15,
          transmission: 0.7,
          transparent: true,
          opacity: 0.65
        }),
        matteWhite: new THREE.MeshStandardMaterial({
          color: 0xF5F5F7,
          metalness: 0.1,
          roughness: 0.6
        })
      };

      // Grupos de Objetos por Seção
      this.groups = {
        hero: new THREE.Group(),
        about: new THREE.Group(),
        skills: new THREE.Group(),
        sinuca: new THREE.Group(),
        taskly: new THREE.Group(),
        apostila: new THREE.Group(),
        contact: new THREE.Group()
      };

      Object.values(this.groups).forEach(g => this.scene.add(g));
    }

    setupLights() {
      // Luz Ambiente Fria
      const ambientLight = new THREE.AmbientLight(0x121522, 1.4);
      this.scene.add(ambientLight);

      // Luz Principal Direcional (Key Light)
      this.keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.8);
      this.keyLight.position.set(10, 20, 15);
      this.scene.add(this.keyLight);

      // Luz de Borda Azul Fria (Rim Light)
      const rimLightBlue = new THREE.DirectionalLight(0x60A5FA, 2.2);
      rimLightBlue.position.set(-15, -8, -10);
      this.scene.add(rimLightBlue);

      // Ponto de Luz Violeta Discreto
      this.pointLightViolet = new THREE.PointLight(0x8B5CF6, 3.5, 45);
      this.pointLightViolet.position.set(0, 0, 5);
      this.scene.add(this.pointLightViolet);
    }

    createScenes() {
      this.createHeroScene();
      this.createAboutScene();
      this.createSkillsScene();
      this.createSinucaScene();
      this.createTasklyScene();
      this.createApostilaScene();
      this.createContactScene();
    }

    // --- 00 // HERO SCENE: MONÓLITO CRISTALINO & ANEIS ESTRUTURAIS ---
    createHeroScene() {
      const g = this.groups.hero;
      g.position.set(0, 0, 0);

      // Monólito Central Poliedro Multifacetado
      const geoCore = new THREE.IcosahedronGeometry(2.2, 0);
      const meshCore = new THREE.Mesh(geoCore, this.materials.darkTitanium);
      const meshWire = new THREE.Mesh(geoCore, this.materials.wireframeMat);
      meshWire.scale.setScalar(1.02);

      this.heroCore = new THREE.Group();
      this.heroCore.add(meshCore);
      this.heroCore.add(meshWire);
      g.add(this.heroCore);

      // Anéis Arquitetônicos Orbitais
      this.heroRing1 = new THREE.Mesh(
        new THREE.TorusGeometry(3.6, 0.035, 16, 80),
        this.materials.glassTranslucent
      );
      this.heroRing1.rotation.x = Math.PI / 3;

      this.heroRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(4.3, 0.025, 16, 80),
        this.materials.glassTranslucent
      );
      this.heroRing2.rotation.y = Math.PI / 4;

      g.add(this.heroRing1);
      g.add(this.heroRing2);

      // Elementos de Profundidade Distante (Planos Monumentais)
      const distantGrid = new THREE.GridHelper(50, 40, 0x1e293b, 0x0f172a);
      distantGrid.position.set(0, -6, -8);
      distantGrid.material.opacity = 0.25;
      distantGrid.material.transparent = true;
      g.add(distantGrid);
    }

    // --- 01 // SOBRE SCENE: MATRIZ ESPACIAL ESTRUTURADA ---
    createAboutScene() {
      const g = this.groups.about;
      g.position.set(0, -14, 0);

      this.aboutMatrix = new THREE.Group();

      // Painéis Arquitetônicos Interconectados
      for (let i = 0; i < 6; i++) {
        const planeGeo = new THREE.BoxGeometry(2.4, 0.04, 1.6);
        const plane = new THREE.Mesh(planeGeo, this.materials.glassTranslucent);
        plane.position.set(
          Math.sin(i * 1.05) * 2.2 + 2.5,
          (i - 2.5) * 0.9,
          Math.cos(i * 1.05) * 1.5 - 1
        );
        plane.rotation.y = i * 0.4;
        plane.rotation.z = (i % 2 === 0 ? 0.08 : -0.08);
        this.aboutMatrix.add(plane);
      }

      // Cubo Central de Transformação e Lógica
      const centerCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.4, 1.4),
        this.materials.darkTitanium
      );
      centerCube.position.set(2.5, 0, 0);
      const centerWire = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 1.45, 1.45),
        this.materials.wireframeMat
      );
      centerWire.position.copy(centerCube.position);

      this.aboutMatrix.add(centerCube);
      this.aboutMatrix.add(centerWire);
      g.add(this.aboutMatrix);
    }

    // --- 02 // HABILIDADES SCENE: NÓS TRIDIMENSIONAIS INTERATIVOS ---
    createSkillsScene() {
      const g = this.groups.skills;
      g.position.set(0, -28, 0);

      this.skillNodes = {};

      // Configuração dos 5 Módulos Espaciais
      const nodeConfigs = [
        { id: 'frontend', geo: new THREE.OctahedronGeometry(1.2, 0), mat: this.materials.accentBlue, pos: [-3.2, 1.5, 0] },
        { id: 'html5', geo: new THREE.BoxGeometry(1.3, 1.3, 1.3), mat: this.materials.darkTitanium, pos: [-1.6, -1.2, 1] },
        { id: 'css3', geo: new THREE.DodecahedronGeometry(1.1, 0), mat: this.materials.accentViolet, pos: [0.2, 1.6, -1] },
        { id: 'javascript', geo: new THREE.TorusGeometry(0.9, 0.35, 16, 32), mat: this.materials.matteWhite, pos: [2.0, -1.0, 0.5] },
        { id: 'ai', geo: new THREE.IcosahedronGeometry(1.3, 1), mat: this.materials.accentEmerald, pos: [3.4, 1.2, -0.5] }
      ];

      nodeConfigs.forEach(cfg => {
        const group = new THREE.Group();
        group.position.set(...cfg.pos);

        const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
        const wire = new THREE.Mesh(cfg.geo, this.materials.wireframeMat);
        wire.scale.setScalar(1.08);

        group.add(mesh);
        group.add(wire);
        g.add(group);

        this.skillNodes[cfg.id] = group;
      });
    }

    // --- 03 // PROJETO 01: SINUCA GAME ---
    createSinucaScene() {
      const g = this.groups.sinuca;
      g.position.set(0, -42, 0);

      this.sinucaVignette = new THREE.Group();
      this.sinucaVignette.position.set(2.8, 0, 0);

      // Mesa de Sinuca Estilizada (Geometria Arquitetônica)
      const tableGeo = new THREE.BoxGeometry(4.2, 0.25, 2.6);
      const clothMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b, // Verde escuro elegante
        roughness: 0.8,
        metalness: 0.1
      });
      const tableMesh = new THREE.Mesh(tableGeo, clothMat);
      this.sinucaVignette.add(tableMesh);

      // Bordas da Mesa (Madeira Escura / Metal)
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0x151821,
        roughness: 0.3,
        metalness: 0.7
      });
      const border1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.35, 0.2), borderMat);
      border1.position.set(0, 0.1, 1.35);
      const border2 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.35, 0.2), borderMat);
      border2.position.set(0, 0.1, -1.35);
      const border3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 2.8), borderMat);
      border3.position.set(2.2, 0.1, 0);
      const border4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 2.8), borderMat);
      border4.position.set(-2.2, 0.1, 0);

      this.sinucaVignette.add(border1, border2, border3, border4);

      // Bolas de Sinuca com Acabamento Especular
      const ballGeo = new THREE.SphereGeometry(0.18, 32, 32);
      const cueBallMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F7, roughness: 0.1, metalness: 0.1 });
      const eightBallMat = new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.1, metalness: 0.2 });
      const redBallMat = new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.1, metalness: 0.2 });
      const blueBallMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.1, metalness: 0.2 });

      this.cueBall = new THREE.Mesh(ballGeo, cueBallMat);
      this.cueBall.position.set(-1.0, 0.28, 0);

      const ball8 = new THREE.Mesh(ballGeo, eightBallMat);
      ball8.position.set(0.6, 0.28, 0);

      const ballRed = new THREE.Mesh(ballGeo, redBallMat);
      ballRed.position.set(0.9, 0.28, 0.2);

      const ballBlue = new THREE.Mesh(ballGeo, blueBallMat);
      ballBlue.position.set(0.9, 0.28, -0.2);

      this.sinucaVignette.add(this.cueBall, ball8, ballRed, ballBlue);

      // Taco de Sinuca Estilizado
      const cueStickGeo = new THREE.CylinderGeometry(0.04, 0.08, 3.2, 16);
      const cueStickMat = new THREE.MeshStandardMaterial({ color: 0xA3A3A3, roughness: 0.3, metalness: 0.5 });
      this.cueStick = new THREE.Mesh(cueStickGeo, cueStickMat);
      this.cueStick.position.set(-2.2, 0.6, 0);
      this.cueStick.rotation.z = Math.PI / 3.5;
      this.sinucaVignette.add(this.cueStick);

      // Ângulo de Enquadramento Cinematográfico
      this.sinucaVignette.rotation.x = Math.PI / 5.5;
      this.sinucaVignette.rotation.y = -Math.PI / 6;

      g.add(this.sinucaVignette);
    }

    // --- 04 // PROJETO 02: TASKLY ---
    createTasklyScene() {
      const g = this.groups.taskly;
      g.position.set(0, -56, 0);

      this.tasklyVignette = new THREE.Group();
      this.tasklyVignette.position.set(-2.8, 0, 0);

      // Pilhas Kanban Tridimensionais / Cartões Espaciais
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 3; row++) {
          const cardGeo = new THREE.BoxGeometry(1.2, 0.65, 0.06);
          const isDone = col === 2;
          const isProgress = col === 1;
          const cardMat = isDone ? this.materials.accentEmerald : (isProgress ? this.materials.accentBlue : this.materials.glassTranslucent);

          const card = new THREE.Mesh(cardGeo, cardMat);
          card.position.set(
            (col - 1) * 1.5,
            (1 - row) * 0.95,
            (col * 0.3) - (row * 0.1)
          );
          this.tasklyVignette.add(card);
        }
      }

      // Moldura Estrutural Externa
      const gridBack = new THREE.GridHelper(5, 6, 0x60A5FA, 0x1e293b);
      gridBack.rotation.x = Math.PI / 2;
      gridBack.position.set(0, 0, -0.6);
      this.tasklyVignette.add(gridBack);

      this.tasklyVignette.rotation.x = Math.PI / 10;
      this.tasklyVignette.rotation.y = Math.PI / 5.5;

      g.add(this.tasklyVignette);
    }

    // --- 05 // PROJETO 03: APOSTILA DE EXCEL (PUBLICAÇÃO & PLANILHA 3D) ---
    createApostilaScene() {
      const g = this.groups.apostila;
      g.position.set(0, -70, 0);

      this.apostilaVignette = new THREE.Group();
      this.apostilaVignette.position.set(2.8, 0, 0);

      // Livro / Apostila Aberta em Perspectiva
      const coverGeo = new THREE.BoxGeometry(2.4, 3.2, 0.1);
      const excelGreenMat = new THREE.MeshStandardMaterial({
        color: 0x107C41, // Verde clássico do Excel
        roughness: 0.35,
        metalness: 0.3
      });

      const pageLeft = new THREE.Mesh(coverGeo, this.materials.matteWhite);
      pageLeft.position.set(-1.25, 0, 0.1);
      pageLeft.rotation.y = 0.25;

      const pageRight = new THREE.Mesh(coverGeo, this.materials.matteWhite);
      pageRight.position.set(1.25, 0, 0.1);
      pageRight.rotation.y = -0.25;

      // Reticulado de Células de Planilha Tridimensional Flutuante
      const gridSheet = new THREE.GridHelper(2.8, 14, 0x10B981, 0x94A3B8);
      gridSheet.rotation.x = Math.PI / 2;
      gridSheet.position.set(0, 0, 0.35);
      gridSheet.scale.set(0.7, 1, 0.9);

      // Ícone Tridimensional do "X" do Excel
      const xShape1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.12), excelGreenMat);
      xShape1.rotation.z = Math.PI / 4;
      xShape1.position.set(-1.2, 0.8, 0.25);

      const xShape2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.12), excelGreenMat);
      xShape2.rotation.z = -Math.PI / 4;
      xShape2.position.set(-1.2, 0.8, 0.25);

      this.apostilaVignette.add(pageLeft, pageRight, gridSheet, xShape1, xShape2);

      this.apostilaVignette.rotation.x = Math.PI / 6;
      this.apostilaVignette.rotation.y = -Math.PI / 6;

      g.add(this.apostilaVignette);
    }

    // --- 06 // CONTATO SCENE: MONUMENTO DE LUZ E FINALIZAÇÃO ---
    createContactScene() {
      const g = this.groups.contact;
      g.position.set(0, -84, 0);

      // Obelisco Monolítico Ascendente
      const spireGeo = new THREE.CylinderGeometry(0.1, 1.8, 12, 4);
      const spire = new THREE.Mesh(spireGeo, this.materials.darkTitanium);
      spire.position.set(0, 4, -4);
      g.add(spire);

      // Feixe Vertical Luminoso
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 30, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x60A5FA,
        transparent: true,
        opacity: 0.6
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 10, -4);
      g.add(beam);

      // Partículas Mínimas de Poeira Espacial
      const particleCount = 120;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 16;
        positions[i + 1] = (Math.random() - 0.5) * 16;
        positions[i + 2] = (Math.random() - 0.5) * 16 - 2;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x9CA3AF,
        size: 0.05,
        transparent: true,
        opacity: 0.5
      });
      this.contactParticles = new THREE.Points(particleGeo, particleMat);
      g.add(this.contactParticles);
    }

    // --- INTERAÇÃO & FOCO NA HABILIDADE ATIVA ---
    focusSkillNode(skillId) {
      Object.entries(this.skillNodes).forEach(([id, node]) => {
        if (id === skillId) {
          node.scale.set(1.35, 1.35, 1.35);
          node.children[0].material.emissiveIntensity = 0.9;
        } else {
          node.scale.set(1.0, 1.0, 1.0);
          if (node.children[0].material.emissiveIntensity !== undefined) {
            node.children[0].material.emissiveIntensity = 0.2;
          }
        }
      });
    }

    bindEvents() {
      window.addEventListener('resize', () => this.onResize(), { passive: true });
    }

    onResize() {
      state.windowWidth = window.innerWidth;
      state.windowHeight = window.innerHeight;
      state.isMobile = state.windowWidth <= 900;

      this.camera.aspect = state.windowWidth / state.windowHeight;
      this.camera.fov = state.isMobile ? 55 : 45;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(state.windowWidth, state.windowHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // --- CHOREOGRAFIA DA CÂMERA AO LONGO DO SCROLL ---
    updateCameraFromScroll() {
      const p = state.scrollProgress; // 0.0 a 1.0

      // Waypoints Cinematográficos
      // 0.00: Hero
      // 0.18: Sobre
      // 0.38: Habilidades
      // 0.58: Sinuca Game
      // 0.74: Taskly
      // 0.88: Apostila de Excel
      // 1.00: Contato

      let targetPos = new THREE.Vector3();
      let targetLook = new THREE.Vector3();

      if (p <= 0.15) {
        // Hero
        const factor = p / 0.15;
        targetPos.set(0, 0.8 - factor * 2, 12 - factor * 1);
        targetLook.set(0, -factor * 1.5, 0);
      } else if (p <= 0.32) {
        // Transição Hero -> Sobre
        const factor = (p - 0.15) / 0.17;
        const xOffset = state.isMobile ? 0 : -3.6;
        targetPos.set(xOffset * factor, -2 - factor * 12, 11 - factor * 1.5);
        targetLook.set(1.2 * factor, -2 - factor * 12, 0);
      } else if (p <= 0.52) {
        // Transição Sobre -> Habilidades
        const factor = (p - 0.32) / 0.20;
        const xStart = state.isMobile ? 0 : -3.6;
        const xEnd = state.isMobile ? 0 : 3.4;
        targetPos.set(xStart + (xEnd - xStart) * factor, -14 - factor * 14, 9.5);
        targetLook.set(0, -14 - factor * 14, 0);
      } else if (p <= 0.68) {
        // Transição Habilidades -> Sinuca Game
        const factor = (p - 0.52) / 0.16;
        const xStart = state.isMobile ? 0 : 3.4;
        const xEnd = state.isMobile ? 0 : -3.2;
        targetPos.set(xStart + (xEnd - xStart) * factor, -28 - factor * 14, 9.2);
        targetLook.set(1.5 * factor, -28 - factor * 14, 0);
      } else if (p <= 0.82) {
        // Transição Sinuca -> Taskly
        const factor = (p - 0.68) / 0.14;
        const xStart = state.isMobile ? 0 : -3.2;
        const xEnd = state.isMobile ? 0 : 3.2;
        targetPos.set(xStart + (xEnd - xStart) * factor, -42 - factor * 14, 9.2);
        targetLook.set(-1.5 * factor, -42 - factor * 14, 0);
      } else if (p <= 0.93) {
        // Transição Taskly -> Apostila de Excel
        const factor = (p - 0.82) / 0.11;
        const xStart = state.isMobile ? 0 : 3.2;
        const xEnd = state.isMobile ? 0 : -3.0;
        targetPos.set(xStart + (xEnd - xStart) * factor, -56 - factor * 14, 9.2);
        targetLook.set(1.5 * factor, -56 - factor * 14, 0);
      } else {
        // Transição Apostila -> Contato & Final
        const factor = (p - 0.93) / 0.07;
        const xStart = state.isMobile ? 0 : -3.0;
        targetPos.set(xStart * (1 - factor), -70 - factor * 14, 9.2 + factor * 4.5);
        targetLook.set(0, -70 - factor * 13, -2 * factor);
      }

      // Parallax Discreto do Mouse (Controle Suave sem Trepidação)
      const parallaxX = state.mouse.x * (state.isMobile ? 0.1 : 0.45);
      const parallaxY = state.mouse.y * (state.isMobile ? 0.1 : 0.35);

      targetPos.x += parallaxX;
      targetPos.y += parallaxY;

      // Interpolação Suave (Lerp Cinematográfico)
      this.camera.position.lerp(targetPos, 0.055);
      this.currentLookAt.lerp(targetLook, 0.055);
      this.camera.lookAt(this.currentLookAt);
    }

    render() {
      requestAnimationFrame(() => this.render());

      const elapsed = state.clock.getElapsedTime();

      // 1. Rotação Contínua e Orgânica do Hero
      if (this.heroCore) {
        this.heroCore.rotation.y = elapsed * 0.18;
        this.heroCore.rotation.x = Math.sin(elapsed * 0.12) * 0.15;
      }
      if (this.heroRing1) this.heroRing1.rotation.z = elapsed * 0.12;
      if (this.heroRing2) this.heroRing2.rotation.y = -elapsed * 0.15;

      // 2. Microanimações nos Módulos de Habilidade
      if (this.skillNodes) {
        Object.values(this.skillNodes).forEach((node, i) => {
          node.rotation.y = elapsed * 0.3 + (i * 0.5);
          node.rotation.x = Math.sin(elapsed * 0.4 + i) * 0.15;
        });
      }

      // 3. Flutuação Sutil das Composições de Projetos
      if (this.sinucaVignette) {
        this.sinucaVignette.position.y = Math.sin(elapsed * 0.8) * 0.08;
      }
      if (this.tasklyVignette) {
        this.tasklyVignette.position.y = Math.cos(elapsed * 0.7) * 0.08;
      }
      if (this.apostilaVignette) {
        this.apostilaVignette.position.y = Math.sin(elapsed * 0.75 + 1) * 0.08;
      }

      // 4. Poeira Estelar do Contato
      if (this.contactParticles) {
        this.contactParticles.rotation.y = elapsed * 0.02;
      }

      // 5. Câmera Cinematográfica
      this.updateCameraFromScroll();

      // 6. Desenho da Cena
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. SISTEMA DE ÁUDIO AMBIENTE SINTETIZADO (WEB AUDIO API)
  // ---------------------------------------------------------------------------
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.osc1 = null;
      this.osc2 = null;
      this.gainNode = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Drone Atmosférico Minimalista e Cinematográfico (Frequências Graves Suaves)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Nota Lá (A1) grave

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // Harmônico sutil

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
    }

    play() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.2);
    }

    stop() {
      if (!this.ctx || !this.gainNode) return;
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. CONTROLADOR DE INTERAÇÃO & UI
  // ---------------------------------------------------------------------------
  class UIController {
    constructor(sceneInstance) {
      this.scene = sceneInstance;
      this.audio = new AudioEngine();
      this.initDOMElements();
      this.bindEvents();
      this.initObserver();
    }

    initDOMElements() {
      this.cursorDot = document.getElementById('cursor-dot');
      this.cursorRing = document.getElementById('cursor-ring');
      this.progressBar = document.getElementById('scroll-progress-bar');
      this.siteHeader = document.getElementById('site-header');
      this.audioBtn = document.getElementById('audio-toggle');
      this.menuToggle = document.getElementById('menu-toggle');
      this.mobileMenu = document.getElementById('mobile-menu');
      this.pdfModal = document.getElementById('pdf-modal');
      this.btnOpenPdf = document.getElementById('btn-open-pdf-modal');
      this.btnClosePdf = document.getElementById('btn-close-pdf-modal');

      // Elementos do Inspector de Habilidades
      this.skillTabs = document.querySelectorAll('.skill-item');
      this.inspectorTitle = document.getElementById('skill-title');
      this.inspectorDesc = document.getElementById('skill-desc');
      this.inspectorTag = document.getElementById('skill-tag');
      this.inspectorCategory = document.getElementById('skill-category');
      this.inspectorApp = document.getElementById('skill-app');
      this.inspectorFocus = document.getElementById('skill-focus');

      // Links e Marcadores de Seção
      this.sideDots = document.querySelectorAll('.side-nav-dot');
      this.sections = document.querySelectorAll('.section');
    }

    bindEvents() {
      // Movimento do Mouse & Cursor Cinematográfico
      window.addEventListener('mousemove', (e) => {
        state.mouse.targetX = (e.clientX / state.windowWidth) * 2 - 1;
        state.mouse.targetY = -(e.clientY / state.windowHeight) * 2 + 1;

        if (this.cursorDot && this.cursorRing) {
          this.cursorDot.style.left = `${e.clientX}px`;
          this.cursorDot.style.top = `${e.clientY}px`;

          // Suavização do anel externo
          requestAnimationFrame(() => {
            this.cursorRing.style.left = `${e.clientX}px`;
            this.cursorRing.style.top = `${e.clientY}px`;
          });
        }
      }, { passive: true });

      // Animação Contínua de Parallax Suavizado
      const updateMouseLerp = () => {
        state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.08;
        state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.08;
        requestAnimationFrame(updateMouseLerp);
      };
      updateMouseLerp();

      // Expansão do Cursor em Elementos Clicáveis
      const interactables = document.querySelectorAll('a, button, [role="tab"], .contact-card, .btn');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', () => this.cursorRing && this.cursorRing.classList.add('is-hovered'));
        el.addEventListener('mouseleave', () => this.cursorRing && this.cursorRing.classList.remove('is-hovered'));
      });

      // Cálculo de Scroll e Barra de Progresso
      window.addEventListener('scroll', () => {
        state.scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        state.scrollProgress = maxScroll > 0 ? Math.min(Math.max(state.scrollY / maxScroll, 0), 1) : 0;

        if (this.progressBar) {
          this.progressBar.style.width = `${state.scrollProgress * 100}%`;
        }

        if (this.siteHeader) {
          if (state.scrollY > 50) {
            this.siteHeader.classList.add('is-scrolled');
          } else {
            this.siteHeader.classList.remove('is-scrolled');
          }
        }
      }, { passive: true });

      // Seleção Interativa de Habilidades
      this.skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const skillKey = tab.getAttribute('data-skill');
          this.setActiveSkill(skillKey);
        });
      });

      // Alternância de Áudio
      if (this.audioBtn) {
        this.audioBtn.addEventListener('click', () => {
          state.audioActive = !state.audioActive;
          const label = this.audioBtn.querySelector('.audio-label');
          if (state.audioActive) {
            this.audioBtn.classList.add('is-active');
            if (label) label.textContent = 'ÁUDIO: ON';
            this.audio.play();
          } else {
            this.audioBtn.classList.remove('is-active');
            if (label) label.textContent = 'ÁUDIO: OFF';
            this.audio.stop();
          }
        });
      }

      // Menu Mobile
      if (this.menuToggle && this.mobileMenu) {
        this.menuToggle.addEventListener('click', () => {
          const isOpen = this.mobileMenu.classList.toggle('is-open');
          this.menuToggle.setAttribute('aria-expanded', isOpen);
          document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.mobileMenu.classList.remove('is-open');
            this.menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          });
        });
      }

      // Modal de Leitura da Apostila de Excel (PDF)
      if (this.btnOpenPdf && this.pdfModal) {
        this.btnOpenPdf.addEventListener('click', () => {
          this.pdfModal.classList.add('is-open');
          this.pdfModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        });
      }

      if (this.btnClosePdf && this.pdfModal) {
        this.btnClosePdf.addEventListener('click', () => this.closePdfModal());
      }

      if (this.pdfModal) {
        this.pdfModal.addEventListener('click', (e) => {
          if (e.target === this.pdfModal) this.closePdfModal();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.pdfModal && this.pdfModal.classList.contains('is-open')) {
          this.closePdfModal();
        }
      });
    }

    closePdfModal() {
      if (!this.pdfModal) return;
      this.pdfModal.classList.remove('is-open');
      this.pdfModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    setActiveSkill(skillKey) {
      if (!SKILLS_DATA[skillKey]) return;
      state.activeSkill = skillKey;
      const data = SKILLS_DATA[skillKey];

      // Atualiza Tabs
      this.skillTabs.forEach(tab => {
        const isSelected = tab.getAttribute('data-skill') === skillKey;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', isSelected);
      });

      // Atualiza Painel de Detalhes
      if (this.inspectorTitle) this.inspectorTitle.textContent = data.title;
      if (this.inspectorDesc) this.inspectorDesc.textContent = data.desc;
      if (this.inspectorTag) this.inspectorTag.textContent = data.tag;
      if (this.inspectorCategory) this.inspectorCategory.textContent = data.category;
      if (this.inspectorApp) this.inspectorApp.textContent = data.app;
      if (this.inspectorFocus) this.inspectorFocus.textContent = data.focus;

      // Foca o objeto 3D correspondente
      if (this.scene && this.scene.focusSkillNode) {
        this.scene.focusSkillNode(skillKey);
      }
    }

    initObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            state.activeSection = sectionId;

            // Atualiza side nav dots
            this.sideDots.forEach(dot => {
              const matches = dot.getAttribute('data-section') === sectionId;
              dot.classList.toggle('active', matches);
            });
          }
        });
      }, { threshold: 0.35 });

      this.sections.forEach(s => observer.observe(s));
    }
  }

  // ---------------------------------------------------------------------------
  // 6. INICIALIZAÇÃO DA APLICAÇÃO
  // ---------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    // Remover classe de carregamento
    document.body.classList.remove('is-loading');

    // Inicializar Cena 3D e Interface
    const cinematicScene = new CinematicScene();
    new UIController(cinematicScene);

    // Foco inicial na primeira habilidade
    if (cinematicScene && cinematicScene.focusSkillNode) {
      cinematicScene.focusSkillNode('frontend');
    }
  });

})();
