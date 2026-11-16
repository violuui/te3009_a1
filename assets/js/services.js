/* Pawlidays: cost estimator (reads prices from the .price-row elements on the page) */
(function () {
  const form = document.getElementById('estimator-form');
  if (!form) return;
  const rows = [...document.querySelectorAll('.price-row[data-item]')];
  const $ = id => document.getElementById(id);
  const item = $('e-item'), size = $('e-size'), qty = $('e-qty'), dog2 = $('e-dog2'), ride = $('e-ride');
  const label = { daycare: 'Daycare', boarding: 'Boarding', grooming: 'Grooming', walking: 'Walking' };
  const units = { visit: 'visits', night: 'nights', session: 'sessions', walk: 'walks' };
  const rules = { daycare: [[10, .15], [5, .10]], boarding: [[7, .10]], walking: [[10, .10]], grooming: [] };
  const unitTxt = (u, q) => q === 1 ? u : units[u];
  const eur = n => '€' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  rows.forEach((r, i) => item.add(new Option(label[r.dataset.group] + ': ' + r.dataset.item, i)));
  function calc() {
    const r = rows[item.value], g = r.dataset.group;
    const q = Math.min(60, Math.max(1, parseInt(qty.value, 10) || 1));
    const price = +r.dataset[size.value];
    $('e-qty-label').textContent = 'How many ' + units[r.dataset.unit] + '?';
    ride.disabled = g === 'walking'; if (ride.disabled) ride.checked = false;
    $('e-ride-wrap').classList.toggle('is-off', ride.disabled);
    const sub = price * q;
    const rule = (rules[g].find(x => q >= x[0]) || [0, 0])[1];
    const disc = sub * rule;
    const dog = dog2.checked ? (sub - disc) * 0.8 : 0;
    const trips = g === 'boarding' ? 1 : q;
    const extra = ride.checked ? 10 * trips : 0;
    const total = sub - disc + dog + extra;
    const L = [[eur(price) + ' × ' + q + ' ' + unitTxt(r.dataset.unit, q), eur(sub)]];
    if (disc) L.push(['Package discount (' + Math.round(rule * 100) + '%)', '−' + eur(disc)]);
    if (dog) L.push(['Second dog (20% off)', eur(dog)]);
    if (extra) L.push(['Pick-up & drop-off × ' + trips, eur(extra)]);
    $('e-lines').innerHTML = L.map(l => '<li><span>' + l[0] + '</span><b>' + l[1] + '</b></li>').join('');
    $('e-total').textContent = eur(total);
  }
  form.addEventListener('input', calc); form.addEventListener('change', calc); calc();
  const hash = location.hash.slice(1);
  document.querySelectorAll('.sv-tabs a').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('.sv-tabs a').forEach(x => x.classList.toggle('active', x === a));
  }));
})();
