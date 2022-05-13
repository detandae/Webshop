using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PayPal.Api;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace WebshopBackend.Helper
{
    public class PayPalHandler
    {
        private readonly Dictionary<string, string> _payPalConfig;

        public PayPalHandler(IConfiguration config)
        {
            _payPalConfig = new Dictionary<string, string>()
            {
                { "clientId" , config.GetSection("paypal:settings:clientId").Value },
                { "clientSecret", config.GetSection("paypal:settings:clientSecret").Value },
                { "mode", config.GetSection("paypal:settings:mode").Value },
                { "business", config.GetSection("paypal:settings:business").Value },
                { "merchantId", config.GetSection("paypal:settings:merchantId").Value },
            };

            var accessToken = new OAuthTokenCredential(_payPalConfig).GetAccessToken();
            var apiContext = new APIContext(accessToken);
            apiContext.Config = _payPalConfig;
            apiContext.Config["connectionTimeout"] = "1000";
            if (apiContext.HTTPHeaders == null)
            {
                apiContext.HTTPHeaders = new Dictionary<string, string>();
            }
            apiContext.HTTPHeaders["some-header-name"] = "some-value";
            var payment = Payment.Get(apiContext, "PAY-0XL713371A312273YKE2GCNI");
        }
    }
}
