using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SampleWebsiteNETCore.Models;

namespace SampleWebsiteNETCore.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public HomeController(IWebHostEnvironment environment)
        {
            this._hostingEnvironment = environment;
        }

        public IActionResult Index()
        {
            ScanVM model = new ScanVM
            {
                ClientID = "123",
                Name = "Test Name",
                Title = "Test Title",
                SelectedInterface = Request.Query.ContainsKey("InterfaceType") ? (string)Request.Query["InterfaceType"] : "",
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Index(ScanVM model)
        {
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, $"uploads\\{model.ClientID}");
            if (!Directory.Exists(uploads))
            {
                TempData["message"] = "Please create a scan document before saving.";
                return View("Index", model);
            }
            var colFiles = Directory.GetFiles(uploads, "*", SearchOption.AllDirectories);
            if (colFiles.Count() == 0)
            {
                TempData["message"] = "Please create a scan document before saving.";
                return View("Index", model);
            }

            string strScanFile = colFiles[0];
            //TODO: You now have model and scan file, save to database, etc.

            //Clean up scan files when done
            System.IO.File.Delete(strScanFile);

            TempData["message"] = "File saved correctly";

            return View();
        }

        [HttpPost]
        public IActionResult UploadFile(IFormFile file, string clientid)
        {
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, $"uploads\\{clientid}");

            if (!Directory.Exists(uploads))
                Directory.CreateDirectory(uploads);

            var colFiles = Directory.GetFiles(uploads, "*", SearchOption.AllDirectories);
            foreach (var strExistingFile in colFiles)
                System.IO.File.Delete(strExistingFile);

            if (file.Length > 0)
            {
                var filePath = Path.Combine(uploads, file.FileName);
                using FileStream fileStream = new FileStream(filePath, FileMode.Create);
                file.CopyTo(fileStream);
            }

            var docGuid = Guid.NewGuid();
            var fileInfo = new
            {
                filename = file.FileName,
                fileSize = file.Length
            };

            var response = new
            {
                info = fileInfo,
                uniqueId = docGuid.ToString(),
                uploadDate = DateTime.Now
            };

            return Ok(response);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult DownloadSetup()
        {
            var userAgent = Request.Headers["User-Agent"].ToString();
            if (userAgent.ToLower().Contains("mac os"))
            {
                return File("~/files/K1ScanService.pkg", "application/octet-stream", "K1ScanService.pkg");
            }
            else
            {
                return File("~/files/K1ScanService.msi", "application/octet-stream", "K1ScanService.msi");
            }
        }
    }
}
