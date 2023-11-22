using Microsoft.EntityFrameworkCore;

namespace DepartmentTutorialApp.Models
{
    public class Context : DbContext
    {
        public Context( DbContextOptions<Context> options):base(options) 
        {
            
        }
    }
}
