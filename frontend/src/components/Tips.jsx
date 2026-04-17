import React from 'react';

const tips = [
  { category: 'Kutya', title: 'Hogyan gondozd a kutyad szuret?', content: 'Rendszeres fesulkodes es furdes segit megelozni a csomok kialkulasat.' },
  { category: 'Macska', title: 'Macskaalom gondozasa', content: 'Hetente csereld az almot, hogy tiszta kornyezetet biztosits kedvencednek.' },
  { category: 'Madar', title: 'Madarak etetese', content: 'Kulonbozo magvak es gyumolcsok kombinacioja biztositja a kiegyensulyozott taplaalkozast.' },
  { category: 'Hal', title: 'Akvarium karbantartasa', content: 'Hetente csereld a viz egy reszet es tisztitsd meg a szurot.' },
  { category: 'Hullo', title: 'Hullok homerseklete', content: 'Biztosits megfelelo homerskkletet es UVB fenyt a hullok egeszsgehez.' },
  { category: 'Ragcsalo', title: 'Ragcsalok fogai', content: 'Kemeny eleseg es ragcsalnivalok segitenek a fogak kopasaban.' }
];

const Tips = () => (
  <div className="container page">
    <h1 className="page-title">Allatgondozasi Tippek</h1>
    <p style={{ marginBottom:24, color:'var(--text-secondary)' }}>Itt talalsz hasznos tanacsokat kedvenceid gondozasahoz.</p>
    <div className="responsive-card-grid">
      {tips.map((tip, i) => (
        <section key={i} className="ui-card">
          <h3>{tip.category}: {tip.title}</h3>
          <p style={{ color:'var(--text-secondary)' }}>{tip.content}</p>
        </section>
      ))}
    </div>
  </div>
);

export default Tips;
