document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const messageDiv = document.getElementById('message');
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('resume');

    // File size validation (2MB = 2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    // Show message function
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Hide message function
    function hideMessage() {
        messageDiv.style.display = 'none';
    }

    // Validate file before upload
    function validateFile(file) {
        // Check file type
        if (file.type !== 'application/pdf') {
            showMessage('Error: Only PDF files are allowed!', 'error');
            return false;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            showMessage('Error: File size exceeds 2MB limit!', 'error');
            return false;
        }

        return true;
    }

    // File input change handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            hideMessage();
            validateFile(file);
        }
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const file = fileInput.files[0];

        // Validate file before sending
        if (!file) {
            showMessage('Please select a file to upload.', 'error');
            return;
        }

        if (!validateFile(file)) {
            return;
        }

        // Show loading state
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<span class="loading"></span>Uploading...';
        hideMessage();

        try {
            const response = await fetch('/upload-resume', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showMessage(`Success! ${result.message}`, 'success');
                form.reset(); // Clear the form
            } else {
                showMessage(`Error: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showMessage('Error: Failed to upload file. Please try again.', 'error');
        } finally {
            // Reset button state
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = 'Upload Resume';
        }
    });

    // Drag and drop functionality
    const uploadSection = document.querySelector('.upload-section');
    
    uploadSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadSection.style.border = '2px dashed #667eea';
        uploadSection.style.backgroundColor = '#f0f2ff';
    });

    uploadSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadSection.style.border = 'none';
        uploadSection.style.backgroundColor = 'white';
    });

    uploadSection.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadSection.style.border = 'none';
        uploadSection.style.backgroundColor = 'white';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            fileInput.files = files;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });
});
