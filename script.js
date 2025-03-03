document.addEventListener('DOMContentLoaded', function() {
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
    
    // Form handling
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // 폼 유효성 검사 메시지 업데이트
    function updateFormValidationMessages(lang) {
        let emailErrorMsg, phoneErrorMsg, phoneFormatErrorMsg, requiredFieldMsg;
        
        if (lang === 'zh') {
            emailErrorMsg = '请输入有效的电子邮件地址';
            phoneErrorMsg = '请输入有效的手机号码';
            phoneFormatErrorMsg = '请输入正确的手机号码格式 (01012345678)';
            requiredFieldMsg = '请至少填写一项联系方式';
        } else if (lang === 'ko') {
            emailErrorMsg = '유효한 이메일 주소를 입력해주세요';
            phoneErrorMsg = '유효한 전화번호를 입력해주세요';
            phoneFormatErrorMsg = '올바른 전화번호 형식을 입력해주세요 (01012345678)';
            requiredFieldMsg = '연락처 중 하나는 반드시 입력해주세요';
        }
        
        // 에러 메시지 업데이트
        if (emailInput) emailInput.dataset.errorMessage = emailErrorMsg;
        if (phoneInput) {
            phoneInput.dataset.errorMessage = phoneErrorMsg;
            phoneInput.dataset.formatErrorMessage = phoneFormatErrorMsg;
        }
    }
    
    // 폼 제출 처리
    if (signupForm) {
        // Get loading indicator reference
        const loadingIndicator = document.getElementById('loading-indicator');
        const successMessage = document.querySelector('.success-message');
        
        // Debug log
        console.log('Form and loading indicator setup:', { 
            form: signupForm, 
            loadingIndicator: loadingIndicator
        });
        
        // IMPORTANT: Force initial hiding of loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            console.log('Form submitted');
            
            let isValid = true;
            
            // 전화번호는 필수 입력 필드
            if (!phoneInput || !phoneInput.value) {
                isValid = false;
                
                // 현재 언어에 따라 메시지 선택
                const lang = document.documentElement.getAttribute('lang') === 'ko-KR' ? 'ko' : 'zh';
                const message = lang === 'ko' ? '전화번호는 필수 입력 항목입니다. 결제 링크가 이 번호로 전송됩니다.' : '手机号码为必填项。支付链接将发送至此号码。';
                
                alert(message);
                phoneInput.focus();
                return false;
            }
            
            // 전화번호 형식 검사
            if (phoneInput && phoneInput.value && !isValidPhoneNumber(phoneInput.value)) {
                isValid = false;
                
                // 현재 언어에 따라 메시지 선택
                const lang = document.documentElement.getAttribute('lang') === 'ko-KR' ? 'ko' : 'zh';
                const message = phoneInput.dataset.formatErrorMessage || (lang === 'ko' ? '올바른 전화번호 형식을 입력해주세요 (01012345678)' : '请输入正确的手机号码格式 (01012345678)');
                
                alert(message);
                phoneInput.focus();
                return false;
            }
            
            // 이메일이 입력된 경우에만 유효성 검사
            if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
                isValid = false;
                
                // 현재 언어에 따라 메시지 선택
                const lang = document.documentElement.getAttribute('lang') === 'ko-KR' ? 'ko' : 'zh';
                const message = lang === 'ko' ? '유효한 이메일 주소를 입력해주세요' : '请输入有效的电子邮件地址';
                
                alert(message);
                emailInput.focus();
                return false;
            }
            
            // If form is valid, submit using fetch API
            if (isValid) {
                console.log('Form is valid, submitting with fetch');
                
                // Show loading indicator
                if (loadingIndicator) {
                    console.log('Showing loading indicator');
                    loadingIndicator.style.display = 'block';
                }
                
                // Disable the submit button to prevent multiple submissions
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
                
                // Get form data
                const formData = new FormData(signupForm);
                
                // Submit the form using fetch
                fetch(signupForm.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(data => {
                    console.log('Success:', data);
                    
                    // Hide loading indicator
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                    
                    // Show success message
                    if (successMessage) {
                        signupForm.style.display = 'none';
                        successMessage.style.display = 'block';
                    } else {
                        // If no success message element, redirect to the success page
                        window.location.href = formData.get('_redirect') || 'https://markjongseo.github.io/dailytopik/thankyou.html';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Hide loading indicator
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                    
                    // Re-enable the submit button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                    
                    // Show error message
                    const lang = document.documentElement.getAttribute('lang') === 'ko-KR' ? 'ko' : 'zh';
                    const message = lang === 'ko' ? '제출 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' : '提交时出错。请稍后再试。';
                    alert(message);
                });
            }
        });
    }
    
    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // 전화번호 유효성 검사 함수
    function isValidPhoneNumber(phone) {
        // Remove any non-digit characters
        const cleanedPhone = phone.replace(/\D/g, '');
        // Check if it starts with 010 and has exactly 11 digits (010 + 8 more digits)
        return /^010\d{8}$/.test(cleanedPhone);
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