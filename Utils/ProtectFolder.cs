using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SampleWebsiteNETCore.Utils
{
    public class ProtectFolderOptions
    {
        public PathString Path { get; set; }
    }

    public class ProtectFolder
    {
        private readonly RequestDelegate _next;
        private readonly PathString _path;

        public ProtectFolder(RequestDelegate next, ProtectFolderOptions options)
        {
            _next = next;
            _path = options.Path;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (httpContext.Request.Path.StartsWithSegments(_path))
            {
                httpContext.Response.StatusCode = 401;
                return;
            }

            await _next(httpContext);
        }
    }

    public static class ProtectFolderExtensions
    {
        public static IApplicationBuilder UseProtectFolder(this IApplicationBuilder builder, ProtectFolderOptions options)
        {
            return builder.UseMiddleware<ProtectFolder>(options);
        }
    }
}
