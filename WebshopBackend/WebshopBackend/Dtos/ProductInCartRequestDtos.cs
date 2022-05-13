using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Dtos
{
    public class ProductInCartRequestDtos
    {
        public string username { get; set; }

        public string size { get; set; }
        public int amount { get; set; }

        public string productname { get; set; }
        public long productid { get; set; }
    }
}
