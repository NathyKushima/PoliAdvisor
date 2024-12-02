from django.shortcuts import render
from django.shortcuts import redirect
from django.core.mail import send_mail

def envia_email(request, emailOrName):
    send_mail('Recuperar Senha', 'http://localhost:3000/NewPassword', 'jnretti@usp.br', [emailOrName])
    return redirect('http://localhost:3000/AlreadySendFP')