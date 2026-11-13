/* ============================================
   LH.VIP - RELAÇÕES DIGITAIS
   Scripts Principais
   Versão: 2.0
   ============================================ */

'use strict';

// ==========================================
// INICIALIZAÇÃO PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializa todos os módulos
    initHeader();
    initMobileMenu();
    initNumberAnimation();
    initSmoothScroll();
    initDiagnosticForm();
    initScrollReveal();
    initActiveNavLink();
    initCurrentYear();
    initParallaxEffect();
    initConsoleMessage();
    
});

// ==========================================
// 1. HEADER SCROLL EFFECT
// ==========================================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Adiciona/remove classe scrolled
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Efeito de hide/show no scroll (some quando desce, aparece quando sobe)
        if (scrollY > 300) {
            if (scrollY > lastScrollY) {
                // Scroll para baixo - esconde
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll para cima - mostra
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    // Verifica estado inicial
    updateHeader();
}

// ==========================================
// 2. MENU MOBILE
// ==========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Cria overlay do menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);
    
    // Função para abrir menu
    function openMenu() {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('no-scroll');
        
        // Animação do ícone hambúrguer
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scaleX(0)';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        
        // Acessibilidade
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    // Função para fechar menu
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
        
        // Reseta animação do ícone
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scaleX(1)';
        spans[2].style.transform = 'none';
        
        // Acessibilidade
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fecha menu ao clicar no overlay
    overlay.addEventListener('click', closeMenu);
    
    // Fecha menu ao clicar em um link do menu
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Fecha menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            menuToggle.focus(); // Retorna foco ao botão
        }
    });
    
    // Previne scroll no body quando menu aberto (touch)
    document.addEventListener('touchmove', function(e) {
        if (body.classList.contains('no-scroll')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ==========================================
// 3. ANIMAÇÃO DOS NÚMEROS (CONTADOR)
// ==========================================
function initNumberAnimation() {
    const numbersSection = document.querySelector('.numbers');
    const numberElements = document.querySelectorAll('.number h2');
    let animated = false;
    
    function animateNumbers() {
        if (animated) return;
        
        const sectionTop = numbersSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Gatilho quando a seção está 80% visível
        if (sectionTop < windowHeight * 0.8) {
            animated = true;
            
            numberElements.forEach(number => {
                const target = number.textContent;
                const isPercentage = target.includes('%');
                const hasPlus = target.includes('+');
                const finalValue = parseInt(target.replace(/[^0-9]/g, ''));
                
                let startValue = 0;
                const duration = 1800; // 1.8 segundos
                const startTime = performance.now();
                
                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing easeOutExpo para efeito mais natural
                    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentValue = Math.floor(easeOut * finalValue);
                    
                    // Formata o número
                    if (isPercentage) {
                        number.textContent = currentValue + '%';
                    } else if (hasPlus) {
                        number.textContent = currentValue + '+';
                    } else {
                        number.textContent = currentValue;
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        // Garante valor final exato
                        number.textContent = target;
                        
                        // Efeito de pulso ao finalizar
                        number.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            number.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
                
                // Delay inicial para cada número
                setTimeout(() => {
                    requestAnimationFrame(update);
                }, Array.from(numberElements).indexOf(number) * 200);
            });
        }
    }
    
    // Throttle para performance
    let throttleTimer;
    window.addEventListener('scroll', function() {
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                animateNumbers();
                throttleTimer = null;
            }, 100);
        }
    }, { passive: true });
    
    // Verifica se já está visível ao carregar
    setTimeout(animateNumbers, 300);
}

// ==========================================
// 4. SCROLL SUAVE PARA LINKS INTERNOS
// ==========================================
function initSmoothScroll() {
    const header = document.querySelector('.header');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignora links vazios
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcula posição considerando header fixo
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
                
                // Scroll suave nativo com fallback
                try {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    // Fallback para navegadores antigos
                    window.scrollTo(0, targetPosition);
                }
                
                // Foca no elemento após scroll (acessibilidade)
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }, 500);
            }
        });
    });
}

