#!/usr/bin/env bash
# Navega até o diretório PoliAdvisor e executa o Gunicorn
cd PoliAdvisor

exec gunicorn PoliAdvisor.wsgi:application
