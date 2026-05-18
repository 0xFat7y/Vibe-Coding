const phoneImage = document.getElementById('phoneImage');
        const mainContainer = document.getElementById('mainContainer');
        const colorOptions = document.querySelectorAll('.color-option');
        const cartCount = document.getElementById('cartCount');
        const notification = document.getElementById('notification');
        let cart = 0;

        // Create animated particles
        function createParticles() {
            const particles = document.getElementById('particles');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particles.appendChild(particle);
            }
        }

        function changePhone(src, color, index) {
            // Update phone image with animation
            phoneImage.style.transform = 'scale(0.8) rotate(10deg)';
            phoneImage.style.opacity = '0';
            
            setTimeout(() => {
                phoneImage.src = src;
                phoneImage.style.transform = 'scale(1) rotate(0deg)';
                phoneImage.style.opacity = '1';
            }, 300);

            // Update background color
            mainContainer.style.background = `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, 20)} 100%)`;

            // Update active color option
            colorOptions.forEach((option, i) => {
                option.classList.toggle('active', i === index);
            });
        }

        function adjustBrightness(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
            const B = Math.min(255, (num & 0x0000FF) + amt);
            return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
        }

        function addToCart() {
            cart++;
            cartCount.textContent = cart;
            cartCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
            
            showNotification('iPhone 14 Pro Max added to cart! 🎉');
        }

        function showNotification(message) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            phoneImage.style.transform = `
                translateY(-20px)
                rotateY(${mouseX * 10}deg)
                rotateX(${-mouseY * 10}deg)
            `;
        });

        // Initialize
        createParticles();

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });