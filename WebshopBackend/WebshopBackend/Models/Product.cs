using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Models
{
    public class Product
    {
        [Key]
        public long id { get; set; }
        public string ProductName { get; set; }
        public int s { get; set; }
        public int m { get; set; }
        public int l { get; set; }
        public int xl { get; set; }
        public int xxl { get; set; }

        public long sold { get; set; }
        public string imageURL { get; set; }
        public double BasePrice { get; set; }
        public double Action { get; set; }
        public string Description { get; set; }
        public string Producer { get; set; }
        public string Color { get; set; }
        public string Material { get; set; }

        [Column(TypeName = "BIT")]
        public bool highlighted { get; set; }

        public DateTime creationtime { get; set; }

        public long categoryid { get; set; }
        [ForeignKey("categoryid")]
        public virtual Category category { get; set; }
    }
}
