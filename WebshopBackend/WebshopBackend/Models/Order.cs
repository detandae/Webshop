using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Models
{
    public class Order
    {
        [Key]
        public long Id { get; set; }

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public long AdressId { get; set; }
        [ForeignKey("AdressId")]
        public virtual Adress Adress { get; set; }

        public virtual ICollection<ProductInCart> productincarts { get; set; }

        public short PaymentMethod { get; set; }
        [DisplayFormat(DataFormatString = "yyyy.MM.dd HH:mm", ApplyFormatInEditMode = true)]
        [DataType(DataType.Time)]
        public DateTime OrderTime { get; set; }
    }
}
