document.addEventListener('DOMContentLoaded', () => {
    // 1. Efeito Máquina de Escrever (Otimizado para Acessibilidade)
    const logoText = "Assistência Técnica";
    const logoElement = document.getElementById("logo-text");
    let index = 0;

    function typeWriter() {
        if (index < logoText.length) {
            logoElement.innerHTML += logoText.charAt(index);
            index++;
            setTimeout(typeWriter, 80);
        }
    }

    // Inicia a digitação após um breve atraso
    setTimeout(typeWriter, 300);

    // 2. Menu Mobile e Acessibilidade (ARIA)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Atualiza o estado do menu para os leitores de tela
        hamburger.setAttribute('aria-expanded', isActive);
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // 3. Suporte ao teclado avançado (WCAG)
    // Fecha o menu mobile se o usuário pressionar a tecla "ESC"
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus(); // Devolve o foco ao botão
        }
    });

    // 4. Animação ao Rolar a Tela (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe visual para fazer o elemento surgir
                entry.target.classList.add('is-visible');
                
                // Reduz o processamento desobservando o elemento após a animação iniciar
                observer.unobserve(entry.target);
                
                // 🔥 TRUQUE SÊNIOR: Limpeza pós-animação
                // Espera 1 segundo (tempo do fade terminar) e limpa as classes e atrasos.
                // Isso devolve a fluidez instantânea para os efeitos de "hover" do rato!
                setTimeout(() => {
                    entry.target.classList.remove('animate-on-scroll', 'is-visible');
                    entry.target.style.transitionDelay = '0ms';
                }, 1000); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});