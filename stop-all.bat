@echo off
title AFOSI Project - Stop All Servers
color 0C

echo.
echo ========================================
echo    AFOSI NGO - Stop All Servers
echo ========================================
echo.
echo This script will stop all running servers:
echo   - Backend API (Port 5000)
echo   - Main Website (Port 8080)
echo   - Admin Dashboard (Port 3000)
echo.
echo ========================================
echo.

REM Kill Node.js processes running on specific ports
echo [1/3] Stopping Backend Server (Port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo       Backend server stopped
    )
)

echo.
echo [2/3] Stopping Main Website (Port 8080)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo       Website server stopped
    )
)

echo.
echo [3/3] Stopping Admin Dashboard (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo       Admin server stopped
    )
)

echo.
echo ========================================
echo    All Servers Stopped!
echo ========================================
echo.
echo All development servers have been terminated.
echo You can now restart them using start-all.bat
echo.
echo ========================================
echo.
pause
