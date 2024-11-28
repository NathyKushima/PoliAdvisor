from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .models import UserTookDiscipline
from .models import User
from django.db.models import Avg, Count

class BestDisciplinesAPIView(APIView):
    def get(self, request):
        disciplines = (
            UserTookDiscipline.objects
            .values('discipline__id', 'discipline__name', 'discipline__discipline_code')
            .annotate(
                avg_teaching=Avg('note_teaching'),
                avg_material=Avg('note_material'),
                avg_difficulty=Avg('note_difficulty')
            )
            .order_by('-avg_difficulty', '-avg_teaching', '-avg_material')
        )

        best_disciplines = []
        selected_ids = set()

        for discipline in disciplines:
            if len(best_disciplines) >= 3:
                break

            if discipline['discipline__id'] not in selected_ids:
                best_disciplines.append(discipline)
                selected_ids.add(discipline['discipline__id'])

        return Response(best_disciplines)

@api_view(['GET'])
@login_required
def get_user_info(request):
    user = request.user
    user_data = User.objects.get(id=user.id)

    return Response({
        'username': user_data.username,
        'fullname': user_data.fullname,
        'photo': user_data.user_photo.url if user_data.user_photo else None,
        'initials': user_data.initials() 
    })