using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Models;

namespace WebshopBackend.Context
{

    
    public class WebshopContext : DbContext
    {
        public DbSet<Adress> Adresses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductInCart> ProductInCarts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Category> Categorys { get; set; }

        public WebshopContext() { }
        public WebshopContext(DbContextOptions<WebshopContext> options)
               : base(options)
        {
        }

        public bool IsChanged()
        {
            return false;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(MyConfiguration.Configuration.GetConnectionString("DefaultConnection"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Adress>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Street);
                entity.Property(e => e.City);
                entity.Property(e => e.Country);
                entity.Property(e => e.Zip);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username);
                entity.Property(e => e.FirstName);
                entity.Property(e => e.LastName);
                entity.Property(e => e.Email);
                entity.Property(e => e.Random);        
                entity.Property(e => e.PasswordHash);
                entity.Property(e => e.PasswordSalt);
                entity.HasOne(c => c.Adress).WithOne(p => p.User).HasForeignKey<User>(c => c.AdressId);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.category);
                entity.Property(e => e.sex);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.ProductName);
                entity.Property(e => e.imageURL);

                entity.Property(e => e.s);
                entity.Property(e => e.m);
                entity.Property(e => e.l);
                entity.Property(e => e.xl);
                entity.Property(e => e.xxl);
                entity.Property(e => e.sold);
                entity.Property(e => e.BasePrice);
                entity.Property(e => e.Action);

                entity.Property(e => e.Description);
                entity.Property(e => e.Producer);
                entity.Property(e => e.Color);
                entity.Property(e => e.Material);
                entity.Property(e => e.highlighted);
                entity.Property(e => e.creationtime);

                entity.HasOne(c => c.category).WithMany().HasForeignKey(c => c.categoryid);
            });



            modelBuilder.Entity<ProductInCart>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Size);
                entity.Property(e => e.Amount);

                entity.HasOne<Product>(c => c.Product).WithMany().HasForeignKey(c => c.ProductId);
                entity.HasOne<User>(c => c.User).WithMany(u => u.ProductInCarts).HasForeignKey(c => c.UserId);
                entity.HasOne<Order>(c => c.Order).WithMany(o =>o.productincarts).HasForeignKey(c => c.OrderId);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.PaymentMethod);
                entity.Property(e => e.OrderTime);
                entity.HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId);
                entity.HasOne(c => c.Adress).WithOne().HasForeignKey<Order>(c => c.AdressId);
            });

            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id =1,
                category = "Jackets",
                sex = "male"
            });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 2,
               category = "Shirts",
               sex = "male"
           });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 3,
               category = "Jeans",
               sex = "male"
           });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 4,
               category = "Suits",
               sex = "male"
           });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 5,
               category = "T-Shirts",
               sex = "male"
           });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 6,
               category = "Bags",
               sex = "male"
           });
            modelBuilder.Entity<Category>().HasData(
           new Category
           {
               id = 7,
               category = "Accessories",
               sex = "male"
           });

            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    id = 8,
                    category = "Jackets",
                    sex = "female"
                });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 9,
                category = "Shirts",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 10,
                category = "Jeans",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 11,
                category = "T_Shirts",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 12,
                category = "Skirts",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 13,
                category = "Blazers",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 14,
                category = "Bags",
                sex = "female"
            });
            modelBuilder.Entity<Category>().HasData(
            new Category
            {
                id = 15,
                category = "Accessories",
                sex = "female"
            });

            modelBuilder.Entity<Adress>().HasData(
            new Adress
            {
                Id = 1,
                Street = "Kossuth u 19",
                City = "Kecskemét",
                Country = "Hungary",
                Zip = 6000,
            });



            modelBuilder.Entity<Adress>().HasData(
            new Adress
            {
                Id = 2,
                Street = "Szechenyi u 1",
                City = "Budapest",
                Country = "Hungary",
                Zip = 1117,
            });
        }
    }
}
