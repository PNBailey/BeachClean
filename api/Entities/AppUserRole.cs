using Microsoft.AspNetCore.Identity;

namespace api.Entities
{
    public class AppUserRole : IdentityUserRole<int> // The IdentityUserRole type represents the link between the user and the role
    {
        public AppUser User { get; set; }

        public AppRole Role { get; set; }
    }
}