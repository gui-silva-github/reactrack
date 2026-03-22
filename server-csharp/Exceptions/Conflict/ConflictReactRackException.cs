using Exceptions.ReactRack;
using Microsoft.AspNetCore.Http;

namespace Exceptions.Conflict
{
    public sealed class ConflictReactRackException(string message) : ReactRackException(message, StatusCodes.Status409Conflict) { }
}
