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

namespace WebshopBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        private WebshopContext _context;


        public UserController(IUserService userService, IMapper mapper,
               IOptions<AppSettings> appSettings, WebshopContext webshopContext)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _context = webshopContext;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public JsonResult Authenticate([FromBody]UserDtos userDto)
        {
            var user = _userService.Authenticate(userDto.Username, userDto.Password);
            if (user == null)
                return new JsonResult(new
                {
                    message = "Username or password is incorrect"
                })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            // return basic user info (without password) and token to store client side
            DateTime dt = DateTime.UtcNow.AddDays(7);
            return new JsonResult(new
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Token = tokenString,
                Expire = dt.ToString("yyyy.MM.dd HH:mm")
            })
            {
                StatusCode = StatusCodes.Status200OK // Status code here 
            };
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public JsonResult Register([FromBody]RegisterDtos registerDtos)
        {
            var user = _mapper.Map<User>(registerDtos);
            var adress = _mapper.Map<Adress>(registerDtos);
            user.Adress = adress;
            try
            {
                var User = _userService.Create(user,registerDtos.Password);
             
                var RegisterDtos = _mapper.Map<RegisterDtos>(User);
                RegisterDtos = _mapper.Map<RegisterDtos>(adress);
                return new JsonResult(RegisterDtos)
                {
                    StatusCode = StatusCodes.Status201Created
                };
            }
            catch (AppException ex)
            {
                return new JsonResult(new { message = ex.Message })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("GetUserByName")]
        public async Task<JsonResult> GetUserByName([FromBody]UserDtos userDto)
        {
            var username = userDto.Username;
            var user = _context.Users.Where(x => x.Username == username).Include(x => x.Adress).FirstOrDefault();
            if (user != null)
            {
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


        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public JsonResult GetAll()
        {
            var users = _context.Users;
            var userDtos = _mapper.Map<IList<UserDtos>>(users);
            return new JsonResult(userDtos)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("{id}")]
        public async Task<JsonResult> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            var userDto = _mapper.Map<UserDtos>(user);
            return new JsonResult(userDto)
            {
                StatusCode = StatusCodes.Status200OK
            };
        }


        [Authorize(Roles = Role.Admin)]
        [HttpPut("{id}")]
        public JsonResult Update(int id, [FromBody]RegisterDtos registerDto)
        {
            var user = _mapper.Map<User>(registerDto);
            var adress = _mapper.Map<Adress>(registerDto);
            user.Adress = adress;
            user.Id = id;
            try
            {
                _userService.Update(user, registerDto.Password);
                return new JsonResult(user)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch (AppException ex)
            {
                return new JsonResult(new { message = ex.Message })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("ChangeEmail")]
        public async Task<JsonResult> ChangeEmail([FromBody]UserDtos userDto)
        {
            var User = _mapper.Map<User>(userDto);
            var user = await _context.Users.FindAsync(User.Id);
            if (user != null)
            {
                user.Email = User.Email;
                await _context.SaveChangesAsync();
                return new JsonResult(user)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            else
            {
                return new JsonResult("Not found")
                {
                    StatusCode = StatusCodes.Status404NotFound
                };
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(long id)
        {
            var user = await _context.Users.FindAsync(id);
            var adress = user.Adress;
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.Adresses.Remove(adress);
                _context.SaveChanges();
                return new JsonResult(user)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            return new JsonResult("Not found")
            {
                StatusCode = StatusCodes.Status404NotFound
            };
        }
    }
}
