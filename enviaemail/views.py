from django.shortcuts import render
from django.shortcuts import redirect
from django.core.mail import send_mail

def envia_email_NewPassword(request):
    send_mail('PoliAdvisor - Recuperar Senha', 'http://localhost:3000/NewPassword', 'jnretti@usp.br', ['jnretti@gmail.com'])
    return redirect('http://localhost:3000/AlreadySendFP')

def envia_email_Login(request):
    send_mail('PoliAdvisor - Login', 'Parabéns!! Seu login foi realizado com sucesso', 'jnretti@usp.br', ['jnretti@gmail.com'])
    return redirect('http://localhost:3000/')