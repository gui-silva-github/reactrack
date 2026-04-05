using Exceptions.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging.Abstractions;
using ReactRack.Filters;
using Xunit;

namespace ReactRack.Tests.Filters;

public sealed class GlobalExceptionFilterTests
{
    [Fact]
    public void OnException_WhenReactRackException_ShouldMapStatusCodeAndMessage()
    {
        var filter = new GlobalExceptionFilter(new NullLogger<GlobalExceptionFilter>());
        var actionContext = new ActionContext(
            new DefaultHttpContext(),
            new RouteData(),
            new ActionDescriptor());
        var context = new ExceptionContext(actionContext, [])
        {
            Exception = new ValidationReactRackException("Falha de validação")
        };

        filter.OnException(context);

        var result = Assert.IsType<ObjectResult>(context.Result);
        Assert.Equal(400, result.StatusCode);
        Assert.True(context.ExceptionHandled);
    }
}
