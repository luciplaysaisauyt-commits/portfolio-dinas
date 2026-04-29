 (function () {
    function initNBTabs() {
      var tabs = document.querySelectorAll('.nb-tab');
      var panels = document.querySelectorAll('.nb-tab-panel');

      if (!tabs.length || !panels.length) return;

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-nbtab');

          tabs.forEach(function (item) {
            item.classList.remove('active');
          });

          tab.classList.add('active');

          panels.forEach(function (panel) {
            if (panel.id === 'nbtab-' + target) {
              panel.classList.remove('nb-tab-panel--hidden');
            } else {
              panel.classList.add('nb-tab-panel--hidden');
            }
          });
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNBTabs);
    } else {
      initNBTabs();
    }
  })();
