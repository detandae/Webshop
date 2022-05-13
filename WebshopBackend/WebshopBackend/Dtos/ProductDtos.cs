using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Models;

namespace WebshopBackend.Dtos
{
    public class ProductDtos
    {
            public long id { get; set; }
            public string ProductName { get; set; }
            public int s { get; set; }
            public int m { get; set; }
            public int l { get; set; }
            public int xl { get; set; }
            public int xxl { get; set; }

            public string imageURL { get; set; }
            public double BasePrice { get; set; }
            public double Action { get; set; }
            public string Description { get; set; }
            public string Producer { get; set; }
            public string Color { get; set; }
            public string Material { get; set; }

            public bool highlighted { get; set; }

            public string creationtime { get; set; }
            public long categoryid { get; set; }
            public  Category category { get; set; }
        
    }
}
