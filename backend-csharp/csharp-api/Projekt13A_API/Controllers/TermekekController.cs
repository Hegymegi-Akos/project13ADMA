using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projekt13A_API.Models;
using System;

namespace Projekt13A_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermekekController : ControllerBase
    {
        private readonly KisallatWebshopContext _context;

        public TermekekController(KisallatWebshopContext context)
        {
            _context = context;
        }

        // GET: api/Termekek
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Termekek>>> GetTermekek()
        {
            return await _context.Termekek
                .Include(t => t.Alkategoria)
                .ToListAsync();
        }

        // GET: api/Termekek/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Termekek>> GetTermek(uint id)
        {
            var termek = await _context.Termekek.FindAsync(id);
            if (termek == null) return NotFound();
            return termek;
        }

        // POST: api/Termekek
        [HttpPost]
        public async Task<ActionResult<Termekek>> PostTermek(Termekek termek)
        {
            _context.Termekek.Add(termek);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTermek), new { id = termek.Id }, termek);
        }

        // PUT: api/Termekek/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTermek(uint id, Termekek termek)
        {
            if (id != termek.Id) return BadRequest();

            _context.Entry(termek).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TermekExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Termekek/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTermek(uint id)
        {
            var termek = await _context.Termekek.FindAsync(id);
            if (termek == null) return NotFound();

            _context.Termekek.Remove(termek);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TermekExists(uint id) => _context.Termekek.Any(e => e.Id == id);
    }
}
