using Exceptions.ReactRack;
using Microsoft.AspNetCore.Http;

namespace Exceptions.InternalServer
{
    public sealed class InternalServerReactRackException(string message) : ReactRackException(message, StatusCodes.Status500InternalServerError) { }
}
