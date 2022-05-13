using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Models;

namespace WebshopBackend.Dtos
{
    public class ProductInCartDto
    {
        public int id { get; set; }
        public string size { get; set; }
        public int amount { get; set; }
        public Product product { get; set; }
    }
}
