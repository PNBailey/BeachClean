using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IMessagesRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);

        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);

        Task<bool> SaveAllAsync();
    
     }
}