
using Microsoft.EntityFrameworkCore;
using Projekt13A_API.Models;
using System;
using System.Text.Json.Serialization;

namespace Projekt13A_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var mysqlConnectionString = builder.Configuration.GetConnectionString("MySql");

            if (string.IsNullOrWhiteSpace(mysqlConnectionString))
            {
                throw new InvalidOperationException("Missing ConnectionStrings:MySql in appsettings.");
            }

            // Add services to the container.
            builder.Services.AddDbContext<KisallatWebshopContext>(option =>
            {
                option.UseMySQL(mysqlConnectionString);
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            var app = builder.Build();

            // Swagger legyen elérhető fejlesztésben és tesztelésnél is.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("Frontend");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
