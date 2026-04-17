# C# Web API (Swagger)

Ez a mappa a kuldott C# API projektet tartalmazza:
- `csharp-api/Projekt13A_API.sln`
- `csharp-api/Projekt13A_API/Projekt13A_API.csproj`

## Inditas

```powershell
dotnet restore csharp-api\Projekt13A_API.sln
dotnet run --project csharp-api\Projekt13A_API\Projekt13A_API.csproj --urls http://localhost:5156
```

## Swagger

- Swagger UI: `http://localhost:5156/swagger/index.html`
- OpenAPI JSON: `http://localhost:5156/swagger/v1/swagger.json`

## Adatbazis kapcsolat

A kapcsolat itt allithato:
- `csharp-api/Projekt13A_API/appsettings.json`
- `ConnectionStrings:MySql`

Alapertelmezett:
`server=localhost;database=kisallat_webshop;uid=root;password=`

## Frontend atallitas (opcionalis)

Ha a React frontend a C# API-t hasznalja, a gyoker `.env` fajlban ezt allitsd:

`VITE_API_URL=http://localhost:5156/api`
