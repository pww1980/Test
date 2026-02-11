/* ======================================
   MÄNNERTRÄNEN.DE - PUNK INTERACTIONS
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- RANDOM ROTATION on product cards ---
    document.querySelectorAll('.product-card').forEach(card => {
        const rot = (Math.random() - 0.5) * 4;
        card.style.setProperty('--card-rot', `${rot}deg`);
    });

    // --- SCROLL REVEAL for sections ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .review-card, .zine-page').forEach(el => {
        el.style.opacity = '0';
        el.style.transform += ' translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .product-card.visible, .review-card.visible, .zine-page.visible {
            opacity: 1 !important;
            transform: rotate(var(--card-rot, 0deg)) translateY(0) !important;
        }
        .review-card.visible {
            transform: rotate(var(--review-rot, 0deg)) translateY(0) !important;
        }
        .zine-page.visible {
            transform: rotate(-1deg) translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- CART COUNTER ---
    let cartCount = 0;
    const cartBadge = document.createElement('div');
    cartBadge.id = 'cart-badge';
    cartBadge.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Rubik Mono One', monospace;
        font-size: 1rem;
        background: #ff2d7b;
        color: #f5f0e8;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #e6ff00;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: scale(0);
    `;
    cartBadge.title = 'Warenkorb';
    document.body.appendChild(cartBadge);

    document.querySelectorAll('.buy-btn').forEach(btn => {
        if (btn.type === 'submit') return; // skip newsletter button

        btn.addEventListener('click', () => {
            cartCount++;
            cartBadge.textContent = cartCount;
            cartBadge.style.transform = 'scale(1)';

            // Bounce animation
            cartBadge.style.animation = 'none';
            cartBadge.offsetHeight; // trigger reflow
            cartBadge.style.animation = 'cart-bounce 0.4s ease';

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = 'HINZUGEFÜGT!';
            btn.style.background = '#e6ff00';
            btn.style.color = '#0a0a0a';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    // Cart bounce animation
    const cartStyle = document.createElement('style');
    cartStyle.textContent = `
        @keyframes cart-bounce {
            0% { transform: scale(1); }
            30% { transform: scale(1.4); }
            50% { transform: scale(0.9); }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(cartStyle);

    // --- STICKER PARALLAX on mouse move ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        document.querySelectorAll('.sticker').forEach((sticker, i) => {
            const speed = (i + 1) * 3;
            sticker.style.transform = `
                rotate(${sticker.style.getPropertyValue('--rot') || '0deg'})
                translate(${x * speed}px, ${y * speed}px)
            `;
        });
    });

    // --- KONAMI CODE EASTER EGG ---
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'rainbow 2s linear infinite';
                const rainbowStyle = document.createElement('style');
                rainbowStyle.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(rainbowStyle);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // --- RANDOM GLITCH on title periodically ---
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl) {
        setInterval(() => {
            glitchEl.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff2d7b,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00d4ff
            `;
            setTimeout(() => {
                glitchEl.style.textShadow = '';
            }, 100);
        }, 3000 + Math.random() * 2000);
    }
});
