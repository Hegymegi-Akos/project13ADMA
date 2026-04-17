using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Kategoriak
{
    public byte Id { get; set; }

    public string Slug { get; set; } = null!;

    public string Nev { get; set; } = null!;

    public string? Kep { get; set; }

    public sbyte? Sorrend { get; set; }

    public virtual ICollection<Alkategoriak> Alkategoriak { get; set; } = new List<Alkategoriak>();
}
