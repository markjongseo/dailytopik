document.addEventListener('DOMContentLoaded', function() {
    // Remove local tracking code since we're using server-side tracking now

    // Form element references
    let signupForm, emailInput, phoneInput;
    
    // Init function that will be called after all declarations
    function initializeElements() {
        // Initialize form elements
        signupForm = document.getElementById('signup-form');
        emailInput = document.getElementById('email');
        phoneInput = document.getElementById('phone');
        
        // Set up event listeners for the form if elements exist
        if (signupForm) {
            setupFormHandling();
        }
    }

    // Language selector functionality removed as requested
    
    // Set default language to Chinese
    setLanguage('zh');

    function setLanguage(lang) {
        // Update language attribute on the HTML tag
        document.documentElement.setAttribute('lang', 'zh-CN');
        
        // Update all elements with data-lang attributes
        document.querySelectorAll(`[data-lang-${lang}]`).forEach(element => {
            element.innerHTML = element.getAttribute(`data-lang-${lang}`);
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
    
    // Form handling setup function
    function setupFormHandling() {
        const signupForm = document.getElementById('signup-form');
        const loadingIndicator = document.getElementById('loading-indicator');
        const successMessage = document.querySelector('.success-message');
        
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading indicator
                loadingIndicator.style.display = 'flex';
                
                // Track form submission - use fallback if Clarity is blocked
                if (typeof clarity === 'undefined' && window.fallbackAnalytics) {
                    window.fallbackAnalytics.trackEvent('Form', 'Submit');
                }
                
                // Form validation
                const emailInput = document.getElementById('email');
                const phoneInput = document.getElementById('phone');
                
                // Validate phone number (required)
                if (!isValidPhoneNumber(phoneInput.value)) {
                    loadingIndicator.style.display = 'none';
                    alert(currentLanguage === 'ko' 
                        ? '유효한 전화번호를 입력해주세요'
                        : '请输入有效的电话号码');
                    return;
                }
                
                // Validate email if provided
                if (emailInput.value && !isValidEmail(emailInput.value)) {
                    loadingIndicator.style.display = 'none';
                    alert(currentLanguage === 'ko' 
                        ? '유효한 이메일 주소를 입력해주세요'
                        : '请输入有效的电子邮件地址');
                    return;
                }
                
                // Form is valid, show loading indicator
                if (loadingIndicator) {
                    loadingIndicator.style.setProperty('display', 'flex', 'important');
                    // Force a reflow
                    void loadingIndicator.offsetWidth;
                }
                
                // Disable the submit button
                const submitButton = signupForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                }
                
                // Use fetch to submit the form
                fetch(signupForm.action, {
                    method: 'POST',
                    body: new FormData(signupForm),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    
                    // Form submitted successfully, redirect happens automatically
                    // If there's no redirect, we can show a success message
                    if (successMessage) {
                        successMessage.style.display = 'block';
                    }
                    
                    // Reset the form
                    signupForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Show error message to user
                    const lang = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh' : 'ko';
                    const errorMsg = lang === 'zh' ? 
                        '提交表单时出现错误。请稍后再试。' : 
                        '양식을 제출하는 중에 오류가 발생했습니다. 나중에 다시 시도해 주세요.';
                    alert(errorMsg);
                    
                    // Re-enable the submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                })
                .finally(() => {
                    // Hide loading indicator
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    // Initialize page after defining all functions
    initializeElements();
}); 