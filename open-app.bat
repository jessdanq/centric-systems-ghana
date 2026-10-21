@echo off
if not exist "%~dp0dist\index.html" (
    echo Building Centric Systems ERP...
    call npm run build
)
start "" "%~dp0dist\index.html"
