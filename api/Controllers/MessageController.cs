using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class MessageController : BaseApiController
    {
        private readonly IMessagesRepository _messagesRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public MessageController(IMessagesRepository messagesRepository, IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _messagesRepository = messagesRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var currentUsername = User.GetUsername();

            if (currentUsername == createMessageDto.RecipientUsername) return BadRequest("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(currentUsername);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content,
            };

            _messagesRepository.AddMessage(message);

            if (await _messagesRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var messages = await _messagesRepository.GetMessageThread(User.GetUsername(), username);

            return Ok(messages);
        }
    }
}