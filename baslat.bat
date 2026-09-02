@echo off
title Pars Yabanci Dil Kurslari Portal
echo Pars Yabanci Dil Kurslari Portali Baslatiliyor...
start http://localhost:5173
python -m http.server 5173 --bind 127.0.0.1
pause
