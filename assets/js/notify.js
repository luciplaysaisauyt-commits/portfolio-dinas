/* DIN Studio — единый нотификатор сайта → Telegram (личный чат).
 *
 * ВНИМАНИЕ: токен здесь виден в исходниках страницы (как и раньше в main.js).
 * Он уже публичный. Когда появится доступ к аккаунту Vercel этого проекта —
 * это можно перенести на сервер (api/notify.js) и спрятать токен.
 */
(function () {
  'use strict';

  var TOKEN = '8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4';
  var CHAT_ID = '1525265767'; // личный чат din studio bot
  var API = 'https://api.telegram.org/bot' + TOKEN + '/sendMessage';
  var TZ = 'America/Toronto';

  function send(text) {
    try {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        }),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function now() {
    try {
      return new Date().toLocaleString('ru-RU', { timeZone: TZ });
    } catch (e) {
      return new Date().toLocaleString('ru-RU');
    }
  }

  function device() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? '📱 Мобильный' : '🖥 Десктоп';
  }

  function valById(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ── 1. Визит (один раз за сессию вкладки) ── */
  function pingVisit() {
    var page = location.pathname + location.search;
    var ref = document.referrer ? esc(document.referrer) : 'прямой';
    var base =
      '👤 <b>Посетитель</b>\n\n' +
      '📄 Страница: <b>' + esc(page) + '</b>\n' +
      '↩️ Откуда: ' + ref + '\n' +
      '💻 Устройство: ' + device() + '\n' +
      '🌐 Язык: ' + esc(navigator.language || '—') + '\n';

    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (g) {
        var loc = [g.city, g.region, g.country_name].filter(Boolean).join(', ') || 'Неизвестно';
        var ip = g.ip ? ' (' + g.ip + ')' : '';
        send(base + '📍 Локация: ' + esc(loc) + esc(ip) + '\n🕐 Время: ' + esc(now()));
      })
      .catch(function () {
        send(base + '📍 Локация: недоступна\n🕐 Время: ' + esc(now()));
      });
  }

  try {
    if (!sessionStorage.getItem('din_visit_sent')) {
      sessionStorage.setItem('din_visit_sent', '1');
      pingVisit();
    }
  } catch (e) {
    pingVisit();
  }

  /* ── 2. Формы (делегирование → ловит и футер, который грузится позже) ── */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.id) return;

    if (f.id === 'theForm' || f.id === 'contactForm') {
      var chip = document.querySelector('.chip-btn.active');
      var name = (valById('firstName') + ' ' + valById('lastName')).trim() || '—';
      send(
        '✉️ <b>Новое сообщение с сайта</b>\n\n' +
        '👤 Имя: <b>' + esc(name) + '</b>\n' +
        '📧 Email: ' + esc(valById('email') || '—') + '\n' +
        '🏷 Интерес: ' + esc(chip ? (chip.dataset.val || chip.textContent.trim()) : '—') + '\n\n' +
        '💬 Сообщение:\n' + esc(valById('message') || '—') + '\n\n' +
        '📄 ' + esc(location.pathname) + ' · 🕐 ' + esc(now())
      );
    } else if (f.id === 'newsletterForm') {
      var email = valById('newsletterEmail') || (f.querySelector('input') || {}).value || '';
      if (!email) return;
      send(
        '🔔 <b>Новый подписчик</b>\n\n' +
        '📧 <b>' + esc(email.trim()) + '</b>\n' +
        '📄 ' + esc(location.pathname) + ' · 🕐 ' + esc(now())
      );
    }
  }, true);
})();