// ==========================================
// 5. FORMULÁRIO DE DIAGNÓSTICO
// ==========================================
function initDiagnosticForm() {
    const formDiagnostico = document.getElementById('form-diagnostico');
    
    if (!formDiagnostico) return;
    
    const nomeInput = formDiagnostico.querySelector('input[placeholder="Seu nome"]');
    const whatsappInput = formDiagnostico.querySelector('input[placeholder="WhatsApp com DDD"]');
    const empresaInput = formDiagnostico.querySelector('input[placeholder="Nome da empresa"]');
    const submitBtn = formDiagnostico.querySelector('button[type="submit"]');
    
    // Máscara simples para WhatsApp
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Formata como (XX) XXXXX-XXXX
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > 10) {
                value = `${value.substring(0, 10)}-${value.substring(10)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Validação e envio
    formDiagnostico.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = nomeInput ? nomeInput.value.trim() : '';
        const whatsapp = whatsappInput ? whatsappInput.value.replace(/\D/g, '') : '';
        const empresa = empresaInput ? empresaInput.value.trim() : '';
        
        // Validação
        let hasError = false;
        
        // Limpa erros anteriores
        clearErrors();
        
        if (!nome || nome.length < 3) {
            showError(nomeInput, 'Nome é obrigatório (mínimo 3 caracteres)');
            hasError = true;
        }
        
        if (!whatsapp || whatsapp.length < 10) {
            showError(whatsappInput, 'WhatsApp inválido. Use DDD + número');
            hasError = true;
        }
        
        if (!empresa || empresa.length < 2) {
            showError(empresaInput, 'Nome da empresa é obrigatório');
            hasError = true;
        }
        
        if (hasError) {
            // Foca no primeiro campo com erro
            const firstError = formDiagnostico.querySelector('.input-error');
            if (firstError) firstError.focus();
            return;
        }
        
        // Loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Preparando...';
        submitBtn.style.cursor = 'wait';
        
        // Monta mensagem para WhatsApp
        const dataHora = new Date().toLocaleString('pt-BR');
        const mensagem = encodeURIComponent(
            `👋 *NOVO LEAD - LH.VIP*\n\n` +
            `📋 *Solicitação de Diagnóstico*\n\n` +
            `👤 *Nome:* ${nome}\n` +
            `🏢 *Empresa:* ${empresa}\n` +
            `📱 *WhatsApp:* ${whatsapp}\n` +
            `🕐 *Data/Hora:* ${dataHora}\n\n` +
            `_Lead captado pelo site LH.VIP_`
        );
        
        const numeroWhatsApp = '5585991298846'; // ← APENAS O NÚMERO
const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
        // Feedback de sucesso após um pequeno atraso
        setTimeout(() => {
            submitBtn.textContent = '✅ Redirecionando...';
            submitBtn.style.background = '#25D366';
            submitBtn.style.color = '#fff';

            // Limpa formulário
            formDiagnostico.reset();

            // Redireciona para o WhatsApp
            window.location.href = urlWhatsApp;

            // Reseta botão após 2 segundos
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.style.cursor = '';
            }, 2000);

            // Evento de conversão (Google Analytics / Facebook Pixel)
            trackConversion('diagnostico', nome, empresa);
        }, 800);
    });
    
    // Funções auxiliares de validação
    function showError(input, message) {
        if (!input) return;
        
        input.classList.add('input-error');
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
        
        // Cria mensagem de erro
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        errorSpan.style.cssText = `
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 4px;
            display: block;
            text-align: left;
            padding-left: 16px;
        `;
        
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    
    function clearErrors() {
        formDiagnostico.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
            el.style.borderColor = '';
            el.style.boxShadow = '';
        });
        
        formDiagnostico.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }
    
    // Limpa erros ao digitar
    formDiagnostico.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('input-error')) {
                this.classList.remove('input-error');
                this.style.borderColor = '';
                this.style.boxShadow = '';
                
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    });
}

// ==========================================
// 6. REVELAR ELEMENTOS AO SCROLL
// ==========================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Delay progressivo para cards
                if (entry.target.classList.contains('card')) {
                    const cards = Array.from(document.querySelectorAll('.card'));
                    const index = cards.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                // Delay para cases
                if (entry.target.classList.contains('case-column')) {
                    const cases = Array.from(document.querySelectorAll('.case-column'));
                    const index = cases.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.15}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos a serem animados
    const elementosAnimaveis = document.querySelectorAll([
        '.card',
        '.case-column',
        '.service-box',
        '.diagnostico-box',
        '.number',
        '[data-animate]'
    ].join(', '));
    
    elementosAnimaveis.forEach(el => {
        // Estado inicial
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        observer.observe(el);
    });
    
    // Fallback para navegadores sem IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        elementosAnimaveis.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
}

// ==========================================
// 7. LINK ATIVO NA NAVEGAÇÃO
// ==========================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    
    // Throttle para performance
    let throttleTimer;
    window.addEventListener('scroll', function() {
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                updateActiveLink();
                throttleTimer = null;
            }, 150);
        }
    }, { passive: true });
    
    // Adiciona estilo para link ativo
    const style = document.createElement('style');
    style.textContent = `
        .active-link {
            color: var(--brand-pink) !important;
        }
        .active-link::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 8. ANO ATUAL DINÂMICO NO FOOTER
// ==========================================
function initCurrentYear() {
    const footerBottom = document.querySelector('.footer-bottom p');
    
    if (footerBottom) {
        const currentYear = new Date().getFullYear();
        
        // Substitui qualquer ano por 2025 pelo ano atual
        footerBottom.innerHTML = footerBottom.innerHTML.replace(/2025/g, currentYear);
        
        // Se não encontrar 2025, adiciona o ano
        if (!footerBottom.textContent.includes(currentYear)) {
            footerBottom.textContent = `© ${currentYear} LH.VIP Relações Digitais. Todos os direitos reservados.`;
        }
    }
}

// ==========================================
// 9. EFEITO PARALLAX NO HERO
// ==========================================
function initParallaxEffect() {
    const heroMockup = document.querySelector('.hero-mockup');
    const heroSection = document.querySelector('.hero');
    
    if (!heroMockup || !heroSection) return;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        // Só aplica parallax enquanto o hero está visível
        if (scrollY < heroHeight) {
            const speed = 0.05;
            const yOffset = scrollY * speed;
            heroMockup.style.transform = `translateY(${yOffset}px)`;
        }
    }
    
    // Throttle
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ==========================================
// 10. CONSOLE MESSAGE (EASTER EGG)
// ==========================================
function initConsoleMessage() {
    const styles = {
        title: 'color: #ff2d78; font-size: 24px; font-weight: 900; letter-spacing: -1px;',
        subtitle: 'color: #f5c542; font-size: 14px; font-weight: bold;',
        body: 'color: #fff; font-size: 12px;',
        link: 'color: #00d2ff; font-size: 12px; text-decoration: underline;',
        warning: 'color: #ff2d78; font-size: 11px; font-style: italic;'
    };
    
    console.log(
        `%c🚀 LH.VIP %c| Relações Digitais`, 
        styles.title,
        'color: #fff; font-size: 16px; font-weight: bold;'
    );
    
    console.log(
        `%c⚡ Tecnologia. Estratégia. Inteligência Artificial.`,
        styles.subtitle
    );
    
    console.log(
        `%cTudo conectado para acelerar empresas que desejam crescer de forma consistente.`,
        styles.body
    );
    
    console.log(
        `%c💡 Interessado em um diagnóstico gratuito? Fale conosco!`,
        styles.link
    );
    
    console.log(
        `%c🔧 Desenvolvido por LH.VIP | © ${new Date().getFullYear()}`,
        styles.warning
    );
    
    // Easter egg: comando secreto
    window.lhvip = function() {
        console.log('%c🎯 Modo Thuth ativado!', 'color: #ff2d78; font-size: 18px; font-weight: bold;');
        console.log('%c"Layout pronto, preço na ponta da língua, contrato no bolso e pé na porta do comércio."', 'color: #f5c542; font-size: 13px; font-style: italic;');
        console.log('%c🦾 Bora faturar!', 'color: #00d2ff; font-size: 14px;');
    };
}

// ==========================================
// FUNÇÃO DE TRACKING (GOOGLE ANALYTICS / FB PIXEL)
// ==========================================
function trackConversion(eventType, name, company) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            event_category: 'Diagnóstico',
            event_label: eventType,
            value: 1,
            user_name: name,
            company_name: company
        });
    }
    
    // Facebook Pixel
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
            content_name: 'Diagnóstico LH.VIP',
            content_category: eventType,
            user_name: name,
            company_name: company
        });
    }
    
    // Console log para debug
    console.log(
        `%c📊 Conversão registrada: ${eventType}%c | ${name} - ${company}`,
        'color: #25D366; font-weight: bold;',
        'color: #fff;'
    );
}

// ==========================================
// UTILITÁRIOS GLOBAIS
// ==========================================

// Debounce para eventos de resize/scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para eventos de alta frequência
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Verifica se elemento está visível na viewport
function isElementInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Detecta dispositivo mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detecta touch screen
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

// Adiciona classe no body para dispositivos touch
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ==========================================
// MONITORAMENTO DE PERFORMANCE
// ==========================================
window.addEventListener('load', function() {
    // Marca tempo de carregamento
    const loadTime = performance.now();
    
    if (loadTime > 3000) {
        console.warn('⚠️ Tempo de carregamento alto:', Math.round(loadTime), 'ms');
    }
    
    // Remove loading screen se existir
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
});

// ==========================================
// EXPORTA MÓDULOS (se usar ES Modules)
// ==========================================
// export {
//     initHeader,
//     initMobileMenu,
//     initNumberAnimation,
//     initSmoothScroll,
//     initDiagnosticForm,
//     initScrollReveal,
//     initActiveNavLink,
//     initCurrentYear,
//     initParallaxEffect
// };