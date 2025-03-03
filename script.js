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

        // Update placeholder attributes
        document.querySelectorAll(`[data-lang-${lang}-placeholder]`).forEach(element => {
            element.placeholder = element.getAttribute(`data-lang-${lang}-placeholder`);
        });

        // Update form validation messages
        updateFormValidationMessages(lang);
    }

    // ==========================================================
    // Carousel functionality - 새로 작성된 코드
    // ==========================================================
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let autoSlideInterval = null;
    
    // 디버깅을 위한 로그
    console.log('캐러셀 요소:', carousel);
    console.log('이전 버튼:', prevBtn);
    console.log('다음 버튼:', nextBtn);
    
    if (carousel && prevBtn && nextBtn) {
        // 슬라이드 너비 계산 함수
        function getSlideWidth() {
            // 슬라이드 요소 너비 + 마진
            return window.innerWidth <= 480 ? 290 : 310;
        }
        
        // 다음 슬라이드로 이동
        function nextSlide() {
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 30) {
                // 마지막 슬라이드면 처음으로 이동
                carousel.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // 다음 슬라이드로 이동
                carousel.scrollTo({
                    left: carousel.scrollLeft + getSlideWidth(),
                    behavior: 'smooth'
                });
            }
            // 버튼 상태 업데이트
            setTimeout(updateButtonStates, 500);
        }
        
        // 이전 슬라이드로 이동
        function prevSlide() {
            carousel.scrollTo({
                left: carousel.scrollLeft - getSlideWidth(),
                behavior: 'smooth'
            });
            // 버튼 상태 업데이트
            setTimeout(updateButtonStates, 500);
        }
        
        // 버튼 상태 업데이트
        function updateButtonStates() {
            const isAtStart = carousel.scrollLeft < 10;
            const isAtEnd = carousel.scrollLeft > carousel.scrollWidth - carousel.clientWidth - 30;
            
            // 버튼 비활성화 상태 토글
            prevBtn.classList.toggle('disabled', isAtStart);
            nextBtn.classList.toggle('disabled', isAtEnd);
            
            // 버튼 색상 변경
            prevBtn.style.backgroundColor = isAtStart ? '#ccc' : '';
            nextBtn.style.backgroundColor = isAtEnd ? '#ccc' : '';
            
            console.log('버튼 상태 업데이트:', { 
                isAtStart, 
                isAtEnd, 
                scrollLeft: carousel.scrollLeft, 
                scrollWidth: carousel.scrollWidth, 
                clientWidth: carousel.clientWidth 
            });
        }
        
        // 자동 슬라이드 시작
        function startAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
            autoSlideInterval = setInterval(nextSlide, 5000);
            console.log('자동 슬라이드 시작');
        }
        
        // 자동 슬라이드 중지
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
                console.log('자동 슬라이드 중지');
            }
        }
        
        // 이벤트 리스너 추가
        nextBtn.addEventListener('click', function(e) {
            console.log('다음 버튼 클릭');
            e.preventDefault();
            stopAutoSlide();
            nextSlide();
            setTimeout(startAutoSlide, 10000);
        });
        
        prevBtn.addEventListener('click', function(e) {
            console.log('이전 버튼 클릭');
            e.preventDefault();
            stopAutoSlide();
            prevSlide();
            setTimeout(startAutoSlide, 10000);
        });
        
        // 터치 이벤트 처리
        carousel.addEventListener('touchstart', function() {
            stopAutoSlide();
        });
        
        carousel.addEventListener('touchend', function() {
            // 스크롤 후 버튼 상태 업데이트
            setTimeout(updateButtonStates, 500);
            // 일정 시간 후 자동 슬라이드 재시작
            setTimeout(startAutoSlide, 10000);
        });
        
        // 마우스 이벤트 처리
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // 스크롤 이벤트 처리
        carousel.addEventListener('scroll', function() {
            requestAnimationFrame(updateButtonStates);
        });
        
        // 초기 버튼 상태 설정
        updateButtonStates();
        
        // 초기 자동 슬라이드 시작
        startAutoSlide();
    }
    
    // Form handling
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // 폼 유효성 검사 메시지 업데이트
    function updateFormValidationMessages(lang) {
        const emailErrorMsg = lang === 'zh' ? '请输入有效的电子邮件地址' : '유효한 이메일 주소를 입력하세요';
        const requiredFieldMsg = lang === 'zh' ? '请至少填写一项联系方式' : '적어도 하나의 연락처를 입력하세요';
        
        // 에러 메시지 업데이트
        if (emailInput) emailInput.dataset.errorMessage = emailErrorMsg;
        if (phoneInput) phoneInput.dataset.errorMessage = requiredFieldMsg;
    }
    
    // 폼 제출 처리
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // 적어도 하나의 필드는 입력해야 함
            if ((!emailInput || !emailInput.value) && (!phoneInput || !phoneInput.value)) {
                e.preventDefault();
                isValid = false;
                const errorMsg = languageSelector.value === 'zh' ? 
                    '请至少填写一项联系方式' : '적어도 하나의 연락처를 입력하세요';
                alert(errorMsg);
            }
            
            // 이메일이 입력된 경우 유효성 검사
            if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
                e.preventDefault();
                isValid = false;
                const errorMsg = languageSelector.value === 'zh' ? 
                    '请输入有效的电子邮件地址' : '유효한 이메일 주소를 입력하세요';
                alert(errorMsg);
            }
            
            return isValid;
        });
    }
    
    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // CTA 버튼 스무스 스크롤
    const ctaButton = document.querySelector('.cta-button a');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 폼 하이라이트 효과
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 1500);
            }
        });
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
}); 