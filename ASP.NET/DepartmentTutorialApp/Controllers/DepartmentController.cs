using DepartmentTutorialApp.Models;
using DepartmentTutorialApp.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DepartmentTutorialApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartmentController : ControllerBase
    {
        private DBContext _context;
        public DepartmentController(DBContext context)
        {   
            _context = context;
        }

        [HttpGet("department")]
        public IActionResult Get()
        {
            List<Department> departments = _context.Departments.ToList();
            return Ok(departments);
        }

        [HttpPost("department/create")]
        public IActionResult Create([FromBody] NewDepartmentDTO dto)
        {
            if(dto.Name == null || dto.Name.Trim() == "")
            {
                return BadRequest("O campo 'Nome' é obrigatório");
            }
            else
            {
                Department department = new Department();
                department.Name = dto.Name;
                _context.Departments.Add(department);
                _context.SaveChanges();
                return Ok(department);
            }
        }

        [HttpPut("department/alter/{id}")]
        public IActionResult Alter(int id, [FromBody] NewDepartmentDTO dto)
        {
            Department department = _context.Departments.SingleOrDefault(d => d.Id == id);
            if(department == null)
            {
                return BadRequest("Não foi encontrado departamento com o Id informado");
            }
            else
            {
                if(dto.Name == null || dto.Name.Trim() == "")
                {
                    return BadRequest("O campo 'Nome é obrigatório");
                }
                else
                {
                    department.Name = dto.Name;
                    _context.SaveChanges();
                    return Ok(department);
                }
            }
        }

        [HttpDelete("department/delete/{id}")]
        public IActionResult Delete(int id)
        {
            Console.WriteLine("Valor excluido");
            Department? department = _context.Departments.SingleOrDefault(d => d.Id == id);
            if (department == null)
            {
                return BadRequest("Não foi encontrado departamento com o Id informado");
            }
            else
            {
                List<Employee> deletingRange = _context.Employees.Where(employee => employee.Department == department.Name).ToList();
                _context.Departments.Remove(department);
                _context.Employees.RemoveRange(deletingRange);
                _context.SaveChanges();
                return NoContent();
            }
        }

    }
}