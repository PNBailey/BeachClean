using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IEventsRepository
    {
        Task<int> CreateEvent(Event newEvent);

        Task<IEnumerable<EventDto>> GetEventsAsync();

        Task<EventDto> GetEventByIdAsync(int eventId);

        Task<bool> SaveAllAsync();
    }
}