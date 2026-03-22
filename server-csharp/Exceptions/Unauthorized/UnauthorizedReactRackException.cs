using Exceptions.ReactRack;
using Microsoft.AspNetCore.Http;

namespace Exceptions.Unauthorized
{
    public sealed class UnauthorizedReactRackException(string message) : ReactRackException(message, StatusCodes.Status401Unauthorized) { }
}
