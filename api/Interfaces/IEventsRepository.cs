using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IEventsRepository
    {
        Task<bool> CreateEvent(Event newEvent);

        Task<IEnumerable<Event>> GetEventsAsync();

        Task<Event> GetEventByIdAsync(int eventId);

        Task<bool> SaveAllAsync();
    }
}