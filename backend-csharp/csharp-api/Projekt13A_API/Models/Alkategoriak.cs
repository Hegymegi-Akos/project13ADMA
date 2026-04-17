using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Alkategoriak
{
    public ushort Id { get; set; }

    public byte KategoriaId { get; set; }

    public string Slug { get; set; } = null!;

    public string Nev { get; set; } = null!;

    public string? Kep { get; set; }

    public sbyte? Sorrend { get; set; }

    public virtual Kategoriak Kategoria { get; set; } = null!;

    public virtual ICollection<Termekek> Termekeks { get; set; } = new List<Termekek>();
}
