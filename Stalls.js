// Stalls.js
document.addEventListener('DOMContentLoaded', function() {
  const filterCheckboxes = document.querySelectorAll('.filter input[type="checkbox"]');
  const stalls = document.querySelectorAll('.stall');

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterStalls);
  });
  
  function filterStalls() {
    // get selected categories
    const selectedCategories = Array.from(
      document.querySelectorAll('input[name="category"]:checked')
    ).map(cb => cb.value);
    
    // get selected cuisines
    const selectedCuisines = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked:not([name="category"])')
    ).map(cb => cb.value);
    
    stalls.forEach(stall => {
      const stallCategory = stall.getAttribute('data-category');
      const stallCuisine = stall.getAttribute('data-cuisine');
      
      let shouldShow = true;
      
      // filter by category if any category is selected
      if (selectedCategories.length > 0) {
        shouldShow = shouldShow && selectedCategories.includes(stallCategory);
      }
      
      // filter by cuisine if any cuisine is selected
      if (selectedCuisines.length > 0) {
        shouldShow = shouldShow && selectedCuisines.includes(stallCuisine);
      }
      
      // show or hide the stall
      if (shouldShow) {
        stall.parentElement.style.display = 'block';
      } else {
        stall.parentElement.style.display = 'none';
      }
    });
  }
  
  filterStalls();
});