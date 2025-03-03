document.addEventListener('DOMContentLoaded', function() {
    // Language Switching Functionality
    const languageSelect = document.getElementById('language');
    
    // Initialize language based on dropdown
    setLanguage(languageSelect.value);
    
    // Handle language change
    languageSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });
    
    // Function to switch language content
    function setLanguage(lang) {
        // Update all elements with data-lang attributes
        document.querySelectorAll('[data-lang-' + lang + ']').forEach(function(element) {
            element.textContent = element.getAttribute('data-lang-' + lang);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-lang-' + lang + '-placeholder]').forEach(function(element) {
            element.placeholder = element.getAttribute('data-lang-' + lang + '-placeholder');
        });
        
        // Update select options
        document.querySelectorAll('option[data-lang-' + lang + ']').forEach(function(option) {
            option.textContent = option.getAttribute('data-lang-' + lang);
        });
        
        // Set html lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'ko';
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const phoneScreens = document.querySelectorAll('.phone-mockup');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    
    let currentIndex = 0;
    const screenWidth = phoneScreens[0].offsetWidth + parseInt(getComputedStyle(phoneScreens[0]).marginLeft) * 2;
    
    // Initialize carousel
    updateCarousel();
    
    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentIndex < phoneScreens.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Update carousel position
    function updateCarousel() {
        carousel.scrollTo({
            left: currentIndex * screenWidth,
            behavior: 'smooth'
        });
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === phoneScreens.length - 1;
        
        // Visual feedback for disabled buttons
        if (prevButton.disabled) {
            prevButton.style.opacity = '0.5';
        } else {
            prevButton.style.opacity = '1';
        }
        
        if (nextButton.disabled) {
            nextButton.style.opacity = '0.5';
        } else {
            nextButton.style.opacity = '1';
        }
    }
    
    // Form handling
    const contactMethodSelect = document.getElementById('contact-method');
    const emailInput = document.getElementById('email-input');
    const phoneInput = document.getElementById('phone-input');
    const signupForm = document.getElementById('signup-form');
    
    // Toggle between email and phone input fields
    contactMethodSelect.addEventListener('change', function() {
        if (this.value === 'email') {
            emailInput.style.display = 'block';
            phoneInput.style.display = 'none';
            document.getElementById('email').setAttribute('required', '');
            document.getElementById('phone').removeAttribute('required');
        } else {
            emailInput.style.display = 'none';
            phoneInput.style.display = 'block';
            document.getElementById('phone').setAttribute('required', '');
            document.getElementById('email').removeAttribute('required');
        }
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const contactMethod = contactMethodSelect.value;
        const contactValue = contactMethod === 'email' 
            ? document.getElementById('email').value 
            : document.getElementById('phone').value;
        
        // Here you would typically send this data to your server
        // For demo purposes, we'll just show a success message
        
        const formContainer = signupForm.parentNode;
        const currentLang = languageSelect.value;
        
        if (currentLang === 'zh') {
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--wechat-color); margin-bottom: 1rem;"></i>
                    <h3>谢谢您，${name}！</h3>
                    <p>我们已收到您的${contactMethod === 'email' ? '电子邮箱' : '手机号码'}（${contactValue}）。</p>
                    <p>每日TOPIK上线时，我们会立即通知您。</p>
                </div>
            `;
        } else {
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--wechat-color); margin-bottom: 1rem;"></i>
                    <h3>${name}님, 감사합니다!</h3>
                    <p>귀하의 ${contactMethod === 'email' ? '이메일' : '전화번호'}(${contactValue})를 받았습니다.</p>
                    <p>매일 TOPIK이 출시되면 바로 알려드리겠습니다.</p>
                </div>
            `;
        }
    });

    // Auto-scroll to signup form when CTA button is clicked
    const ctaButton = document.querySelector('.cta-button a');
    
    ctaButton.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
}); 