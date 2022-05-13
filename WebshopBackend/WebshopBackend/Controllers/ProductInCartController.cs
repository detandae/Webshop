using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebshopBackend.Context;
using WebshopBackend.Dtos;
using WebshopBackend.Helper;
using WebshopBackend.Models;

namespace WebshopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductInCartController : ControllerBase
    {
        private WebshopContext _context;
        private IMapper _mapper;

        public ProductInCartController( WebshopContext biotechContext, IMapper mapper)
        {
            _context = biotechContext;
            _mapper = mapper;
        }

        // POST api/values
        [Authorize(Roles = Role.User)]
        [HttpPost]
        public async Task<JsonResult> AddProductToCart([FromBody] ProductInCartRequestDtos productInCartRequestDtos)
        {
            var username = productInCartRequestDtos.username;
            var userList = _context.Users.Where(x => x.Username == username).ToList();
            if (userList.Count == 0)
            {
                return new JsonResult(new { message = "User not exists" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                var user = userList.First();
                var productId = (long)productInCartRequestDtos.productid;
                var product = await _context.Products.FindAsync(productId);
                if (product == null)
                {
                    return new JsonResult(new { message = "Product not exists" })
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                }
                var productInCart = _mapper.Map<ProductInCart>(productInCartRequestDtos);
                productInCart.UserId = user.Id;
                var existingProductIncarts = _context.ProductInCarts.Where(x => x.UserId == productInCart.UserId && x.ProductId == productInCart.ProductId
                                                                       && x.Size == productInCart.Size).ToList();
                if (existingProductIncarts.Count >0)
                {
                    existingProductIncarts[0].Amount += productInCart.Amount;
                    _context.Update(existingProductIncarts[0]);

                }
                else
                {
                    _context.ProductInCarts.Add(productInCart);
                }
                _context.SaveChanges();
                return new JsonResult(productInCart)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
        }

        [Authorize(Roles = Role.User)]
        [HttpPost("GetUserCart")]
        public async Task<JsonResult> GetUserCart(UserDtos userDtos)
        {
            var username = userDtos.Username;
            var userList = _context.Users.Where(x => x.Username == username ).Include(x=>x.ProductInCarts).ThenInclude(y=>y.Product).ToList();
            if (userList.Count == 0)
            {
                return new JsonResult(new { message = "User not exists" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                var user = userList.First();
                var productsInCart = user.ProductInCarts.ToList();
                var ProductInCartDtosList = new List<ProductInCartDto>();
                foreach (var productInCart in productsInCart)
                {
                    if (productInCart.OrderId == null)
                    {
                        var ProductInCartDto = new ProductInCartDto();
                        ProductInCartDto.size = productInCart.Size;
                        ProductInCartDto.amount = productInCart.Amount;
                        ProductInCartDto.product = productInCart.Product;
                        ProductInCartDto.id = (int)productInCart.Id;

                        ProductInCartDtosList.Add(ProductInCartDto);
                    }
                }
                return new JsonResult(ProductInCartDtosList)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
        }

        [Authorize(Roles = Role.User)]
        [HttpPost("UpdateProductInCart")]
        public async Task<JsonResult> UpdateProductInCart([FromBody] ProductInCartRequestDtos productInCartRequestDtos)
        {
            var username = productInCartRequestDtos.username;
            var userList = _context.Users.Where(x => x.Username == username).ToList();
            if (userList.Count == 0)
            {
                return new JsonResult(new { message = "User not exists" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                var user = userList.First();
                var productInCart = _mapper.Map<ProductInCart>(productInCartRequestDtos);
                productInCart.UserId = user.Id;
                var currentProductInCart = _context.ProductInCarts.Where(x => x.UserId == productInCart.UserId && x.ProductId == productInCart.ProductId
                                                                         && x.Size == productInCart.Size).First();
                if (currentProductInCart != null)
                {
                    currentProductInCart.Amount = productInCart.Amount;
                    _context.Update(currentProductInCart);
                    await _context.SaveChangesAsync();
                    return new JsonResult(currentProductInCart)
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
                }
                else
                {
                    return new JsonResult(new { message = "Product in cart not exists" })
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                }
            }
        }

        [Authorize(Roles = Role.User)]
        [HttpPost("DeleteProductInCart")]
        public async Task<JsonResult> DeleteProductInCart([FromBody] ProductInCartRequestDtos productInCartRequestDtos)
        {
            var username = productInCartRequestDtos.username;
            var userList = _context.Users.Where(x => x.Username == username).ToList();
            if (userList.Count == 0)
            {
                return new JsonResult(new { message = "User not exists" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                var user = userList.First();
                var productInCart = _mapper.Map<ProductInCart>(productInCartRequestDtos);
                productInCart.UserId = user.Id;
                var currentProductInCart = _context.ProductInCarts.Where(x => x.UserId == productInCart.UserId && x.ProductId == productInCart.ProductId
                                                                         && x.Size == productInCart.Size).FirstOrDefault();
                if (currentProductInCart != null)
                {
                    _context.Remove(currentProductInCart);
                    _context.SaveChanges();
                    return new JsonResult(currentProductInCart)
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
                }
                else
                {
                    return new JsonResult(new { message = "Product in cart not exists" })
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                }

            }
        }

    }
}
