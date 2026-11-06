document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('is-visible'));

  const ageGate = document.querySelector('[data-age-gate]');
  const ageContent = document.querySelector('[data-age-content]');
  const ageYes = document.querySelector('[data-age-yes]');
  const ageKey = 'musering-age-verified-v1';
  const unlockAgeGate = () => {
    if (ageGate) ageGate.hidden = true;
    if (ageContent) ageContent.hidden = false;
    try { localStorage.setItem(ageKey, 'yes'); } catch (_) {}
  };
  if (ageGate && ageContent) {
    try { if (localStorage.getItem(ageKey) === 'yes') unlockAgeGate(); } catch (_) {}
    if (ageYes) ageYes.addEventListener('click', unlockAgeGate);
  }

  const supportButton = document.querySelector('[data-open-support]');
  const supportPanel = document.querySelector('[data-support-options]');
  if (supportButton && supportPanel) {
    supportButton.addEventListener('click', () => {
      const open = supportPanel.classList.toggle('open');
      supportButton.setAttribute('aria-expanded', String(open));
      supportButton.textContent = open ? 'Hide support options' : 'Open support options';
      if (open) supportPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const inviteModal = document.getElementById('inviteModal');
  const openInvite = document.getElementById('openInvite');
  const closeInvite = document.getElementById('closeInvite');
  if (inviteModal && openInvite && closeInvite) {
    openInvite.addEventListener('click', () => inviteModal.showModal());
    closeInvite.addEventListener('click', () => inviteModal.close());
    inviteModal.addEventListener('click', event => {
      const rect = inviteModal.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) inviteModal.close();
    });
  }

  document.querySelectorAll('[data-checklist]').forEach(box => {
    const key = 'musering-' + box.id;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    box.querySelectorAll('input[type="checkbox"]').forEach((input, index) => {
      input.checked = saved.includes(index);
      input.addEventListener('change', () => {
        const values = [...box.querySelectorAll('input[type="checkbox"]')]
          .map((item, i) => item.checked ? i : null).filter(i => i !== null);
        localStorage.setItem(key, JSON.stringify(values));
      });
    });
  });
});
