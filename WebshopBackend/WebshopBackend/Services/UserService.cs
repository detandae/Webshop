using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebshopBackend.Context;
using WebshopBackend.Helper;
using WebshopBackend.Models;

namespace WebshopBackend.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        User Create(User user, string password);
        void Update(User user, string password = null);
    }

    public class UserService : IUserService
    {
        private WebshopContext _context;

        public UserService(WebshopContext context)
        {
            _context = context;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;
            var user = _context.Users.SingleOrDefault(x => x.Username == username);
            if (user == null)
                return null;
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            return user;
        }

        public User Create(User user,string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");
            var list = _context.Users.Where(u => u.Username == user.Username).ToList();
            if (list.Count > 0)
                throw new AppException("Username \"" + user.Username + "\" is already taken");
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Id = 0;
            user.Random = GenerateRandomString(30);
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public void Update(User newUser, string password = null)
        {
            var user = _context.Users.Find(newUser.Id);
            if (user == null)
                throw new AppException("User not found");
            if (newUser.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                var list = _context.Users.Where(u => u.Username == newUser.Username).ToList();
                if (list.Count > 0)
                    throw new AppException("Username \"" + newUser.Username + "\" is already taken");
            }
            // update user properties
            if (newUser.Username != "")
            {
                user.Username = newUser.Username;
            }
            if (newUser.FirstName != "")
            {
                user.FirstName = newUser.FirstName;
            }
            if (newUser.FirstName != "")
            {
                user.LastName = newUser.LastName;
            }
            if (newUser.Email != "")
            {
                user.Email = newUser.Email;
            }
            if (newUser.Role == Role.Admin || newUser.Role == Role.User || newUser.Role == Role.Service)
            {
                user.Role = newUser.Role;
            }
            if (newUser.Adress.Street != "")
            {
                user.Adress.Street = newUser.Adress.Street;
            }
            if (newUser.Adress.City != "")
            {
                user.Adress.City = newUser.Adress.City;
            }
            if (newUser.Adress.Country != "")
            {
                user.Adress.Country = newUser.Adress.Country;
            }
            if (newUser.Adress.Zip >0)
            {
                user.Adress.Zip = newUser.Adress.Zip;
            }
            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");
            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            return true;
        }

        public static string GenerateRandomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
