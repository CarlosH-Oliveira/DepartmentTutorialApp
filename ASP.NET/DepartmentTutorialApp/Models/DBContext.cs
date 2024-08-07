using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DepartmentTutorialApp.Models;

public partial class DBContext : DbContext
{
    public DBContext()
    {
    }

    public DBContext(DbContextOptions<DBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseMySql("server=localhost;database=db_codedb;uid=root;pwd=root", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.34-mysql"));
}
