using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebshopBackend.Services;

namespace WebshopBackend.Hubs
{
    public class NotificationHub: Hub
    {
        private static List<string> users = new List<string>();
        public  override  Task OnConnectedAsync()
        {
            InMemoryDataService.OpenConnections.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        //SignalR Verions 1 Signature
        public override  Task OnDisconnectedAsync(Exception e)
        {
            for (int i = 0; i < InMemoryDataService.OpenConnections.Count; i++)
            {
                // if it is List<String>
                if (InMemoryDataService.OpenConnections[i].Equals(Context.ConnectionId))
                {
                    InMemoryDataService.OpenConnections.RemoveAt(i);
                }
            }
            return base.OnDisconnectedAsync(e);
        }
        
        public async Task SendMessage(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }

        public string GetConnectionId() => Context.ConnectionId;
    }
}
