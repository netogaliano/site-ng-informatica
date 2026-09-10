document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Checagem global de acessibilidade para sensibilidade a movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Efeito Máquina de Escrever (Acessível + textContent)
    const logoText = "Assistência Técnica";
    const logoElement = document.getElementById("logo-text");
    let index = 0;

    if (logoElement) {
        if (prefersReducedMotion) {
            // Entrega o texto completo imediatamente sem animação para quem precisa de movimento reduzido
            logoElement.textContent = logoText;
        } else {
            function typeWriter() {
                if (index < logoText.length) {
                    logoElement.textContent += logoText.charAt(index);
                    index++;
                    setTimeout(typeWriter, 80);
                }
            }
            setTimeout(typeWriter, 300);
        }
    }

    // 2. Menu Mobile com Trava de Scroll no Body, ARIA e Click Outside
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu') || document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function closeMenu() {
        if (!hamburger || !navMenu) return;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        hamburger.setAttribute('aria-expanded', String(isActive));
        hamburger.setAttribute(
            'aria-label', 
            isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
        );
        
        document.body.classList.toggle('menu-open', isActive);
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Fecha o menu ao selecionar qualquer item de navegação
        navLinks.forEach(link => link.addEventListener('click', closeMenu));

        // Fecha a gaveta mobile ao tocar no fundo da tela (Click Outside)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Fecha com a tecla ESC e devolve o foco ao botão (Critério WCAG 2.1)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                hamburger.focus();
            }
        });
    }

    // 3. Animações de Entrada (Intersection Observer Otimizado)
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);

                    // 1300ms de tolerância para cobrir integralmente a transição mobile de 1200ms
                    setTimeout(() => {
                        entry.target.classList.remove('animate-on-scroll', 'is-visible');
                        entry.target.style.transitionDelay = '0ms';
                    }, 1300);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    } else {
        // Fallback progressivo: exibe os cards imediatamente sem transição
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('animate-on-scroll');
        });
    }
});