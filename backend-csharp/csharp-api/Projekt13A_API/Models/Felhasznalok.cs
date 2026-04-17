using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Felhasznalok
{
    public ulong Id { get; set; }

    public string Felhasznalonev { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string JelszoHash { get; set; } = null!;

    public string? Keresztnev { get; set; }

    public string? Vezeteknev { get; set; }

    public string? Telefon { get; set; }

    public string? Iranyitoszam { get; set; }

    public string? Varos { get; set; }

    public string? Cim { get; set; }

    public bool? Admin { get; set; }

    public bool? EmailMegerositve { get; set; }

    public DateTime Regisztralt { get; set; }

    public DateTime Frissitve { get; set; }

    public virtual ICollection<Kosar> Kosars { get; set; } = new List<Kosar>();

    public virtual ICollection<Rendelesek> Rendeléseks { get; set; } = new List<Rendelesek>();

    public virtual ICollection<TermekVelemenyek> TermekVelemenyeks { get; set; } = new List<TermekVelemenyek>();
}
