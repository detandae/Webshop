using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Models
{
    public class Category
    {
        [Key]
        public long id { get; set; }
        public string category { get; set; }
        public string sex { get; set; }
    }
}
