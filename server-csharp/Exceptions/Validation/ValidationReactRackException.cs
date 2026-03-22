using Exceptions.ReactRack;
using Microsoft.AspNetCore.Http;

namespace Exceptions.Validation
{
    public sealed class ValidationReactRackException(string message) : ReactRackException(message, StatusCodes.Status400BadRequest) { }

}
