using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class EventsRepository : IEventsRepository
    {
        private readonly DataContext _context;
        public EventsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateEvent(Event newEvent)
        {

            _context.Events.Add(newEvent);

            return await _context.SaveChangesAsync() > 0;

        }

        public Task<PagedList<EventDto>> GetEventByEventNameAsync(string eventName)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<Event>> GetEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }
    }
}