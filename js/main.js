// ============================================
// TEMA CLARO/OSCURO
// ============================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Cambiar tema al hacer clic
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// ============================================
// MENÚ HAMBURGUESA
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    // Abrir/cerrar menú
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const links = navLinks.querySelectorAll('a:not(.dropdown-btn)');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Cerrar también cualquier dropdown abierto
            const openDropdowns = document.querySelectorAll('.dropdown.open');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        });
    });
    
    // Cerrar menú al hacer clic fuera (para móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInside = navLinks.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInside && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// ============================================
// DROPDOWN EN MÓVIL
// ============================================
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('open');
            }
        });
    }
});

// Cerrar dropdowns al hacer clic fuera (para móvil)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }
});

// ============================================
// BOTONES DE COPIAR
// ============================================
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const codeToCopy = btn.getAttribute('data-code');
        if (codeToCopy) {
            try {
                await navigator.clipboard.writeText(codeToCopy);
                
                // Guardar texto original
                const originalText = btn.innerHTML;
                const originalIcon = btn.querySelector('i')?.className;
                
                // Mostrar feedback
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                btn.style.background = 'var(--success)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--success)';
                
                // Restaurar después de 2 segundos
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
                btn.innerHTML = '<i class="fas fa-times"></i> Error';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                }, 2000);
            }
        }
    });
});

// ============================================
// ANIMACIÓN DE ENLACES INTERNOS (scroll suave)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INICIALIZAR LEMON SQUEEZY
// ============================================
if (window.LemonSqueezy) {
    window.LemonSqueezy.Buttons.init();
}

// ============================================
// DETECTAR CAMBIO DE TAMAÑO DE PANTALLA
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Si la pantalla se agranda, cerrar menú móvil si está abierto
        if (window.innerWidth > 768) {
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            // Cerrar todos los dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    }, 250);
});

// ============================================
// CARGAR IMÁGENES CON LAZY LOAD (si hay imágenes)
// ============================================
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// PREVENIR ZOOM EXCESIVO EN INPUTS (móvil)
// ============================================
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('touchstart', () => {
        if (window.innerWidth <= 768) {
            input.style.fontSize = '16px';
        }
    });
});

console.log('Flowmatic — Página cargada correctamente');
