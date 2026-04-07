using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactRack.Infrastructure.Configuration;
using ReactRack.Infrastructure.Email;
using ReactRack.Filters;
using ReactRack.Infrastructure.Middleware;
using ReactRack.Infrastructure.Persistence;
using ReactRack.Infrastructure.Repositories;
using ReactRack.Infrastructure.Security;
using ReactRack.Infrastructure.Settings.Jwt;
using ReactRack.Infrastructure.Settings.Smtp;
using ReactRack.UseCases.User;
using ReactRack.Infrastructure.Repositories.Interfaces;
using ReactRack.UseCases.Auth.Interfaces.Register;
using ReactRack.UseCases.Auth.Interfaces.Login;
using ReactRack.UseCases.Auth.Interfaces.SendVerifyOtp;
using ReactRack.UseCases.Auth.Interfaces.VerifyAccount;
using ReactRack.UseCases.Auth.Interfaces.SendResetOtp;
using ReactRack.UseCases.Auth.Interfaces.ResetPassword;
using ReactRack.UseCases.Auth.Interfaces.ValidateResetOtp;
using ReactRack.UseCases.User.Interfaces;
using ReactRack.Infrastructure.Security.Interfaces;
using ReactRack.Infrastructure.Email.Interfaces;
using ReactRack.UseCases.Auth.Register;
using ReactRack.UseCases.Auth.Login;
using ReactRack.UseCases.Auth.SendVerifyOtp;
using ReactRack.UseCases.Auth.VerifyAccount;
using ReactRack.UseCases.Auth.SendResetOtp;
using ReactRack.UseCases.Auth.ResetPassword;
using ReactRack.UseCases.Auth.ValidateResetOtp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));
builder.Services.PostConfigure<JwtOptions>(opts =>
{
    var secret = EnvVarHelper.Unquote(Environment.GetEnvironmentVariable("JWT_SECRET"));
    if (!string.IsNullOrWhiteSpace(secret))
    {
        opts.SecretKey = secret;
    }
});
builder.Services.PostConfigure<SmtpOptions>(opts =>
{
    var user = EnvVarHelper.Unquote(Environment.GetEnvironmentVariable("SMTP_USER"));
    var pass = EnvVarHelper.Unquote(Environment.GetEnvironmentVariable("SMTP_PASS"));
    var from = EnvVarHelper.Unquote(Environment.GetEnvironmentVariable("SENDER_EMAIL"));
    if (!string.IsNullOrWhiteSpace(user))
    {
        opts.Username = user;
    }

    if (!string.IsNullOrWhiteSpace(pass))
    {
        opts.Password = pass;
    }

    if (!string.IsNullOrWhiteSpace(from))
    {
        opts.FromEmail = from;
    }
});
builder.Services.AddDbContext<ReactRackDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Postgres")
        ?? throw new InvalidOperationException("Connection string 'Postgres' was not found.");
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRegisterUseCase, RegisterUseCase>();
builder.Services.AddScoped<ILoginUseCase, LoginUseCase>();
builder.Services.AddScoped<ISendVerifyOtpUseCase, SendVerifyOtpUseCase>();
builder.Services.AddScoped<IVerifyAccountUseCase, VerifyAccountUseCase>();
builder.Services.AddScoped<ISendResetOtpUseCase, SendResetOtpUseCase>();
builder.Services.AddScoped<IResetPasswordUseCase, ResetPasswordUseCase>();
builder.Services.AddScoped<IValidateResetOtpUseCase, ValidateResetOtpUseCase>();
builder.Services.AddScoped<IGetUserDataUseCase, GetUserDataUseCase>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<GlobalExceptionFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:4200",
                "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
var jwtSecret = EnvVarHelper.Unquote(Environment.GetEnvironmentVariable("JWT_SECRET"));
if (!string.IsNullOrWhiteSpace(jwtSecret))
{
    jwt.SecretKey = jwtSecret;
}

var signingKey = JwtSigningKeyFactory.Create(jwt.SecretKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = signingKey,
            IssuerSigningKeyResolver = (_, _, _, _) => new[] { signingKey }
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue("token", out var token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("JwtAuth");
                logger.LogDebug(
                    context.Exception,
                    "JWT authentication failed for {Path}",
                    context.HttpContext.Request.Path);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<GlobalExceptionFilter>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ReactRackDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<RequestResponseLoggingMiddleware>();
app.UseCors("FrontendCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => Results.Ok(new { success = true, message = "Servidor .NET rodando com PostgreSQL" }));

app.Run();

