document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
        searchInput.addEventListener('keypress', function(event) {
            const searchTerm = this.value.trim(); 
            
            if (event.key === 'Enter' && searchTerm.length > 0) {
                event.preventDefault(); 
                const currentPage = window.location.pathname;
                
                if (currentPage.includes('hawker-centers-guest')) {
                    window.location.href = 'Stalls-guest.html';
                } 
                else if (currentPage.includes('hawker-centers-user')) {
                    window.location.href = 'Stalls-user.html';
                }
            }
        });
});