using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Models;

namespace WebshopBackend.Dtos
{
    public class OrderDtos
    {
        public User user { get; set; }
        public Adress adress { get; set; }
        public ProductInCart[] productincarts { get; set; }
        public short paymentMethod { get; set; }
        public string orderTime { get; set; }
    }
}
