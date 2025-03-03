document.addEventListener('DOMContentLoaded', function() {
    // Language selector functionality
    const languageSelector = document.getElementById('language-selector');
    
    // Initialize with Chinese by default
    setLanguage('zh');

    // Event listener for language change
    languageSelector.addEventListener('change', function() {
        setLanguage(this.value);
    });

    function setLanguage(lang) {
        // Update language attribute on the HTML tag
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'ko');
        
        // Update all elements with data-lang attributes
        document.querySelectorAll(`[data-lang-${lang}]`).forEach(element => {
            element.textContent = element.getAttribute(`data-lang-${lang}`);
        });

        // Update placeholders for input fields
        document.querySelectorAll(`[data-lang-${lang}-placeholder]`).forEach(element => {
            element.setAttribute('placeholder', element.getAttribute(`data-lang-${lang}-placeholder`));
        });

        // Update selected option text
        document.querySelectorAll('select option').forEach(option => {
            if (option.hasAttribute(`data-lang-${lang}`)) {
                option.textContent = option.getAttribute(`data-lang-${lang}`);
            }
        });

        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', lang);

        // Update form validation messages based on language
        updateFormValidationMessages(lang);
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let autoSlideInterval; // 자동 슬라이드를 위한 interval
    
    if (carousel && prevBtn && nextBtn) {
        // 모바일에서 스크롤 거리 조정
        const getScrollDistance = () => {
            return window.innerWidth <= 480 ? 290 : 310; // 모바일에서는 더 작은 값 사용
        };
        
        // 자동 슬라이드 시작 함수
        function startAutoSlide() {
            // 5초마다 다음 슬라이드로 이동
            autoSlideInterval = setInterval(() => {
                // 마지막 슬라이드에 도달했는지 확인
                if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                    // 처음으로 돌아가기
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // 다음 슬라이드로 이동
                    carousel.scrollLeft += getScrollDistance();
                }
                updateButtonStates();
            }, 5000); // 5초 간격
        }
        
        // 자동 슬라이드 중지 함수
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // 초기 자동 슬라이드 시작
        startAutoSlide();
        
        // 사용자 상호작용 시 자동 슬라이드 중지/재시작
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // 버튼 클릭 시 scrollLeft 업데이트
        nextBtn.addEventListener('click', () => {
            stopAutoSlide(); // 버튼 클릭 시 자동 슬라이드 중지
            carousel.scrollLeft += getScrollDistance();
            updateButtonStates();
            // 클릭 후 일정 시간 후 자동 슬라이드 재시작
            setTimeout(startAutoSlide, 10000);
        });
        
        prevBtn.addEventListener('click', () => {
            stopAutoSlide(); // 버튼 클릭 시 자동 슬라이드 중지
            carousel.scrollLeft -= getScrollDistance();
            updateButtonStates();
            // 클릭 후 일정 시간 후 자동 슬라이드 재시작
            setTimeout(startAutoSlide, 10000);
        });
        
        function updateButtonStates() {
            prevBtn.classList.toggle('disabled', carousel.scrollLeft <= 0);
            nextBtn.classList.toggle('disabled', carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth);
            
            // Update button colors to give visual feedback
            prevBtn.style.backgroundColor = carousel.scrollLeft <= 0 ? '#ccc' : '';
            nextBtn.style.backgroundColor = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth ? '#ccc' : '';
        }
    }
    
    // 터치 스와이프 이벤트로 모바일 환경에서도 자동 슬라이드 중지하기
    if (carousel) {
        carousel.addEventListener('touchstart', stopAutoSlide);
        carousel.addEventListener('touchend', () => {
            // 터치 종료 후 10초 후에 자동 슬라이드 재시작
            setTimeout(startAutoSlide, 10000);
        });
    }

    // Contact method selection
    const contactMethodSelect = document.getElementById('contact-method');
    const emailGroup = document.getElementById('email-group');
    const phoneGroup = document.getElementById('phone-group');

    contactMethodSelect.addEventListener('change', function() {
        const method = this.value;
        if (method === 'email') {
            emailGroup.style.display = 'block';
            phoneGroup.style.display = 'none';
        } else if (method === 'phone') {
            emailGroup.style.display = 'none';
            phoneGroup.style.display = 'block';
        }
    });

    // Form validation functionality
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const successMessage = document.querySelector('.success-message');
    
    // Set custom form validation messages based on language
    function updateFormValidationMessages(lang) {
        const emailValidationMessage = lang === 'zh' ? '请输入有效的电子邮件地址' : '유효한 이메일 주소를 입력하세요';
        const requiredFieldMessage = lang === 'zh' ? '请至少填写电子邮件或手机号码中的一项' : '이메일 또는 전화번호 중 하나 이상을 입력하세요';
        
        emailInput.setAttribute('title', emailValidationMessage);
        emailInput.dataset.errorMessage = emailValidationMessage;
        phoneInput.dataset.errorMessage = requiredFieldMessage;
    }
    
    // Initialize validation messages
    updateFormValidationMessages(languageSelector.value);

    // Form submission handler
    signupForm.addEventListener('submit', function(e) {
        // Check if at least one field is filled
        if (!emailInput.value && !phoneInput.value) {
            e.preventDefault();
            const currentLang = languageSelector.value;
            const errorMessage = currentLang === 'zh' ? 
                '请至少填写电子邮件或手机号码中的一项' : 
                '이메일 또는 전화번호 중 하나 이상을 입력하세요';
            
            alert(errorMessage);
            return false;
        }
        
        // If email is filled, validate email format
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            e.preventDefault();
            const currentLang = languageSelector.value;
            const errorMessage = currentLang === 'zh' ? 
                '请输入有效的电子邮件地址' : 
                '유효한 이메일 주소를 입력하세요';
            
            alert(errorMessage);
            emailInput.focus();
            return false;
        }
        
        // If validation passed, show a temporary message and allow form submission
        console.log('Form validation passed, submitting...');
        
        // You can uncomment the following code if you want to show a loading indicator
        /*
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
                                (languageSelector.value === 'zh' ? '提交中...' : '제출 중...');
        */
        
        // Let the form submit normally to FormSubmit
        return true;
    });
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Listen for scroll events to add animation effects
    window.addEventListener('scroll', function() {
        const painPoints = document.querySelectorAll('.pain-point');
        
        painPoints.forEach(point => {
            const position = point.getBoundingClientRect();
            
            // If the element is in the viewport
            if(position.top < window.innerHeight && position.bottom >= 0) {
                point.style.opacity = 1;
                point.style.transform = 'translateY(0)';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjusted for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add smooth scroll functionality for CTA button
    const ctaButton = document.querySelector('.cta-button a');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scroll to the target element with animation
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust offset as needed
                    behavior: 'smooth'
                });
                
                // Add a highlight effect to the form when scrolled
                setTimeout(function() {
                    targetElement.classList.add('highlight');
                    setTimeout(function() {
                        targetElement.classList.remove('highlight');
                    }, 1500);
                }, 800);
            }
        });
    }
}); 