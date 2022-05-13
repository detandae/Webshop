using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Models
{
    public class Adress
    {
        [Key]
        public long Id { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int Zip { get; set; }
        public User User { get; set; }
    }
}
