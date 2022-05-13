using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Models
{
    public class ProductInCart
    {
        [Key]
        public long Id { get; set; }
        public string Size { get; set; }
        public int  Amount { get; set; }


        public long ProductId { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public long? OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

    }
}
