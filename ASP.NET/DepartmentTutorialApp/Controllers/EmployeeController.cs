using DepartmentTutorialApp.Models.DTOs;
using DepartmentTutorialApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace DepartmentTutorialApp.Controllers
{
    public class EmployeeController : Controller
    {
        private DBContext _context;
        private IWebHostEnvironment _environment;
        public EmployeeController(DBContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        private bool IsNullOrEmpty(string value)
        {
            if(value.Trim() == "" || value == null) return true;
            return false;
        }

        [HttpGet("Employee")]
        public IActionResult Get()
        {
            List<Employee> employees = _context.Employees.ToList();
            return Ok(employees);
        }

        [HttpPost("Employee/create")]
        public IActionResult Create([FromBody] NewEmployeeDTO dto)
        {
            if (IsNullOrEmpty(dto.Name) || IsNullOrEmpty(dto.Department))
            {
                return BadRequest("{'error':'null', 'message':'Os campos Nome e Departamento são obrigatórios.'}");
            }
            Department? department = _context.Departments.SingleOrDefault(d => d.Name == dto.Department);
            if(department == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Nome de departamento inválido.'}");
            }
            else
            {
                Employee employee = new Employee();
                employee.Name = dto.Name;
                employee.Department = dto.Department;

                _context.Employees.Add(employee);
                _context.SaveChanges();
                return Ok(employee);
            }
        }

        [HttpPut("Employee/alter/{id}")]
        public IActionResult Alter(int id, [FromBody] NewEmployeeDTO dto)
        {
            Employee? employee = _context.Employees.SingleOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Não foi encontrado funcionário com o Id informado.'}");
            }
            Department? department = _context.Departments.SingleOrDefault(d => d.Name == dto.Department);
            if (department == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Nome de departamento inválido.'}");
            }
            else
            {
                if (!IsNullOrEmpty(dto.Name))
                {
                    employee.Name = dto.Name;
                }
                if (!IsNullOrEmpty(dto.Department))
                {
                    employee.Department = dto.Department;
                }

                _context.SaveChanges();
                return Ok(employee);
            }
        }

        [HttpDelete("Employee/delete/{id}")]
        public IActionResult Delete(int id)
        {
            Employee? employee = _context.Employees.SingleOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Não foi encontrado funcionário com o Id informado.'}");
            }
            else
            {
                if(employee.PhotoFileName != null)
                {
                    Console.WriteLine("Nome da foto de perfil: "+employee.PhotoFileName);
                    var deleteExistingFilePath = Path.Combine(
                            Directory.GetCurrentDirectory(), "Photos",
                            employee.PhotoFileName);

                    if (System.IO.File.Exists(deleteExistingFilePath))
                    {
                        System.IO.File.Delete(deleteExistingFilePath);
                    }
                    else
                    {
                        return StatusCode(500, "Erro ao deletar foto de usuário");
                    }
                }
                
                _context.Remove(employee);
                _context.SaveChanges();
                return Ok("{ 'error':'true', 'message':'Funcionário removido com sucesso.'}");
            }
        }

        [HttpPost("Employee/save_file/{id}")]
        public IActionResult SaveFile (int id)
        {
            Employee? employee = _context.Employees.SingleOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Não foi encontrado funcionário com o Id informado.'}");
            }
            else
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                var fileName = postedFile.FileName;
                var physicalPath = _environment.ContentRootPath + "/Photos/" + fileName;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                employee.PhotoFileName = fileName;
                _context.SaveChanges();
                return Ok(fileName);
            }

        }

        [HttpPost("Employee/photo/{id}")]
        public async Task<IActionResult> SavePhotoFile(int id)
        {
            Employee? employee = _context.Employees.SingleOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return BadRequest("{ 'error':'true', 'message':'Não foi encontrado funcionário com o Id informado.'}");
            }
            else
            {
                var file = Request.Form.Files[0];
                if (file == null || file.Length == 0 )
                    return BadRequest("{ 'error':'true', 'message':'file not selected'}");

                if (!string.Equals(file.ContentType, "image/jpg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file.ContentType, "image/jpeg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file.ContentType, "image/pjpeg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file.ContentType, "image/gif", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file.ContentType, "image/x-png", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file.ContentType, "image/png", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("{ 'error':'true', 'message':'Arquivo enviado não é uma imagem.'}");
                }

                Console.WriteLine("Imagem recebida: "+file.FileName);

                var postedFileExtension = Path.GetExtension(file.FileName);
                if (!string.Equals(postedFileExtension, ".jpg", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(postedFileExtension, ".png", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(postedFileExtension, ".gif", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(postedFileExtension, ".jpeg", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("{ 'error':'true', 'message':'Arquivo enviado não é uma imagem.'}");
                }

                var path = Path.Combine(
                            Directory.GetCurrentDirectory(), "Photos",
                            file.FileName);

                if (employee.PhotoFileName != null)
                {
                    var deleteExistingFilePath = Path.Combine(
                            Directory.GetCurrentDirectory(), "Photos",
                            employee.PhotoFileName);

                    if (System.IO.File.Exists(deleteExistingFilePath))
                    {
                        System.IO.File.Delete(deleteExistingFilePath);
                    }
                }

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                employee.PhotoFileName = file.FileName;
                _context.SaveChanges();
                return Ok("{ 'error':'true', 'message':'Foto salva com sucesso!.'}");
            }

        }
    }
}
