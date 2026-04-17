using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Termekek
{
    public uint Id { get; set; }

    public ushort AlkategoriaId { get; set; }

    public string Nev { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? Leiras { get; set; }

    public string? RovidLeiras { get; set; }

    public uint Ar { get; set; }

    public uint? AkciosAr { get; set; }

    public uint? Keszlet { get; set; }

    public string FoKep { get; set; } = null!;

    public string? TobbiKep { get; set; }

    public bool? Aktiv { get; set; }

    public DateTime Letrehozva { get; set; }

    public DateTime Frissitve { get; set; }

    public virtual Alkategoriak Alkategoria { get; set; } = null!;

    public virtual ICollection<Kosar> Kosars { get; set; } = new List<Kosar>();

    public virtual ICollection<RendelesTetelek> RendelesTeteleks { get; set; } = new List<RendelesTetelek>();

    public virtual ICollection<TermekVelemenyek> TermekVelemenyeks { get; set; } = new List<TermekVelemenyek>();
}
