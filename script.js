class BigResultPromise {
    constructor() {
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbyFw2S26iqkyaoUrbrjJF1a3jnayniZZYTAvkdKu4_EwGpATNUGmokMwjHl0Wa312Y/exec'; // Replace with your deployed Web App URL
        this.generateBtn = document.getElementById('generateBtn');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.errorContainer = document.getElementById('errorContainer');
        this.spinner = document.querySelector('.spinner');
        this.btnText = document.querySelector('.btn-text');
        
        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generatePromise());
        
        // Add enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generatePromise();
            }
        });
    }

    async generatePromise() {
        const desiredResult = document.getElementById('desiredResult').value.trim();
        const timeFrame = document.getElementById('timeFrame').value.trim();

        // Validate inputs
        if (!desiredResult || !timeFrame) {
            this.showError('Please fill in both fields: Desired Result and Time Frame.');
            return;
        }

        this.setLoadingState(true);
        this.hideError();
        this.hideResults();

        try {
            const result = await this.sendToBackend(desiredResult, timeFrame);
            this.displayResults(result);
        } catch (error) {
            this.showError(error.message || 'Failed to generate promise. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendToBackend(desiredResult, timeFrame) {
        const formData = new FormData();
        formData.append('desiredResult', desiredResult);
        formData.append('timeFrame', timeFrame);

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    }

    displayResults(data) {
        document.getElementById('headline').textContent = data.headline || '';
        document.getElementById('salesPromise').textContent = data.salesPromise || '';
        document.getElementById('adCopy').textContent = data.adCopy || '';
        
        this.resultsContainer.classList.remove('hidden');
        this.resultsContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.errorContainer.classList.remove('hidden');
        this.errorContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    hideError() {
        this.errorContainer.classList.add('hidden');
    }

    hideResults() {
        this.resultsContainer.classList.add('hidden');
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.generateBtn.disabled = true;
            this.spinner.classList.remove('hidden');
            this.btnText.textContent = 'Generating...';
        } else {
            this.generateBtn.disabled = false;
            this.spinner.classList.add('hidden');
            this.btnText.textContent = 'Get The Big Result';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BigResultPromise();
});
