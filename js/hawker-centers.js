document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            // If user presses Enter (key code 13)
            if (event.key === 'Enter') {
                // Get whatever they typed
                const searchTerm = this.value.trim();
                
                // If they typed anything at all, go to Stalls.html
                if (searchTerm.length > 0) {
                    window.location.href = 'Stalls.html';
                }
            }
        });
    }
});