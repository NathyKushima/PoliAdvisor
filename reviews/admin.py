from django.contrib import admin
from .models import User, Department, Discipline, Course, CourseCoversSubjects, UserTakesCourse, UserTookDiscipline, Comment, UserCurtesComment, UserDenouncedComment

admin.site.register(User)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department_code', 'department_name') 
    search_fields = ('department_code', 'department_name')

@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'discipline_code', 'get_department_code')  
    search_fields = ('name', 'discipline_code')  
    list_filter = ('department',)

    def get_department_code(self, obj):
        return obj.department.department_code

    get_department_code.short_description = 'Department Code'

admin.site.register(Course)
admin.site.register(CourseCoversSubjects)
admin.site.register(UserTakesCourse)
admin.site.register(UserTookDiscipline)
admin.site.register(Comment)
admin.site.register(UserCurtesComment)
admin.site.register(UserDenouncedComment)
