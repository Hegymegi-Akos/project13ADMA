using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projekt13A_API.Models;

namespace Projekt13A_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FelhasznalokController : ControllerBase
    {
        private readonly KisallatWebshopContext _context;

        public FelhasznalokController(KisallatWebshopContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Felhasznalok>>> GetFelhasznalok()
        {
            // Jelszó kizárása automatikusan (EF Core projection)
            var felhasznalok = await _context.Felhasznalok
                .Select(f => new
                {
                    f.Id,
                    f.Felhasznalonev,
                    f.Email,
                    f.Keresztnev,
                    f.Vezeteknev,
                    f.Telefon,
                    f.Iranyitoszam,
                    f.Varos,
                    f.Cim,
                    f.Admin,
                    f.EmailMegerositve,
                    f.Regisztralt,
                    f.Frissitve
                })
                .ToListAsync();

            return Ok(felhasznalok);
        }

        // GET: api/Felhasznalok/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetFelhasznalo(ulong id)
        {
            var felhasznalo = await _context.Felhasznalok
                .Where(f => f.Id == id)
                .Select(f => new
                {
                    f.Id,
                    f.Felhasznalonev,
                    f.Email,
                    f.Keresztnev,
                    f.Vezeteknev,
                    f.Telefon,
                    f.Iranyitoszam,
                    f.Varos,
                    f.Cim,
                    f.Admin,
                    f.EmailMegerositve,
                    f.Regisztralt,
                    f.Frissitve
                })
                .FirstOrDefaultAsync();

            if (felhasznalo == null)
            {
                return NotFound();
            }

            return Ok(felhasznalo);
        }

        // POST: api/Felhasznalok (regisztráció)
        // Figyelem: élesben itt kell validálni, hash-elni a jelszót, email megerősítés stb.
        [HttpPost]
        public async Task<ActionResult<Felhasznalok>> PostFelhasznalo(Felhasznalok felhasznalo)
        {
            // Példa: ha van jelszó a bemenetben (DTO-ból), hash-elni kell!
            // Jelenleg feltételezzük, hogy a jelszo_hash már kész érkezik (biztonságos kliens oldalon vagy service-ben)

            if (await _context.Felhasznalok.AnyAsync(f => f.Email == felhasznalo.Email))
            {
                return BadRequest("Ez az email cím már foglalt.");
            }

            if (await _context.Felhasznalok.AnyAsync(f => f.Felhasznalonev == felhasznalo.Felhasznalonev))
            {
                return BadRequest("Ez a felhasználónév már foglalt.");
            }

            _context.Felhasznalok.Add(felhasznalo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFelhasznalo), new { id = felhasznalo.Id }, felhasznalo);
        }

        // PUT: api/Felhasznalok/5 (profil frissítés)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFelhasznalo(ulong id, Felhasznalok felhasznalo)
        {
            if (id != felhasznalo.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existing = await _context.Felhasznalok.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            // Csak bizonyos mezőket frissítünk (pl. jelszót ne lehessen simán PUT-tal változtatni)
            existing.Keresztnev = felhasznalo.Keresztnev;
            existing.Vezeteknev = felhasznalo.Vezeteknev;
            existing.Telefon = felhasznalo.Telefon;
            existing.Iranyitoszam = felhasznalo.Iranyitoszam;
            existing.Varos = felhasznalo.Varos;
            existing.Cim = felhasznalo.Cim;
            // existing.Admin = felhasznalo.Admin;  // ezt csak admin változtathatja!

            _context.Entry(existing).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FelhasznaloExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Felhasznalok/5
        // Figyelem: élesben ritkán törlünk felhasználót, inkább inaktiválunk!
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFelhasznalo(ulong id)
        {
            var felhasznalo = await _context.Felhasznalok.FindAsync(id);
            if (felhasznalo == null)
            {
                return NotFound();
            }

            _context.Felhasznalok.Remove(felhasznalo);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool FelhasznaloExists(ulong id) => _context.Felhasznalok.Any(e => e.Id == id);
    }
}
