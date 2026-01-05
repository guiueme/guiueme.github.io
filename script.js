document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVEGAÇÃO E INTERAÇÃO BÁSICA =====
    
    // Scroll suave ao clicar nos links
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
    
    // Animação para a palavra "portfolio"
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
    
    // Animação do nome
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
    
    // Função para copiar email para o clipboard
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
    
    // ===== CURSOR PERSONALIZADO =====
    
    function setupCustomCursor() {
      const cursor = document.querySelector('.cursor');
      if (!cursor) return;
      
      const links = document.querySelectorAll('a');
      const projectTypes = document.querySelectorAll('.project-type');
      
      function onMouseMove(e) {
        const rect = cursor.getBoundingClientRect();
        const cursorX = e.clientX - rect.width / 2;
        const cursorY = e.clientY - rect.height / 2;
        
        if (e.target.closest('section')) {
          cursor.style.display = 'block';
          cursor.style.top = cursorY + 'px';
          cursor.style.left = cursorX + 'px';
        } else {
          cursor.style.display = 'none';
        }
      }
      
      function onMouseEnterLink() {
        cursor.classList.add('hovered');
      }
      
      function onMouseLeaveLink() {
        cursor.classList.remove('hovered');
      }
      
      document.body.addEventListener('mousemove', onMouseMove);
      
      links.forEach(link => {
        link.addEventListener('mouseenter', onMouseEnterLink);
        link.addEventListener('mouseleave', onMouseLeaveLink);
      });
      
      projectTypes.forEach(type => {
        type.addEventListener('mouseenter', onMouseEnterLink);
        type.addEventListener('mouseleave', onMouseLeaveLink);
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
    
    // ===== SISTEMA DE PROJETOS E POPUP =====
    
    // Definição dos projetos
    const projects = [
      {
        title: "166studio",
        description: "I created an innovative website for a studio composed of an animator and an illustrator, inspired by Portuguese architecture. The website design simulates a building, standing out through the use of traditional Portuguese tiles, which add an authentic and cultural touch.",
        images: [
          "./imagens/Screenshot 2024-07-03 at 13.41.51.png"
        ],
        tags: ["Web Design", "UI/UX", "Development"],
        links: [
          { text: "Website", url: "https://166studio.netlify.app/" }
        ]
      },
      {
        title: "Olha, Vê, Repara (Look, See, Notice)",
        description: "Olha, Vê, Repara is a conceptual design project created for a university course. It simulates a multi-day interactive art event where visitors uncover hidden messages in artworks. The project includes branding, visual identity, and the design of a visitor kit. Inspired by José Saramago's quote, If you can look, see. If you can see, notice, the design encourages deep observation and discovery.",
        images: [
          "./imagens/mockup-cartaz.jpg",
          "./imagens/mockup-saco.jpg",
          "./imagens/mockup-notebook.jpg"
        ],
        tags: ["Graphic design", "Event design", "Branding"],
        links: [
          
          
        ]
      },
      {
        title: "Rubik's Cube",
        description: "This project demonstrates the use of augmented reality (AR) technology applied to a poster design featuring a Rubik's Cube. By scanning a QR code and pointing at the poster, viewers activate an animation with the message, In every problem, there is a solution. This project combines graphic design and AR to create an engaging interactive experience, encouraging viewers to reflect on problem-solving in a creative way.",
        images: [
          "./imagens/Imprimir cartaz-01.jpg"
        ],
        video: [
          "./imagens/Animação_RubixCube_GuilhermeAlves3210202.mp4"
        ],
        tags: ["Augmented Reality", "Motion Graphics"],
        links: [
          
        ]
      },
      {
        title: "Predictorfy's ReDesign",
        description: "Predictorfy is a platform that predicts football team lineups. I was in charge of a full website redesign, focusing on making it more intuitive, visually appealing, and easier to use.The new look comes in both light and dark mode, so users can choose what works best for them. I restructured the main pages to highlight predictions, team comparisons, and key stats. All laid out in a clean, accessible way. The end result is a more modern, functional site that balances a tech-savvy vibe with the energy of the football world.",
  
  
        images: [
          "./imagens/Screenshot 2025-04-11 at 12.16.34.png",
          "./imagens/Screenshot 2025-04-11 at 12.17.08.png",
          
        ],
        tags: ["Web Design", "ReDesign", "Development"],
        links: [
          { text: "Website", url: "https://predictorfy.com/" }
          
        ]
      },
    ];
    
    function setupProjectSystem() {
      // Configurar hover das imagens
      setupProjectImageHover();
      
      // Configurar eventos de clique para os projetos
      const projectItems = document.querySelectorAll('.title-list h3');
      projectItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
          event.preventDefault();
          openPopup(index);
        });
      });
      
      // Configurar evento para fechar o popup
      const closeButton = document.getElementById('popup-close');
      if (closeButton) {
        closeButton.addEventListener('click', closePopup);
      }
      
      // Fechar o popup ao clicar fora do conteúdo
      const popupOverlay = document.querySelector('.popup-overlay');
      if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
      }
      
      // Configurar botões de navegação da galeria
      const prevButton = document.getElementById('gallery-prev');
      const nextButton = document.getElementById('gallery-next');
      
      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
          const slides = document.querySelectorAll('#gallery-container .gallery-slide');
          const activeSlide = document.querySelector('#gallery-container .gallery-slide.active');
          if (!activeSlide || slides.length <= 1) return;
          
          const currentIndex = Array.from(slides).indexOf(activeSlide);
          const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(prevIndex);
        });
        
        nextButton.addEventListener('click', () => {
          const slides = document.querySelectorAll('#gallery-container .gallery-slide');
          const activeSlide = document.querySelector('#gallery-container .gallery-slide.active');
          if (!activeSlide || slides.length <= 1) return;
          
          const currentIndex = Array.from(slides).indexOf(activeSlide);
          const nextIndex = (currentIndex + 1) % slides.length;
          showSlide(nextIndex);
        });
      }
    }
    
    // Função para configurar o hover das imagens
    function setupProjectImageHover() {
      const projectLinks = document.querySelectorAll('.project-link');
      const projectTypes = document.querySelectorAll('.project-type');
      const projectTitles = document.querySelectorAll('.title-list h3');
      const projectImages = document.querySelectorAll('.image-list img');
      
      if (projectImages.length === 0) return;
      
      // Mostrar a primeira imagem por padrão
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
    
    // Funções para manipular o popup
    function openPopup(index) {
      if (index < 0 || index >= projects.length) return;
      
      const project = projects[index];
      const popup = document.getElementById('project-popup');
      const popupTitle = document.getElementById('popup-title');
      const popupDescription = document.getElementById('popup-description');
      const tagsContainer = document.getElementById('popup-tags');
      const linksContainer = document.getElementById('popup-links');
      const galleryContainer = document.getElementById('gallery-container');
      const dotsContainer = document.getElementById('gallery-dots');
      
      if (!popup || !popupTitle || !popupDescription || !tagsContainer || 
          !linksContainer || !galleryContainer || !dotsContainer) return;
      
      // Preencher o conteúdo
      popupTitle.textContent = project.title;
      popupDescription.textContent = project.description;
      
      // Preencher as tags
      tagsContainer.innerHTML = '';
      project.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'popup-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
      
      // Preencher os links
      linksContainer.innerHTML = '';
      project.links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.className = 'popup-link';
        linkElement.href = link.url;
        linkElement.textContent = link.text;
        linkElement.target = '_blank';
        linksContainer.appendChild(linkElement);
      });
      
      const normalizeMedia = value => {
        if (!value && value !== 0) return [];
        const sourceArray = Array.isArray(value) ? value : [value];
        return sourceArray.filter(Boolean);
      };
      
      const imageSources = normalizeMedia(project.images);
      const videoSources = [
        ...normalizeMedia(project.video),
        ...normalizeMedia(project.videos)
      ];
      
      const mediaItems = [
        ...imageSources.map(src => ({ type: 'image', src })),
        ...videoSources.map(src => ({ type: 'video', src }))
      ];
      
      // Mostrar o popup imediatamente
      popup.classList.add('active');
      
      // Preencher a galeria de forma assíncrona para exibir o popup primeiro
      galleryContainer.innerHTML = '';
      const controlsWrapper = document.querySelector('.gallery-controls');
      
      const renderGallery = () => {
        if (mediaItems.length === 0) {
          const emptyMessage = document.createElement('div');
          emptyMessage.className = 'gallery-empty';
          emptyMessage.textContent = 'No media available for this project.';
          galleryContainer.appendChild(emptyMessage);
          if (dotsContainer) dotsContainer.style.display = 'none';
          if (controlsWrapper) controlsWrapper.style.display = 'none';
          return;
        }
        
        const firstProjectImage = imageSources[0] || '';
        
        const createSlide = (item, index, isActive = false) => {
          const slide = document.createElement('div');
          slide.className = `gallery-slide${isActive ? ' active' : ''}`;
          
          if (item.type === 'video') {
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.preload = 'none';
            videoElement.playsInline = true;
            videoElement.muted = true;
            videoElement.style.width = '100%';
            videoElement.style.borderRadius = '10px';
            videoElement.style.pointerEvents = 'auto';
            videoElement.style.zIndex = '2';
            if (firstProjectImage) {
              videoElement.poster = firstProjectImage;
            }
            
            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/mp4';
            videoElement.appendChild(source);
            videoElement.addEventListener('ended', () => {
              videoElement.currentTime = 0;
              const playPromise = videoElement.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
              }
            });
            
            slide.appendChild(videoElement);
            
            if (isActive) {
              setTimeout(() => {
                const playPromise = videoElement.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                  playPromise.catch(() => {});
                }
              }, 0);
            }
          } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `${project.title} - Imagem ${index + 1}`;
            img.loading = isActive ? 'eager' : 'lazy';
            slide.appendChild(img);
          }
          
          galleryContainer.appendChild(slide);
        };
        
        // Renderizar rapidamente o primeiro item
        createSlide(mediaItems[0], 0, true);
        showSlide(0);
        
        // Renderizar o restante sem bloquear o popup
        const remainingItems = mediaItems.slice(1);
        if (remainingItems.length) {
          const appendRemaining = () => {
            remainingItems.forEach((item, idx) => {
              setTimeout(() => createSlide(item, idx + 1), 0);
            });
          };
          appendRemaining();
        }
        
        // Preencher os pontos da galeria
        dotsContainer.innerHTML = '';
        if (mediaItems.length > 1) {
          mediaItems.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => showSlide(i);
            dotsContainer.appendChild(dot);
          });
          if (dotsContainer) {
            dotsContainer.style.display = '';
          }
          if (controlsWrapper) {
            controlsWrapper.style.display = 'flex';
          }
        } else {
          if (dotsContainer) {
            dotsContainer.style.display = 'none';
          }
          if (controlsWrapper) {
            controlsWrapper.style.display = 'none';
          }
        }
      };
      
      requestAnimationFrame(renderGallery);
    }
    
    function showSlide(index) {
      const slides = document.querySelectorAll('#gallery-container .gallery-slide');
      const dots = document.querySelectorAll('.gallery-dot');
      
      if (slides.length === 0) return;
      
      const normalizedIndex = ((index % slides.length) + slides.length) % slides.length;
      
      slides.forEach((slide, i) => {
        const isActive = i === normalizedIndex;
        slide.classList.toggle('active', isActive);
        slide.querySelectorAll('video').forEach(video => {
          if (isActive) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      });
      
      dots.forEach((dot, i) => {
        dot.className = `gallery-dot ${i === normalizedIndex ? 'active' : ''}`;
      });
    }
    
    function closePopup() {
      const popup = document.getElementById('project-popup');
      if (!popup) return;
      
      popup.classList.remove('active');
      
      const videos = popup.querySelectorAll('video');
      videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
      });
    }
    
    // ===== ANIMAÇÃO DE PARTÍCULAS =====
    
    function setupParticlesAnimation() {
      const canvas = document.getElementById('particles-canvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Configurar o tamanho do canvas para preencher a tela
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Classe para as partículas
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
          
          // Fazer as partículas voltarem quando saírem da tela
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
          // Usar uma cor branca com opacidade variável
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Criar um array de partículas
      const particles = [];
      const particleCount = 70;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      // Função de animação
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const particle of particles) {
          particle.update();
          particle.draw();
        }
        
        requestAnimationFrame(animate);
      }
      
      // Iniciar a animação
      animate();
    }
    
    // ===== INICIALIZAÇÃO =====
    
    // Inicializar todas as funcionalidades
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
      
      // Adicionar função de teste para abrir o popup diretamente
      window.testOpenPopup = function(index) {
        openPopup(index);
      };
    }
    
    // Iniciar a aplicação
    init();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
  
  (function(){
    const nameLink = document.getElementById('nameLink');
    const extra = document.getElementById('additionalLetters');
  
    if(!nameLink || !extra) return;
  
    const isTouch = window.matchMedia('(hover: none)').matches;
  
    // DESKTOP (tem hover): mantém animação que já tens (GUI -> +LHERME no hover)
    if(!isTouch){
      // garante estado inicial do desktop (GUI)
      nameLink.firstChild.nodeValue = 'GUI';
      extra.textContent = ''; // letras vão ser escritas no hover pelo teu código atual
      return;
    }
  
    // MOBILE (sem hover): mostra logo GUILHERME e não anima
    nameLink.firstChild.nodeValue = 'GUIL';
    extra.textContent = 'HERME';
  })();
  
  
  
  
  
  
  
  
