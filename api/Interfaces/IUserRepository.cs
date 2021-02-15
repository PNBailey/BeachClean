using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user); // This isn't async as this will just update the tracking of the entity and then the saveAllAsybc will actually update the database 

        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);

        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams); 

        Task<MemberDto> GetMemberAsync(string username); // We create this method as rather than getting all the users from the database and then finding the correct user, it would be more optimal to find the user at the database level and then simply returning that user as a Member Dto


    }
}