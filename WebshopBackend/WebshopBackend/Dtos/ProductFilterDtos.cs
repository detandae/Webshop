using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Dtos
{
    public class ProductFilterDtos
    {
        public string Sex { get; set; }
        public string Sizes { get; set; }
        public string ProductType { get; set; }
        public double MinPrice { get; set; }
        public double MaxPrice { get; set; }
        public int PageNumber { get; set; }
    }
}
