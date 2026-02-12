/* ======================================
   MÄNNERTRÄNEN.DE - PUNK INTERACTIONS
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptAll = document.getElementById('cookie-accept-all');
    const cookieEssentials = document.getElementById('cookie-essentials');

    if (cookieBanner) {
        const consent = localStorage.getItem('mt-cookie-consent');
        if (consent) {
            cookieBanner.classList.add('hidden');
        }

        if (cookieAcceptAll) {
            cookieAcceptAll.addEventListener('click', () => {
                localStorage.setItem('mt-cookie-consent', 'all');
                cookieBanner.classList.add('hidden');
            });
        }

        if (cookieEssentials) {
            cookieEssentials.addEventListener('click', () => {
                localStorage.setItem('mt-cookie-consent', 'essentials');
                cookieBanner.classList.add('hidden');
            });
        }
    }

    // --- MOBILE NAV HAMBURGER ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

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

    document.querySelectorAll('.product-card, .review-card, .zine-page, .story-card, .shipping-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform += ' translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .product-card.visible, .review-card.visible, .zine-page.visible,
        .story-card.visible, .shipping-card.visible, .faq-item.visible {
            opacity: 1 !important;
            transform: rotate(var(--card-rot, 0deg)) translateY(0) !important;
        }
        .review-card.visible {
            transform: rotate(var(--review-rot, 0deg)) translateY(0) !important;
        }
        .zine-page.visible {
            transform: rotate(-1deg) translateY(0) !important;
        }
        .story-card.visible {
            transform: rotate(0deg) translateY(0) !important;
        }
        .story-card.story-card-main.visible {
            transform: rotate(-0.5deg) translateY(0) !important;
        }
        .shipping-card.visible, .faq-item.visible {
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- CART SYSTEM ---
    const cart = [];
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCheckout = document.getElementById('cart-checkout');

    // Cart badge (floating)
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

    function openCart() {
        if (cartDrawer) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    cartBadge.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + '\u20AC';
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        const count = getCartCount();

        // Update badge
        if (count > 0) {
            cartBadge.textContent = count;
            cartBadge.style.transform = 'scale(1)';
        } else {
            cartBadge.style.transform = 'scale(0)';
        }

        // Render items
        if (count === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Noch leer. Zeit, das zu \u00e4ndern.</p>';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        if (cartFooter) cartFooter.style.display = '';

        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-qty">
                        <button type="button" data-action="dec" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button type="button" data-action="inc" data-index="${index}">+</button>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;

        // Update total
        if (cartTotalPrice) {
            cartTotalPrice.textContent = formatPrice(getCartTotal());
        }

        // Bind +/- buttons
        cartItemsContainer.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index, 10);
                if (btn.dataset.action === 'inc') {
                    cart[idx].qty++;
                } else {
                    cart[idx].qty--;
                    if (cart[idx].qty <= 0) {
                        cart.splice(idx, 1);
                    }
                }
                renderCart();
            });
        });
    }

    // Buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        if (btn.type === 'submit') return; // skip newsletter button

        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;

            const name = card.dataset.name || card.querySelector('h3')?.textContent || 'Produkt';
            const price = parseFloat(card.dataset.price) || 0;

            // Check if already in cart
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            renderCart();

            // Bounce animation on badge
            cartBadge.style.animation = 'none';
            cartBadge.offsetHeight; // trigger reflow
            cartBadge.style.animation = 'cart-bounce 0.4s ease';

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = 'HINZUGEF\u00dcGT!';
            btn.style.background = '#e6ff00';
            btn.style.color = '#0a0a0a';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 1000);

            // Open cart drawer briefly
            openCart();
        });
    });

    // Checkout button
    if (cartCheckout) {
        cartCheckout.addEventListener('click', () => {
            if (cart.length === 0) return;
            alert('Danke f\u00fcr deine Bestellung! (Demo-Modus \u2013 kein echtes Checkout)');
            cart.length = 0;
            renderCart();
            closeCart();
        });
    }

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

    // Close cart on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
});
