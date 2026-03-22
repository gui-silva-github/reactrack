using System.Diagnostics;

namespace ReactRack.Infrastructure.Middleware
{
    public sealed class RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            logger.LogInformation("Incoming request: {Method} {Path}", context.Request.Method, context.Request.Path);
            await next(context);

            stopwatch.Stop();
            logger.LogInformation(
                "Outgoing response: {StatusCode} in {ElapsedMilliseconds}ms",
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds);
        }
    }
}
