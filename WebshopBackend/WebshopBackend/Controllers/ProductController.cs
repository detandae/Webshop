using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Context;
using WebshopBackend.Dtos;
using WebshopBackend.Helper;
using WebshopBackend.Models;

namespace WebshopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private WebshopContext _context;
        private readonly IHostingEnvironment _appEnvironment;
        private IMapper _mapper;

        public ProductController(WebshopContext biotechContext, IHostingEnvironment appEnvironment, IMapper mapper)
        {
            _context = biotechContext;
            _appEnvironment = appEnvironment;
            _mapper = mapper;
        }
        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(long id)
        {
            var product = _context.Products.Include(x => x.category).Where(x => x.id == id).First();
            product.sold = 0;
            return new JsonResult(product)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [HttpGet("Products")]
        public async Task<JsonResult> GetProducts()
        {
            var product = _context.Products.Include(x => x.category).ToList();
            return new JsonResult(product)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }



        [HttpGet("categorys")]
        public async Task<JsonResult> GetCategorys()
        {
            var categoryList = _context.Categorys.ToList();
            return new JsonResult(categoryList)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("DeleteCategory")]
        public async Task<JsonResult> DeleteCategory([FromBody] Category CategoryToDelete)
        {
            CategoryToDelete =  _context.Categorys.Where(x => x.category == CategoryToDelete.category && x.sex == CategoryToDelete.sex).FirstOrDefault();
            if (CategoryToDelete == null)
            {
                return new JsonResult("Category not exists")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var ptoductsToDelete = _context.Products.Where(x => x.categoryid == CategoryToDelete.id).ToList();
            ptoductsToDelete.ForEach(x => x.category = null);
            _context.Products.RemoveRange(ptoductsToDelete);
            await _context.SaveChangesAsync();
            _context.Categorys.Remove(CategoryToDelete);
            await _context.SaveChangesAsync();
  
            return new JsonResult(CategoryToDelete)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AddCategory")]
        public async Task<JsonResult> AddCategory([FromBody] Category category)
        {
            var categoryToAdd= _context.Categorys.Where(x => x.category == category.category && x.sex == category.sex).FirstOrDefault();
            if (categoryToAdd != null)
            {
                return new JsonResult("Category already exists")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            _context.Categorys.Add(category);
            await _context.SaveChangesAsync();
            return new JsonResult(category)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [HttpPost("GetRelatedProducts")]
        public async Task<JsonResult> GetRelatedProductsByCategory([FromBody] Category categoryDto)
        {
            var category = _context.Categorys.Where(x => x.category == categoryDto.category && x.sex == categoryDto.sex).FirstOrDefault();
            if (category == null)
            {
                return new JsonResult("Category not exist")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var products = _context.Products.Include(x => x.category).Where(x => x.category.category == category.category && x.category.sex == category.sex);
            var productsToReturn = products.ToList().OrderBy(x => Guid.NewGuid()).Take(4);
            return new JsonResult(productsToReturn)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        [Authorize(Roles = Role.Admin)]
        [HttpPost("DeleteProduct")]
        public async Task<JsonResult> DeleteProduct([FromBody] ProductDtos productDto)
        {
            var product =await  _context.Products.FindAsync(productDto.id);
            if (product == null)
            {
                return new JsonResult("product not exists")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return new JsonResult(product)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("DeleteProducts")]
        public async Task<JsonResult> DeleteProducts([FromBody] List<ProductDtos> productDtoList)
        {
            foreach (var productDto in productDtoList)
            {
                var product = await _context.Products.FindAsync(productDto.id);
                _context.Products.Remove(product);
            }
            await _context.SaveChangesAsync();
            return new JsonResult("Success")
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AddProduct")]
        public async Task<JsonResult> AddProduct([FromBody] ProductDtos productDto)
        {
            var sex=(productDto.category.sex);
            var category=productDto.category.category;
            var Category = _context.Categorys.Where((x => x.category == category && (x.sex == sex))).FirstOrDefault();
            if (Category == null)
            {
                return new JsonResult("CategoryError")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var product = _mapper.Map<Product>(productDto);
            product.sold = 0;
            product.categoryid = Category.id;
            product.category = null;
            product.creationtime = DateTime.Parse(productDto.creationtime);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return new JsonResult(product)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("UploadProductImage")]
        public async Task<JsonResult> UploadProductImageAsync([FromForm] ImageModel imageModel)
        {
             var id = (long)Convert.ToInt64(imageModel.id);
            var product = await _context.Products.FindAsync(id);
            if (!ModelState.IsValid)
            {
                return new JsonResult("BadRequest")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            string uploadPath = Path.Combine(_appEnvironment.WebRootPath, "images");
            
            if (imageModel.image.Length > 0)
            {
                var myUniqueFileName = $@"{Guid.NewGuid()}.jpg";
                string filePath = Path.Combine(uploadPath, myUniqueFileName);
                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageModel.image.CopyToAsync(fileStream);
                }
                product.imageURL = Path.Combine("images", myUniqueFileName);
                _context.Update(product);
                await _context.SaveChangesAsync();
            }
            return new JsonResult("Success")
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [HttpGet("GetHighlightedProducts")]
        public async Task<JsonResult> GetHighlightedProducts()
        {
            var categories = _context.Categorys.ToList();
            var productsToReturn = new Dictionary<string, IEnumerable<Product>>();
            foreach (var category in categories)
            {
                var products = _context.Products.Include(x => x.category).Where(x => x.category.category == category.category && x.category.sex == category.sex && x.highlighted == true);
                var highlightedProductsToReturn = products.ToList().OrderBy(x => Guid.NewGuid()).Take(8);
                productsToReturn.Add(category.sex+category.category,highlightedProductsToReturn);
            }
          
            return new JsonResult(productsToReturn)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        [HttpGet("GetLatestProducts")]
        public async Task<JsonResult> GetLatestProducts()
        {
            var categories = _context.Categorys.ToList();
            var productsToReturn = new Dictionary<string, IEnumerable<Product>>();
            foreach (var category in categories)
            {
                var products = _context.Products.Include(x => x.category).Where(x => x.category.category == category.category && x.category.sex == category.sex && x.creationtime != null);
                var latestProducts = products.OrderByDescending(x => x.creationtime).Take(8);
                productsToReturn.Add(category.sex + category.category, latestProducts);
            }
            return new JsonResult(productsToReturn)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [HttpGet("GetActionProducts")]
        public async Task<JsonResult> GetActionProducts()
        {
            var categories = _context.Categorys.ToList();
            var productsToReturn = new Dictionary<string, IEnumerable<Product>>();
            foreach (var category in categories)
            {
                var products = _context.Products.Include(x => x.category).Where(x => x.category.category == category.category && x.category.sex == category.sex && x.Action > 0);
                var actionProductsToReturn = products.ToList().OrderBy(x => Guid.NewGuid()).Take(8);
                productsToReturn.Add(category.sex + category.category, actionProductsToReturn);
            }
            return new JsonResult(productsToReturn)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [HttpPost("Filter")]
        public async Task<JsonResult> PostFilteredProducts([FromBody] ProductFilterDtos productFilter)
        {
            if (productFilter.Sex != null || productFilter.ProductType != null
                || productFilter.Sizes != null)
            {

                List<Product> filteredProducts = new List<Product>();
                List<Product> finalFilteredProducts = new List<Product>();
                IQueryable<Models.Product> productListToFilter;
                productListToFilter = _context.Products.Include(x =>x.category).Where(x => x.category.category == productFilter.ProductType
                                                                && x.category.sex == productFilter.Sex);
                productListToFilter = productListToFilter.Where(x => (x.BasePrice - (x.BasePrice * x.Action)) <= productFilter.MaxPrice
                                                                && (x.BasePrice - (x.BasePrice * x.Action) >= productFilter.MinPrice));
                
                var sizes = productFilter.Sizes.Split(';');
                if (sizes.Contains("S"))
                {
            
                    filteredProducts = productListToFilter.Where(x => x.s > 0).ToList();
                    var except = filteredProducts.Except(finalFilteredProducts, new CustomComparer());
                    finalFilteredProducts.AddRange(except);
               
                }
                if (sizes.Contains("M"))
                {
                    filteredProducts = productListToFilter.Where(x => x.m > 0).ToList();
                    var except = filteredProducts.Except(finalFilteredProducts, new CustomComparer());
                    finalFilteredProducts.AddRange(except);
                }
                if (sizes.Contains("L"))
                {
                    filteredProducts = productListToFilter.Where(x => x.l > 0).ToList();
                    var except = filteredProducts.Except(finalFilteredProducts, new CustomComparer());
                    finalFilteredProducts.AddRange(except);
                }
                if (sizes.Contains("XL"))
                {
                    filteredProducts = productListToFilter.Where(x => x.xl > 0).ToList();
                    var except = filteredProducts.Except(finalFilteredProducts, new CustomComparer());
                    finalFilteredProducts.AddRange(except);
                }
                if (sizes.Contains("XXL"))
                {
                    filteredProducts = productListToFilter.Where(x => x.xxl > 0).ToList();
                    var except = filteredProducts.Except(finalFilteredProducts, new CustomComparer());
                    finalFilteredProducts.AddRange(except);
                }             

                var length = finalFilteredProducts.Count;
                if (productFilter.PageNumber == null) { productFilter.PageNumber = 0; }
                var productOfPage = SplitResult(length, productFilter.PageNumber, finalFilteredProducts);
                productOfPage.ForEach(x => x.sold = 0);
                return new JsonResult(new
                {
                    Length = length,
                    products = productOfPage
                })
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return new JsonResult("Filter object was invalid!")
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
         
        }

        private bool IsAnyOfTheFollowingCharacter(char c, string[] array)
        {
            foreach (var element in array)
            {
                if (c.ToString() == element)
                {
                    return true;
                }
            }
            return false;
        }

        private List<Product> SplitResult(int length, int pageNumber, List<Product> filteredProducts)
        {
            int pageSize = 50;
            if (pageNumber == 0 && length > pageSize)
            {
                filteredProducts = filteredProducts.GetRange(0, pageSize);
                return filteredProducts;
            }
            else if (pageNumber == 0 && length < pageSize)
            { 
                return filteredProducts;
            }
            int pageCount = (length - 1) / pageSize + 1;
            if (pageNumber > pageCount)
            {
                return null;
            }
            if (pageNumber <pageCount )
            {
                return filteredProducts.GetRange((pageNumber - 1)*pageSize, pageSize);
            }
            else
            {
                int remain = pageSize - ( pageCount * pageSize - length);
                return filteredProducts.GetRange((pageNumber - 1)*pageSize, remain);
            }

        }

            

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}



