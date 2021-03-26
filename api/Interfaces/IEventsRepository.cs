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

        Task<Event> GetEventByIdAsync(int eventId);

        Task<bool> SaveAllAsync();

        void updateEvent(Event updatedEvent);

        Task<bool> removeOrganiser(int organiserId,  int eventId);
    }
}