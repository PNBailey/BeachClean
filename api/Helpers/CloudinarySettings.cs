// Here we are going to strongly type our configuration for the cloudinary settings. When we are strongly typing a key or configuration in this way, what we are doing is 

namespace api.Helpers
{
    public class CloudinarySettings
    {
        public string CloudName { get; set; }

        public string Apikey { get; set; }

        public string ApiSecret { get; set; }
    }
}