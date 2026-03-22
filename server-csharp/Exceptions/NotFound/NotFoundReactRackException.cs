using Exceptions.ReactRack;
using Microsoft.AspNetCore.Http;

namespace Exceptions.NotFound
{
    public sealed class NotFoundReactRackException(string message) : ReactRackException(message, StatusCodes.Status404NotFound) { }
}
