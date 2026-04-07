namespace ReactRack.Infrastructure.Configuration;

internal static class EnvVarHelper
{
    internal static string? Unquote(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        var v = value.Trim();
        if (v.Length >= 2 &&
            ((v[0] == '\'' && v[^1] == '\'') || (v[0] == '"' && v[^1] == '"')))
        {
            return v[1..^1].Trim();
        }

        return v;
    }
}
