using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace WebshopBackend.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Random { get; set; }

        public long AdressId { get; set; }
        [ForeignKey("AdressId")]
        public virtual Adress Adress { get; set; }

        public virtual ICollection<ProductInCart> ProductInCarts { get; set; }

        [Column(TypeName = "varbinary(1024)")]
        public byte[] PasswordHash { get; set; }
        [Column(TypeName = "varbinary(1024)")]
        public byte[] PasswordSalt { get; set; }
    }
}
