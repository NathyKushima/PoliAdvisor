from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password, nusp, fullname, course, start_date, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        if not username:
            raise ValueError('The Username field must be set')
        if not email:
            raise ValueError('The Email field must be set')
        if not nusp:
            raise ValueError('The NUSP field must be set')
        if not fullname:
            raise ValueError('The Fullname field must be set')
        if not course:
            raise ValueError('The Course field must be set')
        if not start_date:
            raise ValueError('The Start Date field must be set')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            nusp=nusp,
            fullname=fullname,
            course=course,
            start_date=start_date,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('fullname', 'Superuser Fullname')
        extra_fields.setdefault('start_date', '2024-01-01')
        extra_fields.setdefault('course', 'ENG_MECATRONICA')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('nusp', 123256678)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    COURSE_CHOICES = [
        ('ENG_AMBIENTAL', 'Engenharia Ambiental'),
        ('ENG_CIVIL', 'Engenharia Civil'),
        ('ENG_COMPUTACAO', 'Engenharia da Computação'),
        ('ENG_MINAS', 'Engenharia de Minas'),
        ('ENG_PETROLEO', 'Engenharia de Petróleo'),
        ('ENG_NAVAL', 'Engenharia Naval'),
        ('ENG_METALURGICA', 'Engenharia Metalúrgica'),
        ('ENG_PRODUCAO', 'Engenharia de Produção'),
        ('ENG_ELETRICA', 'Engenharia Elétrica'),
        ('ENG_MECANICA', 'Engenharia Mecânica'),
        ('ENG_MECATRONICA', 'Engenharia Mecatrônica'),
        ('ENG_QUIMICA', 'Engenharia Química'),
        ('ENG_MATERIAIS', 'Engenharia de Materiais'),
    ]

    YEAR_CHOICES = [
        (2019, "2019"),
        (2020, "2020"),
        (2021, "2021"),
        (2022, "2022"),
        (2023, "2023"),
        (2024, "2024"),
    ]
    
    objects = CustomUserManager()
    nusp = models.IntegerField(unique=True)
    fullname = models.CharField(max_length=100)
    course = models.CharField(max_length=20, choices=COURSE_CHOICES, default='ENG_MECATRONICA')
    start_date = models.IntegerField("Ano de inicio", choices=YEAR_CHOICES)
    user_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    def initials(self):
        names = self.fullname.split()
        return ''.join([name[0].upper() for name in names[:2]]) if len(names) >= 2 else names[0][0].upper()

    def __str__(self):
        return self.fullname

class Department(models.Model):
    id = models.AutoField(primary_key=True)
    department_code = models.CharField(max_length=256, unique=True)
    department_name = models.CharField(max_length=256)

    def __str__(self):
        return self.department_code

class Discipline(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="disciplines")
    discipline_code = models.CharField(max_length=256, unique=True)
    name = models.CharField(max_length=256)
    class_credits = models.IntegerField()
    work_credits = models.IntegerField()

    def __str__(self):
        return self.name

class Course(models.Model):
    id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=256)

    def __str__(self):
        return self.course_name

class CourseCoversSubjects(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="subjects")
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name="courses")
    mandatory_type = models.IntegerField()

class UserTakesCourse(models.Model):  
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="students")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="courses")

class UserTookDiscipline(models.Model):

    YEAR_CHOICES = [
        (2019, "2019"),
        (2020, "2020"),
        (2021, "2021"),
        (2022, "2022"),
        (2024, "2024"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="disciplines_taken")
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name="users")
    semester_completed =  models.IntegerField("Ano em que fez a materia", choices=YEAR_CHOICES)
    note_teaching = models.IntegerField()
    note_material = models.IntegerField()
    note_difficulty = models.IntegerField()

    def __str__(self):
        return f"{self.user.fullname} - {self.discipline.name}"

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name="comments")
    parent_comment = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="replies")
    comment_content = models.TextField()
    comment_date = models.DateField(auto_now_add=True)
    status_comment = models.IntegerField()

class UserCurtesComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_comments")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")