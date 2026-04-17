using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Projekt13A_API.Models;

public partial class KisallatWebshopContext : DbContext
{
    public KisallatWebshopContext()
    {
    }
    public KisallatWebshopContext(DbContextOptions<KisallatWebshopContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Alkategoriak> Alkategoriak { get; set; }

    public virtual DbSet<Felhasznalok> Felhasznalok { get; set; }

    public virtual DbSet<Kategoriak> Kategoriak { get; set; }

    public virtual DbSet<Kosar> Kosar { get; set; }

    public virtual DbSet<RendelesTetelek> RendelesTetelek { get; set; }

    public virtual DbSet<Rendelesek> Rendelesek { get; set; }

    public virtual DbSet<TermekVelemenyek> TermekVelemenyek { get; set; }

    public virtual DbSet<Termekek> Termekek { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseMySQL("server=localhost;database=kisallat_webshop;user=root;password=");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alkategoriak>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("alkategoriak");

            entity.HasIndex(e => new { e.KategoriaId, e.Slug }, "egyedi_slug").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("smallint(5) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.KategoriaId)
                .HasColumnType("tinyint(3) unsigned")
                .HasColumnName("kategoria_id");
            entity.Property(e => e.Kep)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("kep");
            entity.Property(e => e.Nev)
                .HasMaxLength(100)
                .HasColumnName("nev");
            entity.Property(e => e.Slug)
                .HasMaxLength(50)
                .HasColumnName("slug");
            entity.Property(e => e.Sorrend)
                .HasDefaultValueSql("'0'")
                .HasColumnType("tinyint(4)")
                .HasColumnName("sorrend");

            entity.HasOne(d => d.Kategoria).WithMany(p => p.Alkategoriak)
                .HasForeignKey(d => d.KategoriaId)
                .HasConstraintName("alkategoriak_ibfk_1");
        });

        modelBuilder.Entity<Felhasznalok>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("felhasznalok");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.Felhasznalonev, "felhasznalonev").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.Admin)
                .HasDefaultValueSql("'0'")
                .HasColumnName("admin");
            entity.Property(e => e.Cim)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("cim");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.EmailMegerositve)
                .HasDefaultValueSql("'0'")
                .HasColumnName("email_megerositve");
            entity.Property(e => e.Felhasznalonev)
                .HasMaxLength(50)
                .HasColumnName("felhasznalonev");
            entity.Property(e => e.Frissitve)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("frissitve");
            entity.Property(e => e.Iranyitoszam)
                .HasMaxLength(20)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("iranyitoszam");
            entity.Property(e => e.JelszoHash)
                .HasMaxLength(255)
                .HasColumnName("jelszo_hash");
            entity.Property(e => e.Keresztnev)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("keresztnev");
            entity.Property(e => e.Regisztralt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("regisztralt");
            entity.Property(e => e.Telefon)
                .HasMaxLength(30)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("telefon");
            entity.Property(e => e.Varos)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("varos");
            entity.Property(e => e.Vezeteknev)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("vezeteknev");
        });

        modelBuilder.Entity<Kategoriak>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("kategoriak");

            entity.HasIndex(e => e.Slug, "slug").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("tinyint(3) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.Kep)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("kep");
            entity.Property(e => e.Nev)
                .HasMaxLength(50)
                .HasColumnName("nev");
            entity.Property(e => e.Slug)
                .HasMaxLength(30)
                .HasColumnName("slug");
            entity.Property(e => e.Sorrend)
                .HasDefaultValueSql("'0'")
                .HasColumnType("tinyint(4)")
                .HasColumnName("sorrend");
        });

        modelBuilder.Entity<Kosar>(entity =>
        {
            entity.HasKey(e => new { e.FelhasznaloId, e.TermekId }).HasName("PRIMARY");

            entity.ToTable("kosar");

            entity.HasIndex(e => e.TermekId, "termek_id");

            entity.Property(e => e.FelhasznaloId)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("felhasznalo_id");
            entity.Property(e => e.TermekId)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("termek_id");
            entity.Property(e => e.Hozzaadva)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("hozzaadva");
            entity.Property(e => e.Mennyiseg)
                .HasDefaultValueSql("'1'")
                .HasColumnType("smallint(5) unsigned")
                .HasColumnName("mennyiseg");

            entity.HasOne(d => d.Felhasznalo).WithMany(p => p.Kosars)
                .HasForeignKey(d => d.FelhasznaloId)
                .HasConstraintName("kosar_ibfk_1");

            entity.HasOne(d => d.Termek).WithMany(p => p.Kosars)
                .HasForeignKey(d => d.TermekId)
                .HasConstraintName("kosar_ibfk_2");
        });

        modelBuilder.Entity<RendelesTetelek>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("rendeles_tetelek");

            entity.HasIndex(e => e.RendelesId, "rendeles_id");

            entity.HasIndex(e => e.TermekId, "termek_id");

            entity.Property(e => e.Id)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.Ar)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("ar");
            entity.Property(e => e.Mennyiseg)
                .HasColumnType("smallint(5) unsigned")
                .HasColumnName("mennyiseg");
            entity.Property(e => e.RendelesId)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("rendeles_id");
            entity.Property(e => e.TermekId)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("termek_id");
            entity.Property(e => e.TermekNev)
                .HasMaxLength(255)
                .HasColumnName("termek_nev");

            entity.HasOne(d => d.Rendeles).WithMany(p => p.RendelesTeteleks)
                .HasForeignKey(d => d.RendelesId)
                .HasConstraintName("rendeles_tetelek_ibfk_1");

            entity.HasOne(d => d.Termek).WithMany(p => p.RendelesTeteleks)
                .HasForeignKey(d => d.TermekId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("rendeles_tetelek_ibfk_2");
        });

        modelBuilder.Entity<Rendelesek>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("rendelések");

            entity.HasIndex(e => e.FelhasznaloId, "felhasznalo_id");

            entity.HasIndex(e => e.RendelésSzam, "rendelés_szam").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.FelhasznaloId)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("felhasznalo_id");
            entity.Property(e => e.FizetesiMod)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("fizetesi_mod");
            entity.Property(e => e.Frissitve)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("frissitve");
            entity.Property(e => e.Letrehozva)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("letrehozva");
            entity.Property(e => e.Megjegyzes)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("megjegyzes");
            entity.Property(e => e.Osszeg)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("osszeg");
            entity.Property(e => e.RendelésSzam)
                .HasMaxLength(30)
                .HasColumnName("rendelés_szam");
            entity.Property(e => e.Statusz)
                .HasDefaultValueSql("'''új'''")
                .HasColumnType("enum('új','feldolgozás','fizetve','kész','stornó')")
                .HasColumnName("statusz");
            entity.Property(e => e.SzallitasiCim)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("szallitasi_cim");
            entity.Property(e => e.SzallitasiIrsz)
                .HasMaxLength(20)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("szallitasi_irsz");
            entity.Property(e => e.SzallitasiMod)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("szallitasi_mod");
            entity.Property(e => e.SzallitasiNev)
                .HasMaxLength(200)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("szallitasi_nev");
            entity.Property(e => e.SzallitasiVaros)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("szallitasi_varos");

            entity.HasOne(d => d.Felhasznalo).WithMany(p => p.Rendeléseks)
                .HasForeignKey(d => d.FelhasznaloId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("rendelések_ibfk_1");
        });

        modelBuilder.Entity<TermekVelemenyek>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("termek_velemenyek");

            entity.HasIndex(e => e.FelhasznaloId, "felhasznalo_id");

            entity.HasIndex(e => e.Ertekeles, "idx_ertekeles");

            entity.HasIndex(e => e.TermekId, "idx_termek");

            entity.Property(e => e.Id)
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.Cim)
                .HasMaxLength(150)
                .HasColumnName("cim");
            entity.Property(e => e.Datum)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("datum");
            entity.Property(e => e.Elfogadva)
                .HasDefaultValueSql("'1'")
                .HasColumnName("elfogadva");
            entity.Property(e => e.Ellenorzott)
                .HasDefaultValueSql("'0'")
                .HasColumnName("ellenorzott");
            entity.Property(e => e.Ertekeles)
                .HasColumnType("tinyint(3) unsigned")
                .HasColumnName("ertekeles");
            entity.Property(e => e.FelhasznaloId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("bigint(20) unsigned")
                .HasColumnName("felhasznalo_id");
            entity.Property(e => e.SegitettIgen)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(10) unsigned")
                .HasColumnName("segitett_igen");
            entity.Property(e => e.SegitettNem)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(10) unsigned")
                .HasColumnName("segitett_nem");
            entity.Property(e => e.TermekId)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("termek_id");
            entity.Property(e => e.Velemeny)
                .HasColumnType("text")
                .HasColumnName("velemeny");
            entity.Property(e => e.VendeqNev)
                .HasMaxLength(100)
                .HasDefaultValueSql("'''Névtelen vásárló'''")
                .HasColumnName("vendeq_nev");

            entity.HasOne(d => d.Felhasznalo).WithMany(p => p.TermekVelemenyeks)
                .HasForeignKey(d => d.FelhasznaloId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("termek_velemenyek_ibfk_2");

            entity.HasOne(d => d.Termek).WithMany(p => p.TermekVelemenyeks)
                .HasForeignKey(d => d.TermekId)
                .HasConstraintName("termek_velemenyek_ibfk_1");
        });

        modelBuilder.Entity<Termekek>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("termekek");

            entity.HasIndex(e => e.AlkategoriaId, "alkategoria_id");

            entity.HasIndex(e => e.Slug, "egyedi_slug").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("id");
            entity.Property(e => e.AkciosAr)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(10) unsigned")
                .HasColumnName("akcios_ar");
            entity.Property(e => e.Aktiv)
                .HasDefaultValueSql("'1'")
                .HasColumnName("aktiv");
            entity.Property(e => e.AlkategoriaId)
                .HasColumnType("smallint(5) unsigned")
                .HasColumnName("alkategoria_id");
            entity.Property(e => e.Ar)
                .HasColumnType("int(10) unsigned")
                .HasColumnName("ar");
            entity.Property(e => e.FoKep)
                .HasMaxLength(255)
                .HasColumnName("fo_kep");
            entity.Property(e => e.Frissitve)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("frissitve");
            entity.Property(e => e.Keszlet)
                .HasDefaultValueSql("'999'")
                .HasColumnType("int(10) unsigned")
                .HasColumnName("keszlet");
            entity.Property(e => e.Leiras)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("leiras");
            entity.Property(e => e.Letrehozva)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("letrehozva");
            entity.Property(e => e.Nev)
                .HasMaxLength(255)
                .HasColumnName("nev");
            entity.Property(e => e.RovidLeiras)
                .HasMaxLength(500)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("rovid_leiras");
            entity.Property(e => e.Slug).HasColumnName("slug");
            entity.Property(e => e.TobbiKep)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("tobbi_kep");

            entity.HasOne(d => d.Alkategoria).WithMany(p => p.Termekeks)
                .HasForeignKey(d => d.AlkategoriaId)
                .HasConstraintName("termekek_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
