using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebshopBackend.Services
{
    public interface IInMemoryDataService
    {
        void SaveConnectionPair(string paymentID, string conenctionID);
        string RetrieveConnetionID(string paymentID);
        bool CheckIfConnectionOpen(string connectionID);
    }
    public class InMemoryDataService: IInMemoryDataService
    {

        public static ConcurrentDictionary<string, string> CreatedPayments= new ConcurrentDictionary<string, string>();
        public static List<string> OpenConnections= new List<string>();

        public bool CheckIfConnectionOpen(string connectionID)
        {
            return OpenConnections.Contains(connectionID);
        }

        public void SaveConnectionPair(string paymentID, string conenctionID)
        {
            CreatedPayments.AddOrUpdate(paymentID, conenctionID, (key, oldValue) => conenctionID);
        }

        public string RetrieveConnetionID(string paymentID)
        {
            string connectionId;
            if (CreatedPayments.TryRemove(paymentID, out connectionId))
            {
                return connectionId;
            }
            else
            {
                return "";
            }
        }

    }
}
