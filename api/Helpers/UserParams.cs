namespace api.Helpers
{

    // This class is for the parameters that the user will specify when requesting how many pages to view
    public class UserParams : PaginationParams
    {
        public string CurrentUserName { get; set; }

        public string usersLocation { get; set; }


    }
}