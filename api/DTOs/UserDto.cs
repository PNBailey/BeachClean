namespace api.DTOs
{
    public class UserDto
    {
        public string UserName { get; set; }

        public string Token { get; set; }

        public string Location { get; set; }
        
        #nullable enable

        public string? PhotoUrl { get; set; }
    }
}