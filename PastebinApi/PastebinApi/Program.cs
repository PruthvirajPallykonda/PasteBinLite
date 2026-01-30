using Microsoft.EntityFrameworkCore;
using PastebinApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core with Neon Postgres
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("https://pruthvirajpallykonda.github.io")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ❌ REMOVE HTTPS redirection (Railway already handles SSL)
// app.UseHttpsRedirection();

// ✅ USE CORS **BEFORE** Authorization (CRITICAL)
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

// 🚨 RAILWAY PORT BINDING (KEEP THIS)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

app.Run();
