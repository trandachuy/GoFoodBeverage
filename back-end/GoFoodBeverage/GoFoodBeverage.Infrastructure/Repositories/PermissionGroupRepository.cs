using GoFoodBeverage.Interfaces.Repositories;
using GoFoodBeverage.Infrastructure.Contexts;
using GoFoodBeverage.Domain.Entities;


namespace GoFoodBeverage.Infrastructure.Repositories
{
    public class PermissionGroupRepository : GenericRepository<PermissionGroup>, IPermissionGroupRepository
    {
        public PermissionGroupRepository(GoFoodBeverageDbContext dbContext) : base(dbContext) { }
    }
}
