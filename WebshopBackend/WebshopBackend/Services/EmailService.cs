using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using WebshopBackend.Models;

namespace WebshopBackend.Services
{
    public interface IEmailService
    {
        void SendEmail(string Message, string Subject, User user);
    }

    public class EmailService: IEmailService
    {
        private MailMessage mail;
        private SmtpClient SmtpServer;
        private MailAddress fromAddress;
        private const string password = "myWebserver2021";
        private const string myMailAdress = "mrwebserverdelevery@gmail.com";
        public EmailService()
        {
            fromAddress = new MailAddress(myMailAdress);
            SmtpServer = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, password)
            };
        }

        public void SendEmail(string Message, string Subject, User user)
        {
            MailAddress toAddress = new MailAddress(user.Email);
            StringBuilder builder = new StringBuilder();
            builder.Append(Message);
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = Subject,
                Body = Message
            })
            {
                SmtpServer.Send(message);
            }
        }
    }
}
