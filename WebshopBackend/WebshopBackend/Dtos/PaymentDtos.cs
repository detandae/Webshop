using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Dtos
{
    public class PaymentDtos
    {
        public double totalPrice { get; set; }
        public string connectionId { get; set; }
    }
}
