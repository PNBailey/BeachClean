using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IEventsRepository _eventsRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        public EventsController(IEventsRepository eventsRepository, IMapper mapper, IPhotoService photoService, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _photoService = photoService;
            _mapper = mapper;
            _eventsRepository = eventsRepository;

        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateEvent(EventDto newEvent)
        {

            var currUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var events = await _eventsRepository.GetEventsAsync();

            var matchingDates = events.Where(e => e.Date == newEvent.Date);

            var matchingEvents = matchingDates.Where(e => e.Name == newEvent.Name);

            if (matchingEvents.Count() > 0)
            {
                return BadRequest("Event already exists!");
            }

            // if(newEvent.MainPhoto != null) {
            //     var mainEventPhoto = new Photo {
            //     Url = newEvent.MainPhoto.url
            // };
            // }

           
            var createdEvent = new Event
            {
                Name = newEvent.Name,
                Date = newEvent.Date,
                Location = newEvent.Location,
                Creator = currUser,
                CreatorId = currUser.Id

            };

           return await _eventsRepository.CreateEvent(createdEvent);

        }

        [HttpGet("{id}", Name = "GetEvent")]

        public async Task<ActionResult<EventDto>> GetEventById(int id)
        {
            var existingEvent = await _eventsRepository.GetEventByIdAsync(id);

            return existingEvent;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            var events = await _eventsRepository.GetEventsAsync();

            return Ok(events);
        }

        // [HttpPost("add-photo/{id}")]
        // public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, int id)
        // {
        //     var existingEvent = await _eventsRepository.GetEventByIdAsync(id);

        //     var result = await _photoService.AddPhotoAsync(file);

        //     if (result.Error != null) return BadRequest(result.Error.Message);

        //     var photo = new Photo
        //     {
        //         Url = result.SecureUrl.AbsoluteUri,
        //         publicId = result.PublicId

        //     };

        //     existingEvent.EventPhotos.Add(photo);

        //     if (await _eventsRepository.SaveAllAsync())
        //     {
        //         return CreatedAtRoute("GetEvent", new { eventId = existingEvent.Id }, _mapper.Map<Photo, PhotoDto>(photo));
        //     }

        //     return BadRequest("Unable to upload photo");
        // }


        

    }
}