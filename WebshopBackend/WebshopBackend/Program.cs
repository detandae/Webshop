using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WebshopBackend.Context;
using WebshopBackend.Models;
using WebshopBackend.Services;

namespace WebshopBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();
            Task.Run(async () => {
                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;

                    await waitForDb(services);
                }
            }).Wait();
            host.Run();
        }


        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args).ConfigureLogging((context, logging) => {
                var env = context.HostingEnvironment;
                var config = context.Configuration.GetSection("Logging");
                logging.AddConfiguration(config);
                logging.AddConsole();
                logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Warning);
                logging.AddFilter("Microsoft.EntityFrameworkCore.Infrastructure", LogLevel.Warning);
            })
            .UseUrls("http://*:80", "https://*:8080")
                .UseStartup<Startup>();

        private static void CreateDatabaseModel()
        {
            using (var context = new WebshopContext())
            {
                bool exists = context.Database.EnsureCreated();
                if (exists)
                {
                    byte[] hash, salt;
                    UserService.CreatePasswordHash("WebshopAdmin1", out hash, out salt);

                    User admin = new User
                    {
                        Id = 1,
                        Username = "WebshopAdmin1",
                        FirstName = "Andras",
                        LastName = "Detari",
                        Email = "detariandras@gmail.com",
                        Role = "Admin",
                        Random = "asfqgo3kpqsovmnbjeuasd459csad",
                        AdressId=1,
                        PasswordHash = hash,
                        PasswordSalt = salt
                    };
                    context.Users.Add(admin);
                    context.SaveChanges();
                    User user = new User
                    {
                        Id = 2,
                        Username = "detandae",
                        FirstName = "Mr",
                        LastName = "Creedy",
                        Email = "detariandras@gmail.com",
                        Role = "User",
                        Random = "asfqgo3kpqsovmnbjeuasd459csad",
                        AdressId = 2,
                        PasswordHash = hash,
                        PasswordSalt = salt
                    };
                    //context.Users.Add(admin);
                    context.Users.Add(user);
                    context.SaveChanges();
                    var url = Path.Combine("images", "jacket.jpg");
                    for (int i = 1; i <= 100; i++)
                    {
                        var product = new Product
                        {
                            id = i,
                            ProductName = "example" + i,
                            s = 10,
                            m = 10,
                            l = 10,
                            xl = 10,
                            xxl = 10,
                            BasePrice = 1000,
                            Action = 0.1,
                            Description = "example",
                            Producer = "example",
                            Color = "example",
                            Material = "example",
                            highlighted =true,
                            creationtime=DateTime.Now,
                            categoryid = 1,
                            sold = 10,
                            imageURL = url
                        };
                        context.Products.Add(product);
                    }

                    var ProductInCart= new ProductInCart
                      {
                          Id = 1,
                          Size = "S",
                          Amount = 2,
                          UserId = 2,
                          ProductId = 1,
                      };
                    context.ProductInCarts.Add(ProductInCart);
                  

                }
                context.SaveChanges();
            }
        }

        private static async Task waitForDb(IServiceProvider services)
        {
            var maxAttemps = 60;
            var delay = 10000;

            for (int i = 0; i < maxAttemps; i++)
            {
                try
                {
                    CreateDatabaseModel();
                    return;
                }
                catch (Exception e)
                {
                }
                finally
                {
                    await Task.Delay(delay);
                }
            }
            // after a few attemps we give up
            throw new Exception("Database not started");
        }
    }
}
