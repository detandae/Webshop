using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;

using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using WebshopBackend.Services;
using WebshopBackend.Helper;
using WebshopBackend.Context;
using WebshopBackend.Dtos;
using WebshopBackend.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Web.Http;
using PayPal.Api;
using Microsoft.AspNetCore.SignalR;
using WebshopBackend.Hubs;

namespace WebshopBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        private WebshopContext _context;
        private IEmailService _emailService;
        private IPayPalService _payPalService;
        private IHubContext<NotificationHub> _hub;
        private IInMemoryDataService _inMemoryDataService;

        public OrderController(IMapper mapper, IEmailService emailService, IHubContext<NotificationHub> hub,
                   IOptions<AppSettings> appSettings, WebshopContext webshopContext, IPayPalService paypalService,IInMemoryDataService dataService)
        {
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _context = webshopContext;
            _emailService = emailService;
            _payPalService = paypalService;
            _hub = hub;
            _inMemoryDataService = dataService;
        }

        [HttpPost("CreateOrder")]
        public async Task<JsonResult> CreateOrder([FromBody]OrderDtos orderDto)
        {
            var username = orderDto.user.Username;
            var user = _context.Users.Where(x => x.Username == username).Include(x => x.Adress).FirstOrDefault();
            if (user != null)
            {
                Adress adress = new Adress();
                adress.Street = orderDto.adress.Street;
                adress.City = orderDto.adress.City;
                adress.Country = orderDto.adress.Country;
                adress.Zip = orderDto.adress.Zip;
                _context.Adresses.Add(adress);
                await _context.SaveChangesAsync();
                Models.Order order = new Models.Order();
                order.UserId = user.Id;
                order.Adress = adress;
                order.AdressId = adress.Id;
                order.OrderTime = DateTime.Parse(orderDto.orderTime);
                order.PaymentMethod = order.PaymentMethod;
                _context.Orders.Add(order);
                _context.SaveChanges();
                long id = order.Id; 
                foreach (var productInCart in orderDto.productincarts)
                {
                    var productInCartSaved = _context.ProductInCarts.Find(productInCart.Id);
                    productInCartSaved.OrderId = id;
                    var product = await _context.Products.FirstOrDefaultAsync(x => x.id == productInCartSaved.ProductId);
                    product =ChangeProductNumber(product, productInCartSaved);
                    _context.Update(productInCartSaved);
                    _context.Update(product);
                }
                await _context.SaveChangesAsync();
                _emailService.SendEmail("Your order has been saved!", "Webshop Order", user);
                var returnUserDto = _mapper.Map<UserDtos>(user);
                return new JsonResult(returnUserDto)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return new JsonResult(new
                {
                    message = "User not exists"
                })
                {
                    StatusCode = StatusCodes.Status404NotFound
                };
            }
        }

        private Product ChangeProductNumber(Product product,ProductInCart productIncart)
        {
            switch (productIncart.Size)
            {
                case "S":
                    product.s -= productIncart.Amount;
                    break;
                case "M":
                    product.m -= productIncart.Amount;
                    break;
                case "L":
                    product.l -= productIncart.Amount;
                    break;
                case "XL":
                    product.xl -= productIncart.Amount;
                    break;
                case "XXL":
                    product.xxl -= productIncart.Amount;
                    break;
            }
            product.sold += productIncart.Amount;
            return product;
        }

        [AllowAnonymous]
        [HttpPost("GetOrdersForUser")]
        public async Task<JsonResult> GetOrdersForUser([FromBody]UserDtos userDto)
        {
            var username = userDto.Username;
            var user = _context.Users.Where(x => x.Username == username).FirstOrDefault();
            if (user != null)
            {
                var orders = _context.Orders.Where(x => x.UserId == user.Id).Include(x => x.Adress).Include(x => x.productincarts).ThenInclude(y => y.Product).ToList();
                return new JsonResult(orders)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return new JsonResult(new
                {
                    message = "User not exists"
                })
                {
                    StatusCode = StatusCodes.Status404NotFound
                };
            }
        }


        [AllowAnonymous]
        [HttpPost("CreatePayment")]
        public async Task<JsonResult> CreatePayment([FromBody]PaymentDtos paymentDtos)
        {
            var Price = paymentDtos.totalPrice;
            if (Price <= 0)
            {
                return new JsonResult(new
                {
                    message = "Payment Price is not correct"
                })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }

            Payment result= await _payPalService.CreatePayment(Price);
            foreach (var link in result.links)
            {
                if (link.rel.Equals("approval_url"))
                {
                    _inMemoryDataService.SaveConnectionPair(result.id, paymentDtos.connectionId);
                    return new JsonResult(new
                    {
                        link = link.href
                    })
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
                }
            }
            return new JsonResult(new
            {
                message = "Api link not found"
            })
            {
                StatusCode = StatusCodes.Status404NotFound
            };
        }

        [AllowAnonymous]
        [HttpGet("Success")]
        public async Task<IActionResult> Executepayment(string paymentId,string token, string payerId)
        {
            try
            {
                string ConnectionId = _inMemoryDataService.RetrieveConnetionID(paymentId);
                if (_inMemoryDataService.CheckIfConnectionOpen(ConnectionId))
                {
                    Payment result = await _payPalService.ExecutePayment(payerId, paymentId);
                    await _hub.Clients.Client(ConnectionId).SendAsync("notificationdata", "Success");
                }
                else
                {
                    return await Task.Run(() =>
                    {
                        return View("~/Views/Failure.cshtml");
                    });
                }
            }
            catch (Exception e)
            {
                return await Task.Run(() =>
                {
                    return View("~/Views/Failure.cshtml");
                });
            }
            return await Task.Run(() =>
            {
                return View("~/Views/Success.cshtml");
            });
        }

        [AllowAnonymous]
        [HttpGet("Cancel")]
        public async Task<IActionResult> CancelPayment()
        {
            if (!String.IsNullOrEmpty(HttpContext.Request.Query["paymentId"]))
            {
                var paymentId = HttpContext.Request.Query["paymentId"];
                string connectionId;
                try
                {
                    string ConnectionId = _inMemoryDataService.RetrieveConnetionID(paymentId);
                    await _hub.Clients.Client(ConnectionId).SendAsync("notificationdata", "Cancel");
                }
                catch (Exception e)
                {
                    return await Task.Run(() =>
                    {
                        return View("~/Views/Failure.cshtml");
                    });
                }
            }
            return await Task.Run(() =>
            {
                return View("~/Views/Failure.cshtml");
            });
        }

        [AllowAnonymous]
        [HttpGet("Notification")]
        public async Task<IActionResult> Notification()
        {
            await _hub.Clients.All.SendAsync("notificationdata", "notification");
            return Ok();
        }

    }
}
