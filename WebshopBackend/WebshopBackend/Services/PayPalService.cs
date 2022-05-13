using Microsoft.Extensions.Configuration;
using PayPal.Api;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Services
{

    public interface IPayPalService
    {
        Task<Payment> CreatePayment(double Price);
        Task <Payment> ExecutePayment(string payerId,string paymentId);
      
    }


    public class PayPalService: IPayPalService
    {

        private readonly Dictionary<string, string> _payPalConfig;
      
        public PayPalService(IConfiguration config)
        {
        
            _payPalConfig = new Dictionary<string, string>()
            {
                { "clientId" , config.GetSection("paypal:settings:clientId").Value },
                { "clientSecret", config.GetSection("paypal:settings:clientSecret").Value },
                { "mode", config.GetSection("paypal:settings:mode").Value },
                { "business", config.GetSection("paypal:settings:business").Value },
                { "merchantId", config.GetSection("paypal:settings:merchantId").Value },
            };

         
        }

        public async Task<Payment> CreatePayment(double Price)
        {
            var accessToken = new OAuthTokenCredential(_payPalConfig).GetAccessToken();
            var apiContext = new APIContext(accessToken);
            apiContext.Config = _payPalConfig;
            var totalPrice = Price.ToString();
            Payment CreatedPayment = null;
            try
            {
                Payment payment = new Payment {
                    intent = "sale",
                    payer = new Payer { payment_method = "paypal" },
                    transactions = new List<Transaction>
                    {
                        new Transaction
                        {
                            amount=new Amount
                            {
                                currency="USD",
                                total =totalPrice
                            },
                            description="Webshop payment"
                        }
                    },
                    redirect_urls = new RedirectUrls
                    {
                        cancel_url = "https://localhost:8080/api/order/cancel",
                        return_url = "https://localhost:8080/api/order/success",
                    }
                };
                string cancelURL = "https://localhost:8080/api/order/cancel" + "?paymentId=" + payment.id;
                payment.redirect_urls.cancel_url = cancelURL; 
                CreatedPayment = await Task.Run(() => payment.Create(apiContext));
            }
            catch(Exception e)
            {
            }
            return CreatedPayment;
        }

        public async Task<Payment> ExecutePayment(string payerId, string paymentId)
        {
            var accessToken = new OAuthTokenCredential(_payPalConfig).GetAccessToken();
            var apiContext = new APIContext(accessToken);
            apiContext.Config = _payPalConfig;
            PaymentExecution paymentExecution = new PaymentExecution()
            {
                payer_id = payerId
            };
            Payment payment = new Payment() { id = paymentId };
            Payment executedPayment = await Task.Run(() =>  payment.Execute(apiContext, paymentExecution));
            return executedPayment;
        }
    }
}
