using System;
using System.Collections.Generic;

namespace Projekt13A_API.Models;

public partial class RendelesTetelek
{
    public ulong Id { get; set; }

    public ulong RendelesId { get; set; }

    public uint TermekId { get; set; }

    public string TermekNev { get; set; } = null!;

    public uint Ar { get; set; }

    public ushort Mennyiseg { get; set; }

    public virtual Rendelesek Rendeles { get; set; } = null!;

    public virtual Termekek Termek { get; set; } = null!;
}
