using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Communication.Responses.API;
using Exceptions.ReactRack;

namespace ReactRack.Filters
{
    public sealed class GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger) : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;

            if (exception is ReactRackException reactRackException)
            {
                context.Result = new ObjectResult(new APIResponse(false, reactRackException.Message))
                {
                    StatusCode = reactRackException.StatusCode
                };
                context.ExceptionHandled = true;
                return;
            }

            logger.LogError(exception, "Unhandled exception");
            context.Result = new ObjectResult(new APIResponse(false, "Erro interno no servidor."))
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
            context.ExceptionHandled = true;
        }
    }
}
