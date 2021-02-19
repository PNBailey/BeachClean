using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IEventsRepository _eventsRepository;
        private readonly IMapper _mapper;
        public EventsController(IEventsRepository eventsRepository, IMapper mapper)
        {
            _mapper = mapper;
            _eventsRepository = eventsRepository;
        }


        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(Event newEvent)
        {

            var events = await _eventsRepository.GetEventsAsync();

            var matchingDates = events.Where(e => e.Date == newEvent.Date);

            var matchingEvents = matchingDates.Where(e => e.Name == newEvent.Name);

            if (matchingEvents.Count() > 1)
            {
                return BadRequest("Event already exists!");
            }

            await _eventsRepository.CreateEvent(newEvent);

            var createdEvent = _mapper.Map<Event, EventDto>(newEvent);

            return createdEvent;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents() 
        {
            var events = await _eventsRepository.GetEventsAsync();

            return Ok(events);
        }
    }
}