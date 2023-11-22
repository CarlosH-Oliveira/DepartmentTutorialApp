using System;
using System.Collections.Generic;

namespace DepartmentTutorialApp.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Department { get; set; }

    public DateTime? DateOfJoining { get; set; }

    public string? PhotoFileName { get; set; }

    public Employee()
    {
        this.DateOfJoining = DateTime.UtcNow;
    }
}
