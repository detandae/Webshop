using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Dtos;
using WebshopBackend.Models;

namespace WebshopBackend.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, RegisterDtos>();
            CreateMap<RegisterDtos, User>();
            CreateMap<User, UserDtos>();
            CreateMap<UserDtos, User>();
            CreateMap<Adress, RegisterDtos>();
            CreateMap<RegisterDtos, Adress>();
            CreateMap<ProductInCart, ProductInCartRequestDtos>();
            CreateMap<ProductInCartRequestDtos, ProductInCart>();
            CreateMap<ProductDtos, Product>();
            CreateMap<Product, ProductDtos>();
        }
    }
}
