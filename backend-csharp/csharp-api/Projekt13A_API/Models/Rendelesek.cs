using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Rendelesek
{
    public ulong Id { get; set; }

    public ulong FelhasznaloId { get; set; }

    public string RendelésSzam { get; set; } = null!;

    public string? Statusz { get; set; }

    public uint Osszeg { get; set; }

    public string? SzallitasiMod { get; set; }

    public string? FizetesiMod { get; set; }

    public string? Megjegyzes { get; set; }

    public string? SzallitasiNev { get; set; }

    public string? SzallitasiCim { get; set; }

    public string? SzallitasiVaros { get; set; }

    public string? SzallitasiIrsz { get; set; }

    public DateTime Letrehozva { get; set; }

    public DateTime Frissitve { get; set; }

    public virtual Felhasznalok Felhasznalo { get; set; } = null!;

    public virtual ICollection<RendelesTetelek> RendelesTeteleks { get; set; } = new List<RendelesTetelek>();
}
