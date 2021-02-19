using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;
using api.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class EventsRepository : IEventsRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public EventsRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> CreateEvent(Event newEvent)
        {

            _context.Events.Add(newEvent);

            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<Event> GetEventByIdAsync(int eventId)
        {
            return await _context.Events
            .Where(e => e.Id == eventId)
            .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<EventDto>> GetEventsAsync()
        {
            return await _context.Events
            .ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

          public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}