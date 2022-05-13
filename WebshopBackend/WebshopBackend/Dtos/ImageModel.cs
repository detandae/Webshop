using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Dtos
{
    public class ImageModel
    {
        public string id { get; set; }
        public IFormFile image { get; set; }

    }
}
