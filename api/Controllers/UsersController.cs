using System.Collections.Generic;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Entities;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{


    [Authorize]
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
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            userParams.CurrentUserName = user.UserName;

            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }



        [HttpGet("{username}", Name = "GetUser")]

        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }


        [HttpPost("{add-photo}")]

        public async Task<ActionResult<PhotoDto>> AddUserPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new UserPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId

            };

            user.Photo = photo;

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<UserPhoto, PhotoDto>(photo));
            }

            return BadRequest("Unable to upload photo");
        }




        [HttpPut]


        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {


            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");

        }

    }


}