using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class Kosar
{
    public ulong FelhasznaloId { get; set; }

    public uint TermekId { get; set; }

    public ushort Mennyiseg { get; set; }

    public DateTime Hozzaadva { get; set; }

    public virtual Felhasznalok Felhasznalo { get; set; } = null!;

    public virtual Termekek Termek { get; set; } = null!;
}
