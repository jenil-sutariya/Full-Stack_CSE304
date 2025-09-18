document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculatorForm');
    const resultContainer = document.getElementById('result');
    const errorContainer = document.getElementById('error');
    const calculateBtn = document.querySelector('.calculate-btn');
    
    // Clear any previous results when form is reset
    form.addEventListener('reset', function() {
        hideResults();
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous results
        hideResults();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            num1: formData.get('num1').trim(),
            num2: formData.get('num2').trim(),
            operation: formData.get('operation')
        };
        
        // Basic client-side validation
        if (!data.num1 || !data.num2 || !data.operation) {
            showError('Please fill in all fields!');
            return;
        }
        
        // Check if inputs are valid numbers
        if (isNaN(data.num1) || isNaN(data.num2)) {
            showError('Please enter valid numbers only!');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Send request to server
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showResult(result.expression, result.result);
            } else {
                showError(result.error);
            }
            
        } catch (error) {
            console.error('Error:', error);
            showError('Oops! Something went wrong. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });
    
    // Function to show result
    function showResult(expression, result) {
        resultContainer.innerHTML = `
            <div class="result-content">
                <div class="expression">${expression}</div>
                <div class="result-number">🎉 The answer is: <strong>${result}</strong></div>
            </div>
        `;
        resultContainer.classList.add('show');
        
        // Add celebration effect
        celebrate();
    }
    
    // Function to show error
    function showError(message) {
        errorContainer.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        errorContainer.classList.add('show');
    }
    
    // Function to hide all results
    function hideResults() {
        resultContainer.classList.remove('show');
        errorContainer.classList.remove('show');
    }
    
    // Function to set loading state
    function setLoadingState(loading) {
        if (loading) {
            calculateBtn.classList.add('loading');
            calculateBtn.disabled = true;
            calculateBtn.textContent = 'Calculating...';
        } else {
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Calculate! 🎯';
        }
    }
    
    // Function to add celebration effect
    function celebrate() {
        // Create confetti effect
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 100);
        }
    }
    
    // Function to create confetti
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = 'confettiFall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
    
    // Add confetti animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add input validation feedback
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.trim();
            if (value && isNaN(value)) {
                this.style.borderColor = '#f56565';
                this.style.backgroundColor = '#fed7d7';
            } else {
                this.style.borderColor = '#e2e8f0';
                this.style.backgroundColor = 'white';
            }
        });
        
        input.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && isNaN(value)) {
                showError('Please enter numbers only!');
            }
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !calculateBtn.disabled) {
            form.dispatchEvent(new Event('submit'));
        }
    });
});

