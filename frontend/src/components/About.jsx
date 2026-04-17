import React from 'react';

const team = [
  { id: 'martin', name: 'Kamecz Martin', role: 'Fejleszto', image: '/images/Martin.jpg', bio: 'Frontend fejleszto, a felhasznaloi elmeny es a teljesitmeny rajongoja.' },
  { id: 'akos', name: 'Hegymegi-Kiss Akos', role: 'Designer', image: '/images/Akos.jpg', bio: 'UI/UX tervezo, aki a reszponziv es ertheto feluleteket szereti letrehozni.' },
  { id: 'dominika', name: 'Peterffy Dominika', role: 'Projektvezeto', image: '/images/Dominika.jpg', bio: 'Projektvezeto, fokuszban a hataridok es a csapat osszhangja.' }
];

const About = () => (
  <main className="container page">
    <h1 className="page-title">Rolunk</h1>
    <section className="ui-card" style={{ marginBottom: 16 }}>
      <p className="kezdolapp">A 2024-ben alapitott webshop azon elhivatottsaggal jott letre, hogy allatbaratoknak megbizhato es praktikus online vasarlasi lehetoseget kinaljon.</p>
      <p className="kezdolapp">Celunk, hogy ugyfeleinknek a legjobb minoseget kinaljuk a legjobb aron. Valasszon tobb mint 13000 termekunkbol kedvence szamara!</p>
    </section>
    <section className="ui-card">
      <h2 className="section-title">Csapatunk</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20 }}>
        {team.map(member => (
          <div key={member.id} style={{ textAlign:'center', padding:20 }}>
            <img src={member.image} alt={member.name} style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', marginBottom:12 }} />
            <h3>{member.name}</h3>
            <p style={{ color:'var(--accent-primary)', fontWeight:700 }}>{member.role}</p>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default About;
