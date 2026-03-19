document.addEventListener('DOMContentLoaded', function() {

  // ── CV Dropdown ──
  const cvDropdown = document.querySelector('.cv-dropdown');
  const cvBtn = document.querySelector('.cv-dropdown-btn');

  if (cvBtn && cvDropdown) {
    cvBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      cvDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      cvDropdown.classList.remove('open');
    });
  }

});