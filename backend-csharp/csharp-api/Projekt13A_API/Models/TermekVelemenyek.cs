using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class TermekVelemenyek
{
    public ulong Id { get; set; }

    public uint TermekId { get; set; }

    public ulong? FelhasznaloId { get; set; }

    public string? VendeqNev { get; set; }

    public byte Ertekeles { get; set; }

    public string Cim { get; set; } = null!;

    public string Velemeny { get; set; } = null!;

    public uint? SegitettIgen { get; set; }

    public uint? SegitettNem { get; set; }

    public bool? Ellenorzott { get; set; }

    public bool? Elfogadva { get; set; }

    public DateTime Datum { get; set; }

    public virtual Felhasznalok? Felhasznalo { get; set; }

    public virtual Termekek Termek { get; set; } = null!;
}
