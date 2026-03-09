document.addEventListener('DOMContentLoaded', () => {

    // =================================
    // 1. الوضع الداكن + التكبير
    // =================================

    let currentZoom = 100;
    const MIN_ZOOM = 70;
    const MAX_ZOOM = 130;

    function createControlTools() {

        const header = document.querySelector('header');
        if (!header) {
            console.error('Header not found');
            return;
        }

        if (document.getElementById('darkModeBtn')) {
            console.log('Dark mode button already exists');
            return;
        }

        const controlTools = document.createElement('div');
        controlTools.className = 'control-tools';

        // زر الوضع الداكن
        const darkModeBtn = document.createElement('button');
        darkModeBtn.className = 'control-btn dark-mode-toggle';
        darkModeBtn.id = 'darkModeBtn';
        darkModeBtn.innerHTML = '🌙';
        darkModeBtn.title = 'الوضع الداكن';
        darkModeBtn.setAttribute('aria-label', 'تبديل الوضع الداكن');
        darkModeBtn.setAttribute('type', 'button');

        // التكبير والتصغير
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';

        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'control-btn';
        zoomOutBtn.innerHTML = '−';
        zoomOutBtn.setAttribute('type', 'button');
        zoomOutBtn.setAttribute('aria-label', 'تصغير');

        const zoomLevel = document.createElement('span');
        zoomLevel.id = 'zoomLevel';
        zoomLevel.className = 'zoom-level';
        zoomLevel.textContent = '100%';

        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'control-btn';
        zoomInBtn.innerHTML = '+';
        zoomInBtn.setAttribute('type', 'button');
        zoomInBtn.setAttribute('aria-label', 'تكبير');

        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(zoomLevel);
        zoomControls.appendChild(zoomInBtn);

        controlTools.appendChild(darkModeBtn);
        controlTools.appendChild(zoomControls);

        // إدراج أدوات التحكم في الهيدر
        const logo = header.querySelector('.logo');
        if (logo && logo.parentNode) {
            logo.parentNode.insertBefore(controlTools, logo.nextSibling);
            console.log('Control tools added successfully');
        } else {
            header.insertBefore(controlTools, header.firstChild);
            console.log('Control tools added to header start');
        }

        // إضافة مستمعي الأحداث
        darkModeBtn.addEventListener('click', toggleDarkMode);
        zoomInBtn.addEventListener('click', () => changeZoom(10));
        zoomOutBtn.addEventListener('click', () => changeZoom(-10));

        console.log('Dark mode button created');

        restoreSettings();
    }

    function toggleDarkMode() {

        const html = document.documentElement;
        const btn = document.getElementById('darkModeBtn');

        if (html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('darkMode', 'disabled');
            btn.innerHTML = '🌙';
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'enabled');
            btn.innerHTML = '☀️';
        }
    }

    function changeZoom(delta) {

        currentZoom += delta;

        if (currentZoom < MIN_ZOOM) currentZoom = MIN_ZOOM;
        if (currentZoom > MAX_ZOOM) currentZoom = MAX_ZOOM;

        document.body.style.zoom = currentZoom + '%';

        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) zoomLevel.textContent = currentZoom + '%';

        localStorage.setItem('zoomLevel', currentZoom);
    }

    function restoreSettings() {

        const darkMode = localStorage.getItem('darkMode');

        if (darkMode === 'enabled') {
            document.documentElement.setAttribute('data-theme', 'dark');
            const btn = document.getElementById('darkModeBtn');
            if (btn) btn.innerHTML = '☀️';
        }

        const savedZoom = localStorage.getItem('zoomLevel');

        if (savedZoom) {
            currentZoom = parseInt(savedZoom);
            document.body.style.zoom = currentZoom + '%';

            const zoomLevel = document.getElementById('zoomLevel');
            if (zoomLevel) zoomLevel.textContent = currentZoom + '%';
        }
    }

    createControlTools();


    // =================================
    // 2. قائمة الهاتف
    // =================================

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');

    if (menuToggle && navMenu) {

        menuToggle.addEventListener('click', () => {

            navMenu.classList.toggle('active');

            const expanded = navMenu.classList.contains('active');

            menuToggle.setAttribute('aria-expanded', expanded);

            menuToggle.textContent = expanded ? '✕' : '☰';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {

                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            });
        });

        document.addEventListener('click', (e) => {

            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {

                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    }


    // =================================
    // 3. تأثير الترويسة عند التمرير
    // =================================

    const header = document.querySelector('header');

    if (header) {

        window.addEventListener('scroll', () => {

            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }


    // =================================
    // 4. زر العودة للأعلى
    // =================================

    const backToTopBtn = document.createElement('button');

    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {

        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // =================================
    // 5. التحقق من النموذج
    // =================================

    const contactForm = document.querySelector('#contactForm');

    if (contactForm) {

        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const messageInput = document.querySelector('#message');

        const validateName = (input) => {

            const value = input.value.trim();
            const regex = /^[\u0600-\u06FFa-zA-Z\s]{2,}$/;

            if (!regex.test(value)) {
                return 'الاسم يجب أن يحتوي على حروف فقط';
            }

            return null;
        };

        const validateEmail = (input) => {

            const value = input.value.trim();
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(value)) {
                return 'بريد إلكتروني غير صحيح';
            }

            return null;
        };

        const validateMessage = (input) => {

            const value = input.value.trim();

            if (value.length < 10) {
                return 'الرسالة قصيرة جداً';
            }

            return null;
        };

        const showError = (input, message) => {

            const group = input.closest('.form-group') || input.parentElement;

            let error = group.querySelector('.error-message');

            if (!error) {

                error = document.createElement('div');
                error.className = 'error-message';
                group.appendChild(error);
            }

            error.textContent = message;
            error.style.display = 'block';

            input.classList.add('error');
            input.classList.remove('success');
        };

        const showSuccess = (input) => {

            const group = input.closest('.form-group') || input.parentElement;

            const error = group.querySelector('.error-message');

            if (error) error.style.display = 'none';

            input.classList.remove('error');
            input.classList.add('success');
        };


        if (nameInput) {

            nameInput.addEventListener('blur', () => {

                const error = validateName(nameInput);

                if (error) showError(nameInput, error);
                else showSuccess(nameInput);
            });
        }

        if (emailInput) {

            emailInput.addEventListener('blur', () => {

                const error = validateEmail(emailInput);

                if (error) showError(emailInput, error);
                else showSuccess(emailInput);
            });
        }

        if (messageInput) {

            messageInput.addEventListener('blur', () => {

                const error = validateMessage(messageInput);

                if (error) showError(messageInput, error);
                else showSuccess(messageInput);
            });
        }
    }

});

