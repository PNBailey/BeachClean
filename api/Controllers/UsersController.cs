using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{


    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper, DataContext context, IPhotoService photoService)
        {
            _photoService = photoService;
            _context = context;
            _userRepository = userRepository;
            _mapper = mapper;

        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            return Ok(users);
        }



        [HttpGet("{username}",  Name = "GetUser")]

        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }


        [HttpPost("{add-photo}")]

        public async Task<ActionResult<PhotoDto>> ChangePhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo {
                Url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId

            };

            user.Photo = photo;

            if(await _userRepository.SaveAllAsync()) 
            {
                return CreatedAtRoute("GetUser", new {username = user.UserName}, _mapper.Map<Photo, PhotoDto>(photo));
            }

            return BadRequest("Unable to upload photo");
        }


            
            [Authorize]
           [HttpPut] 


        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        { 
            

             var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername()); 

            _mapper.Map(memberUpdateDto, user); 

            _userRepository.Update(user); 

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Falied to update user");

        }

    }

  
}