document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVEGAÇÃO E INTERAÇÃO BÁSICA =====
    
    function setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      });
    }
    
    function setupPortfolioAnimation() {
      const portfolioElement = document.querySelector('h1 a[href="#projects"]');
      
      if (portfolioElement) {
        portfolioElement.addEventListener('mouseenter', function() {
          this.classList.add('hover-effect');
        });
        
        portfolioElement.addEventListener('mouseleave', function() {
          this.classList.remove('hover-effect');
        });
      }
    }
    
    function setupNameAnimation() {
      const nameLink = document.getElementById('nameLink');
      const additionalLetters = document.getElementById('additionalLetters');
      if (!nameLink || !additionalLetters) return;

      const supportsHover = typeof window.matchMedia === 'function'
        ? window.matchMedia('(hover: hover)').matches
        : true;
      if (!supportsHover) return;

      const textNode = nameLink.firstChild;
      const baseName = textNode && textNode.nodeType === 3 ? textNode.nodeValue : 'GUI';
      const extraLetters = 'LHERME';
      let currentIndex = 0;
      let intervalId;

      function resetAnimation() {
        clearInterval(intervalId);
        additionalLetters.textContent = '';
        currentIndex = 0;
        if (textNode) {
          textNode.nodeValue = baseName;
        }
      }

      nameLink.addEventListener('mouseenter', () => {
        resetAnimation();
        intervalId = setInterval(() => {
          if (currentIndex < extraLetters.length) {
            additionalLetters.textContent = extraLetters.slice(0, currentIndex + 1);
            currentIndex++;
          } else {
            clearInterval(intervalId);
          }
        }, 100);
      });

      nameLink.addEventListener('mouseleave', resetAnimation);
    }
    
    function setupEmailCopy() {
      const copyEmailBtn = document.getElementById('copyEmailBtn');
      const copyMessage = document.getElementById('copyMessage');
      
      if (copyEmailBtn && copyMessage) {
        copyEmailBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const email = this.getAttribute('data-email');
          
          navigator.clipboard.writeText(email).then(() => {
            copyMessage.classList.add('show');
            
            setTimeout(() => {
              copyMessage.classList.remove('show');
            }, 2000);
          }).catch(err => {
            console.error('Erro ao copiar email:', err);
          });
        });
      }
    }
    
    // ===== CURSOR PERSONALIZADO - SEMPRE VISÍVEL NO DESKTOP =====
    
    function setupCustomCursor() {
      const cursor = document.querySelector('.cursor');
      if (!cursor) return;
      
      // Detectar se é dispositivo touch (mobile/tablet)
      const supportsHover = typeof window.matchMedia === 'function'
        ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
        : true;
      
      if (!supportsHover) {
        // É mobile/touch - esconder cursor completamente
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
      }
      
      // É desktop - configurar cursor personalizado
      let cursorX = 0;
      let cursorY = 0;
      
      // CHROME FIX: Forçar esconder cursor do sistema no Chrome
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      
      if (isChrome) {
        // Injetar CSS inline para Chrome (mais forte que external CSS)
        const chromeStyle = document.createElement('style');
        chromeStyle.id = 'chrome-cursor-fix';
        chromeStyle.textContent = `
          *, *::before, *::after {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="transparent"/></svg>') 0 0, none !important;
          }
        `;
        document.head.appendChild(chromeStyle);
        
        // Também forçar via JavaScript
        setInterval(() => {
          document.documentElement.style.cursor = 'none';
          document.body.style.cursor = 'none';
        }, 100);
      }
      
      // Função para garantir que cursor está visível
      function ensureCursorVisible() {
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
        cursor.style.visibility = 'visible';
      }
      
      // Mouse move - atualiza posição E garante visibilidade
      document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX - 20;
        cursorY = e.clientY - 20;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        ensureCursorVisible();
      });
      
      // Garantir visibilidade em vários eventos
      document.addEventListener('mouseenter', ensureCursorVisible);
      document.addEventListener('mouseover', ensureCursorVisible);
      document.addEventListener('click', ensureCursorVisible);
      
      // Verificar periodicamente se cursor está visível (fallback)
      setInterval(ensureCursorVisible, 100);
      
      // Aumentar em elementos interativos
      function addHoverEffects(elements) {
        elements.forEach(link => {
          if (!link) return;
          link.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            ensureCursorVisible();
          });
          link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            ensureCursorVisible();
          });
        });
      }
      
      const links = document.querySelectorAll('a, button, .media-item');
      addHoverEffects(links);
      
      // Adicionar também aos project types
      const projectTypes = document.querySelectorAll('.project-type');
      addHoverEffects(projectTypes);
      
      // Função para adicionar hover a novos elementos (lightbox, etc)
      window.addCursorHoverEffect = function(selector) {
        const elements = document.querySelectorAll(selector);
        addHoverEffects(elements);
      };
      
      // Observer para elementos que aparecem dinamicamente
      const observer = new MutationObserver(() => {
        ensureCursorVisible();
        // Re-adicionar hover effects a novos elementos
        const newLinks = document.querySelectorAll('a:not([data-cursor-setup]), button:not([data-cursor-setup])');
        newLinks.forEach(el => {
          el.setAttribute('data-cursor-setup', 'true');
        });
        addHoverEffects(newLinks);
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    // ===== EFEITOS DE SCROLL E CORES =====
    
    function setupScrollEffects() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      
      gsap.registerPlugin(ScrollTrigger);
      
      const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
      
      scrollColorElems.forEach((colorSection, i) => {
        const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
        const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;
        
        ScrollTrigger.create({
          trigger: colorSection,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () =>
            gsap.to("body", {
              backgroundColor: colorSection.dataset.bgcolor,
              color: colorSection.dataset.textcolor,
              overwrite: "auto"
            }),
          onLeaveBack: () =>
            gsap.to("body", {
              backgroundColor: prevBg,
              color: prevText,
              overwrite: "auto"
            })
        });
      });
    }
    
    function setupAboutImageRotation() {
      const aboutImage = document.querySelector('#aboutme .aboutme-frame img');
      if (!aboutImage || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(aboutImage, { rotate: 180, scale: 1.1 });
      
      gsap.to(aboutImage, {
        rotate: 0,
        scale: 1.1,
        scrollTrigger: {
          trigger: '#aboutme',
          start: 'top 60%',
          endTrigger: '#projects',
          end: 'top 100%',
          scrub: true
        }
      });
    }
    
    function setupAboutTextReveal() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      const aboutSection = document.getElementById('aboutme');
      if (!aboutSection) return;
      
      gsap.registerPlugin(ScrollTrigger);
      gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          invalidateOnRefresh: true,
          once: true
        }
      })
      .fromTo('#aboutme .aboutme-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
      .fromTo('#aboutme .aboutme-text',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
        '>0.2'
      );
    }
    
    function setupProjectCardsReveal() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      const projectSection = document.getElementById('projects');
      if (!projectSection) return;
      
      const cards = projectSection.querySelectorAll('.project-card');
      const targets = cards.length ? cards : projectSection.querySelectorAll('.title-list h3');
      if (!targets.length) return;
      
      gsap.registerPlugin(ScrollTrigger);
      gsap.timeline({
        scrollTrigger: {
          trigger: projectSection,
          start: 'top 80%',
          invalidateOnRefresh: true,
          once: true
        }
      })
      .fromTo(targets,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 }
      );
    }
    
    // ===== SISTEMA DE PROJETOS - GRID MODERNO =====
    
    const projects = [
      {
        title: "166studio",
        description: "I created an innovative website for a studio composed of an animator and an illustrator, inspired by Portuguese architecture. The website design simulates a building, standing out through the use of traditional Portuguese tiles, which add an authentic and cultural touch.",
        images: [
          "./imagens/166.jpg",
          "./imagens/1661.png",
          "./imagens/1662.png"
        ],
        tags: ["Web Design", "UI/UX", "Development"],
        links: [
          { text: "Visit Website", url: "https://166studio.netlify.app/" }
        ]
      },
      {
        title: "Spald App",
        description: "A self-initiated redesign of a local gym app. I replaced an outdated interface with a modern, high-contrast dark design. The project includes a streamlined class booking system, a personalized health dashboard to monitor physical evaluations, and integrated QR codes for quick access. Created in Figma with a focus on usability and clean visual hierarchy.",
        images: [
          "./imagens/app2.jpg",
          "./imagens/appleft.png",
          "./imagens/appmeio.png",
          "./imagens/appright.png"
        ],
        tags: ["UI/UX Design", "App", "Figma"],
        links: []
      },
      {
        title: "Boavista FC",
        description: "I decided to redesign this page to fix some layout errors and make it look more modern. My main goal was to make the information clearer and easier to read. I focused on improving the membership cards and the pricing tables, creating a cleaner experience that fits the club's identity.",
        images: [
          "./imagens/boavista.jpg",
          "./imagens/boavistanovo.jpg",
          "./imagens/boavistaantigo.jpg"
        ],
  
          
        
        tags: ["Redesign", "UI/UX Design", "Figma"],
        links: []
      },
      {
        title: "Predictorfy's ReDesign",
        description: "Predictorfy is a platform that predicts football team lineups. I was in charge of a full website redesign, focusing on making it more intuitive, visually appealing, and easier to use. The new look comes in both light and dark mode, so users can choose what works best for them. I restructured the main pages to highlight predictions, team comparisons, and key stats. All laid out in a clean, accessible way. The end result is a more modern, functional site that balances a tech-savvy vibe with the energy of the football world.",
        images: [
          "./imagens/predpc.jpg",
          "./imagens/predmobile.jpg",
          "./imagens/predpclight.jpg"
        ],
        tags: ["Web Design", "ReDesign", "Development"],
        links: [
          { text: "Visit Website", url: "https://predictorfy.com/" }
        ]
      },
    ];
    
    function setupProjectSystem() {
      setupProjectImageHover();
      
      const projectItems = document.querySelectorAll('.title-list h3');
      projectItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
          event.preventDefault();
          openPopup(index);
        });
      });
      
      const closeButton = document.getElementById('popup-close');
      if (closeButton) {
        closeButton.addEventListener('click', closePopup);
      }
      
      const popupOverlay = document.querySelector('.popup-overlay');
      if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
      }
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        const popup = document.getElementById('project-popup');
        const lightbox = document.querySelector('.lightbox');
        
        if (e.key === 'Escape') {
          if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
          } else if (popup && popup.classList.contains('active')) {
            closePopup();
          }
        } else if (lightbox && lightbox.classList.contains('active')) {
          // Navegação no lightbox
          if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
          } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
          }
        }
      });
    }
    
    function setupProjectImageHover() {
      const projectLinks = document.querySelectorAll('.project-link');
      const projectTypes = document.querySelectorAll('.project-type');
      const projectTitles = document.querySelectorAll('.title-list h3');
      const projectImages = document.querySelectorAll('.image-list img');
      
      if (projectImages.length === 0) return;
      
      projectImages[0].style.opacity = '1';
      
      function showImage(index) {
        projectImages.forEach((img, i) => {
          img.style.opacity = i === index ? '1' : '0';
        });
      }
      
      projectLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => showImage(index));
      });
      
      projectTypes.forEach((type, index) => {
        type.addEventListener('mouseenter', () => showImage(index));
      });
      
      projectTitles.forEach((title, index) => {
        title.addEventListener('mouseenter', () => showImage(index));
      });
    }
    
    function openPopup(index) {
      if (index < 0 || index >= projects.length) return;
      
      const project = projects[index];
      const popup = document.getElementById('project-popup');
      const popupTitle = document.getElementById('popup-title');
      const popupDescription = document.getElementById('popup-description');
      const tagsContainer = document.getElementById('popup-tags');
      const linksContainer = document.getElementById('popup-links');
      const mediaGrid = document.querySelector('.media-grid');
      
      if (!popup || !popupTitle || !popupDescription || !tagsContainer || 
          !linksContainer || !mediaGrid) return;
      
      // Preencher info
      popupTitle.textContent = project.title;
      popupDescription.textContent = project.description;
      
      // Tags
      tagsContainer.innerHTML = '';
      project.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'popup-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
      
      // Links
      linksContainer.innerHTML = '';
      if (project.links && project.links.length > 0) {
        project.links.forEach(link => {
          const linkElement = document.createElement('a');
          linkElement.className = 'popup-link';
          linkElement.href = link.url;
          linkElement.textContent = link.text;
          linkElement.target = '_blank';
          linksContainer.appendChild(linkElement);
        });
      }
      
      // Renderizar grid de media
      renderMediaGrid(project);
      
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function renderMediaGrid(project) {
      const mediaGrid = document.querySelector('.media-grid');
      if (!mediaGrid) return;
      
      mediaGrid.innerHTML = '';
      
      const normalizeMedia = value => {
        if (!value && value !== 0) return [];
        const sourceArray = Array.isArray(value) ? value : [value];
        return sourceArray.filter(Boolean);
      };
      
      const imageSources = normalizeMedia(project.images);
      const videoSources = normalizeMedia(project.videos);
      
      const allMedia = [
        ...imageSources.map(src => ({ type: 'image', src })),
        ...videoSources.map(src => ({ type: 'video', src }))
      ];
      
      if (allMedia.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'media-grid-empty';
        emptyMessage.textContent = 'No media available for this project.';
        mediaGrid.appendChild(emptyMessage);
        return;
      }
      
      // Separar primeira imagem (hero) das restantes
      const heroMedia = allMedia.length > 0 ? allMedia[0] : null;
      const regularMedia = allMedia.slice(1);
      
      // Sistema de posicionamento - hero + scattered
      const positions = generateScatteredPositions(regularMedia.length, heroMedia !== null);
      
      // Calcular altura necessária do grid
      const galleryElement = document.querySelector('.popup-gallery');
      const containerWidth = galleryElement ? (galleryElement.clientWidth - 80) : 800;
      const calculatedHeroHeight = heroMedia ? (containerWidth * 0.7) / (16/9) + 120 : 0;
      const regularMaxY = regularMedia.length > 0 
        ? Math.max(...positions.map(p => p.top + p.height)) 
        : 0;
      const maxY = Math.max(calculatedHeroHeight, regularMaxY) + 40;
      mediaGrid.style.minHeight = maxY + 'px';
      
      // Preparar array para lightbox navigation (hero + regular)
      const lightboxArray = allMedia.map((item, idx) => ({
        item: item,
        type: item.type
      }));
      
      // RENDERIZAR HERO IMAGE (primeira imagem)
      if (heroMedia) {
        const heroItem = document.createElement('div');
        // Hero sempre horizontal, mesmo em projetos de app
        heroItem.className = `media-item media-item--hero ${heroMedia.type === 'video' ? 'is-video' : ''}`.trim();
        
        if (heroMedia.type === 'video') {
          const video = document.createElement('video');
          video.src = heroMedia.src;
          video.preload = 'metadata';
          video.controls = false;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          
          heroItem.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
            heroItem.classList.add('wiggling');
            setTimeout(() => {
              heroItem.classList.remove('wiggling');
            }, 1200);
          });
          
          heroItem.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            heroItem.classList.remove('wiggling');
          });
          
          heroItem.addEventListener('click', () => {
            openLightbox(heroMedia, 'video', lightboxArray, 0);
          });
          
          heroItem.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = heroMedia.src;
          img.alt = `${project.title} - Hero Image`;
          img.loading = 'eager';
          
          heroItem.addEventListener('mouseenter', () => {
            heroItem.classList.add('wiggling');
            setTimeout(() => {
              heroItem.classList.remove('wiggling');
            }, 1200);
          });
          
          heroItem.addEventListener('mouseleave', () => {
            heroItem.classList.remove('wiggling');
          });
          
          heroItem.addEventListener('click', () => {
            openLightbox(heroMedia, 'image', lightboxArray, 0);
          });
          
          heroItem.appendChild(img);
        }
        
        mediaGrid.appendChild(heroItem);
      }
      
      // RENDERIZAR IMAGENS REGULARES (scattered)
      regularMedia.forEach((item, index) => {
        const mediaItem = document.createElement('div');
        const pos = positions[index];
        
        mediaItem.className = `media-item ${item.type === 'video' ? 'is-video' : ''}`;
        mediaItem.style.left = pos.left + 'px';
        mediaItem.style.top = pos.top + 'px';
        mediaItem.style.width = pos.width + 'px';
        mediaItem.style.height = pos.height + 'px';
        mediaItem.style.transform = `scale(1) rotate(${pos.rotation}deg)`;
        mediaItem.style.setProperty('--hover-rotate', `${pos.rotation}deg`);
        
        const lightboxIndex = index + 1; // +1 porque hero é index 0
        
        if (item.type === 'video') {
          const video = document.createElement('video');
          video.src = item.src;
          video.preload = 'metadata';
          video.controls = false;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          
          mediaItem.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
            // Add wiggling class immediately on hover
            mediaItem.classList.add('wiggling');
            // Remove after animation completes
            setTimeout(() => {
              mediaItem.classList.remove('wiggling');
            }, 1200);
          });
          
          mediaItem.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            mediaItem.classList.remove('wiggling');
          });
          
          mediaItem.addEventListener('click', () => {
            openLightbox(item, 'video', lightboxArray, index);
          });
          
          mediaItem.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = `${project.title} - Image ${index + 1}`;
          img.loading = index < 4 ? 'eager' : 'lazy';
          
          mediaItem.addEventListener('mouseenter', () => {
            // Add wiggling class immediately on hover
            mediaItem.classList.add('wiggling');
            // Remove after animation completes
            setTimeout(() => {
              mediaItem.classList.remove('wiggling');
            }, 1200);
          });
          
          mediaItem.addEventListener('mouseleave', () => {
            mediaItem.classList.remove('wiggling');
          });
          
          mediaItem.addEventListener('click', () => {
            openLightbox(item, 'image', lightboxArray, index);
          });
          
          mediaItem.appendChild(img);
        }
        
        mediaGrid.appendChild(mediaItem);
      });
    }
    
    // Gera posições aleatórias sem sobreposição
    function generateScatteredPositions(count, hasHero = false) {
      const positions = [];
      const baseWidth = 352; // Aumentado 10% (320 * 1.1)
      const baseHeight = 264; // Aumentado 10% (240 * 1.1)
      const padding = 30;
      const maxAttempts = 50;
      
      const galleryElement = document.querySelector('.popup-gallery');
      const containerWidth = galleryElement ? (galleryElement.clientWidth - 80) : 800;
      const maxRotation = 8;
      
      const columns = Math.floor(containerWidth / (baseWidth + padding));
      const actualColumns = Math.max(2, Math.min(columns, 3));
      
      // Se tem hero, calcular offset mínimo baseado na altura do hero
      // Hero: 70% width com aspect 16:9 → altura ≈ 0.70 × containerWidth / (16/9)
      // Adicionar margem de segurança generosa
      const heroHeight = hasHero ? (containerWidth * 0.7) / (16/9) : 0;
      const heroOffset = hasHero ? Math.max(500, heroHeight + 120) : 0; // Mínimo 500px
      
      for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        
        // Variação aleatória no tamanho (±15%)
        const sizeVariation = 0.85 + (Math.random() * 0.3); // 0.85 a 1.15
        const itemWidth = Math.floor(baseWidth * sizeVariation);
        const itemHeight = Math.floor(baseHeight * sizeVariation);
        
        while (!placed && attempts < maxAttempts) {
          const col = i % actualColumns;
          const row = Math.floor(i / actualColumns);
          
          const baseLeft = col * (baseWidth + padding * 2);
          const baseTop = heroOffset + row * (baseHeight + padding * 2);
          
          const left = baseLeft + (Math.random() * padding * 2 - padding);
          const top = baseTop + (Math.random() * padding * 2 - padding);
          const rotation = (Math.random() * maxRotation * 2) - maxRotation;
          
          const newPos = { left, top, rotation, width: itemWidth, height: itemHeight };
          
          const overlaps = positions.some(pos => {
            return checkOverlap(
              { x: pos.left, y: pos.top, width: pos.width, height: pos.height },
              { x: left, y: top, width: itemWidth, height: itemHeight }
            );
          });
          
          if (!overlaps || positions.length === 0) {
            positions.push(newPos);
            placed = true;
          }
          
          attempts++;
        }
        
        if (!placed) {
          const col = i % actualColumns;
          const row = Math.floor(i / actualColumns);
          positions.push({
            left: col * (baseWidth + padding * 2),
            top: row * (baseHeight + padding * 2),
            rotation: 0,
            width: itemWidth,
            height: itemHeight
          });
        }
      }
      
      return positions;
    }
    
    // Verifica sobreposição entre dois retângulos
    function checkOverlap(rect1, rect2) {
      const padding = 25; // Espaço mínimo entre elementos
      
      const r1 = {
        left: rect1.x - padding,
        right: rect1.x + rect1.width + padding,
        top: rect1.y - padding,
        bottom: rect1.y + rect1.height + padding
      };
      
      const r2 = {
        left: rect2.x - padding,
        right: rect2.x + rect2.width + padding,
        top: rect2.y - padding,
        bottom: rect2.y + rect2.height + padding
      };
      
      return !(r1.right < r2.left || 
               r1.left > r2.right || 
               r1.bottom < r2.top || 
               r1.top > r2.bottom);
    }
    
    function closePopup() {
      const popup = document.getElementById('project-popup');
      if (!popup) return;
      
      popup.classList.remove('active');
      document.body.style.overflow = '';
      
      const videos = popup.querySelectorAll('video');
      videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
      });
      
      closeLightbox();
    }
    
    // ===== LIGHTBOX FULLSCREEN COM NAVEGAÇÃO =====
    
    let currentLightboxIndex = 0;
    let lightboxMediaItems = [];
    
    function openLightbox(mediaItem, type, allMedia = null, startIndex = 0) {
      // Se receber array de media, guardar para navegação
      if (allMedia && Array.isArray(allMedia)) {
        lightboxMediaItems = allMedia;
        currentLightboxIndex = startIndex;
      } else {
        // Modo single image
        lightboxMediaItems = [{ item: mediaItem, type: type }];
        currentLightboxIndex = 0;
      }
      
      let lightbox = document.querySelector('.lightbox');
      
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const content = document.createElement('div');
        content.className = 'lightbox-content';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        `;
        closeBtn.onclick = closeLightbox;
        
        // Navigation arrows
        const prevBtn = document.createElement('div');
        prevBtn.className = 'lightbox-nav lightbox-prev';
        prevBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </svg>
        `;
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          navigateLightbox(-1);
        };
        
        const nextBtn = document.createElement('div');
        nextBtn.className = 'lightbox-nav lightbox-next';
        nextBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        `;
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          navigateLightbox(1);
        };
        
        // Counter
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        
        lightbox.appendChild(content);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(counter);
        
        lightbox.onclick = (e) => {
          if (e.target === lightbox) closeLightbox();
        };
        
        document.body.appendChild(lightbox);
      }
      
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Adicionar hover effect ao cursor para elementos do lightbox
      if (window.addCursorHoverEffect) {
        setTimeout(() => {
          window.addCursorHoverEffect('.lightbox-close');
          window.addCursorHoverEffect('.lightbox-nav');
        }, 0);
      }
    }
    
    function updateLightboxContent() {
      const lightbox = document.querySelector('.lightbox');
      if (!lightbox) return;
      
      const content = lightbox.querySelector('.lightbox-content');
      const counter = lightbox.querySelector('.lightbox-counter');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      
      content.innerHTML = '';
      
      const current = lightboxMediaItems[currentLightboxIndex];
      
      if (current.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.src = current.item.src;
        content.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = current.item.src;
        img.alt = 'Fullscreen image';
        content.appendChild(img);
      }
      
      // Update counter
      if (lightboxMediaItems.length > 1) {
        counter.textContent = `${currentLightboxIndex + 1} / ${lightboxMediaItems.length}`;
        counter.style.display = 'block';
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      } else {
        counter.style.display = 'none';
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
      }
    }
    
    function navigateLightbox(direction) {
      const newIndex = (currentLightboxIndex + direction + lightboxMediaItems.length) % lightboxMediaItems.length;
      currentLightboxIndex = newIndex;
      updateLightboxContent();
    }
    
    function closeLightbox() {
      const lightbox = document.querySelector('.lightbox');
      if (lightbox) {
        lightbox.classList.remove('active');
        
        // Só restaurar overflow se o popup também estiver fechado
        const popup = document.getElementById('project-popup');
        if (!popup || !popup.classList.contains('active')) {
          document.body.style.overflow = '';
        }
        
        const videos = lightbox.querySelectorAll('video');
        videos.forEach(video => {
          video.pause();
          video.currentTime = 0;
        });
      }
      
      // Reset lightbox state
      lightboxMediaItems = [];
      currentLightboxIndex = 0;
    }
    
    // ===== ANIMAÇÃO DE PARTÍCULAS =====
    
    function setupParticlesAnimation() {
      const canvas = document.getElementById('particles-canvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.5 - 0.25;
          this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      const particles = [];
      const particleCount = 70;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const particle of particles) {
          particle.update();
          particle.draw();
        }
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
    
    // ===== INICIALIZAÇÃO =====
    
    function init() {
      setupSmoothScroll();
      setupPortfolioAnimation();
      setupNameAnimation();
      setupEmailCopy();
      setupCustomCursor();
      setupScrollEffects();
      setupAboutImageRotation();
      setupAboutTextReveal();
      setupProjectCardsReveal();
      setupProjectSystem();
      setupParticlesAnimation();
      
      window.testOpenPopup = function(index) {
        openPopup(index);
      };
    }
    
    init();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
  
  // Mobile name display
  (function(){
    const nameLink = document.getElementById('nameLink');
    const extra = document.getElementById('additionalLetters');
  
    if(!nameLink || !extra) return;
  
    const isTouch = window.matchMedia('(hover: none)').matches;
  
    if(!isTouch){
      nameLink.firstChild.nodeValue = 'GUI';
      extra.textContent = '';
      return;
    }
  
    nameLink.firstChild.nodeValue = 'GUIL';
    extra.textContent = 'HERME';
  })();