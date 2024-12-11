from django.shortcuts import render
from django.shortcuts import redirect
from django.core.mail import send_mail

def envia_email_NewPassword(request):
    send_mail('PoliAdvisor - Recuperar Senha', 'http://localhost:3000/NewPassword', 'jnretti@usp.br', ['bruno.lossmachado@usp.br'])
    return redirect('http://localhost:3000/AlreadySendFP')

def envia_email_Login(request):
    send_mail('PoliAdvisor - Cadastro', 'Parabéns!! Seu cadastro foi realizado com sucesso', 'jnretti@usp.br', ['bruno.lossmachado@usp.br'])
    return redirect('http://localhost:3000/')