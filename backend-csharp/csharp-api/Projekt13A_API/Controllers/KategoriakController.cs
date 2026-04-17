using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projekt13A_API.Models;
using System;

namespace KisallatWebshopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KategoriakController : ControllerBase
{
    private readonly KisallatWebshopContext _context;

    public KategoriakController(KisallatWebshopContext context)
    {
        _context = context;
    }

    // GET: api/Kategoriak
    // Visszaadja az összes kategóriát az alkategóriákkal együtt
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Kategoriak>>> GetKategoriak()
    {
        var kategoriak = await _context.Kategoriak
            .Include(k => k.Alkategoriak)
            .OrderBy(k => k.Sorrend)
            .ToListAsync();

        return Ok(kategoriak);
    }

    // GET: api/Kategoriak/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Kategoriak>> GetKategoria(byte id)
    {
        var kategoria = await _context.Kategoriak
            .Include(k => k.Alkategoriak)
            .FirstOrDefaultAsync(k => k.Id == id);

        if (kategoria == null)
        {
            return NotFound();
        }

        return Ok(kategoria);
    }

    // GET: api/Kategoriak/slug/kutyak
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<Kategoriak>> GetKategoriaBySlug(string slug)
    {
        var kategoria = await _context.Kategoriak
            .Include(k => k.Alkategoriak)
            .FirstOrDefaultAsync(k => k.Slug == slug);

        if (kategoria == null)
        {
            return NotFound();
        }

        return Ok(kategoria);
    }

    // POST: api/Kategoriak
    [HttpPost]
    public async Task<ActionResult<Kategoriak>> PostKategoria(Kategoriak kategoria)
    {
        _context.Kategoriak.Add(kategoria);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetKategoria), new { id = kategoria.Id }, kategoria);
    }

    // PUT: api/Kategoriak/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutKategoria(byte id, Kategoriak kategoria)
    {
        if (id != kategoria.Id)
        {
            return BadRequest("ID mismatch");
        }

        _context.Entry(kategoria).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!KategoriaExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Kategoriak/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteKategoria(byte id)
    {
        var kategoria = await _context.Kategoriak
            .Include(k => k.Alkategoriak)  // Ellenőrizni, ha vannak alkategóriák
            .FirstOrDefaultAsync(k => k.Id == id);

        if (kategoria == null)
        {
            return NotFound();
        }

        // Opcionális: ha vannak alkategóriák, ne töröljük, vagy logikát adj hozzá
        if (kategoria.Alkategoriak.Any())
        {
            return BadRequest("A kategóriához tartoznak alkategóriák, először töröld azokat.");
        }

        _context.Kategoriak.Remove(kategoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool KategoriaExists(byte id) => _context.Kategoriak.Any(e => e.Id == id);
}