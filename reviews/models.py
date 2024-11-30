from django.db import models

class User(models.Model):

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

    id = models.AutoField(primary_key=True)
    nusp = models.IntegerField(unique=True)
    fullname = models.CharField(max_length=45)
    username = models.CharField(max_length=45)
    start_date = models.DateField()
    emailUSP = models.EmailField(max_length=45, unique=True)
    hashed_password = models.CharField(max_length=126)
    status_user = models.IntegerField(default=1) 
    user_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    status_user = models.IntegerField()

    course = models.CharField(
        max_length=20, 
        choices=COURSE_CHOICES,
        default='ENG_MECATRONICA',
    )

    def __str__(self):
        return self.fullname
    
    def initials(self):
        names = self.fullname.split()
        return ''.join([name[0].upper() for name in names[:2]])

class Department(models.Model):
    id = models.AutoField(primary_key=True)
    department_code = models.CharField(max_length=45, unique=True)
    department_name = models.CharField(max_length=45)

    def __str__(self):
        return self.department_code

class Discipline(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="disciplines")
    discipline_code = models.CharField(max_length=45, unique=True)
    name = models.CharField(max_length=45)
    class_credits = models.IntegerField()
    work_credits = models.IntegerField()

    def __str__(self):
        return self.name

class Course(models.Model):
    id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=45)

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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="disciplines_taken")
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name="users")
    semester_completed = models.DateField()
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