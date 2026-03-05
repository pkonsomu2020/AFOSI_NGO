@echo off
title AFOSI Project - Server Launcher
color 0A

echo.
echo ========================================
echo    AFOSI NGO - Development Servers
echo ========================================
echo.
echo This script will start all three servers:
echo   1. Backend API (Port 5000)
echo   2. Main Website (Port 8080)
echo   3. Admin Dashboard (Port 3000)
echo.
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed or not in PATH!
    echo.
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version
echo.
echo ========================================
echo.

REM Start Backend Server
echo [1/3] Starting Backend Server (Port 5000)...
if not exist "backend\node_modules" (
    echo [WARN] Backend dependencies not installed. Run 'npm install' in backend folder.
)
start "AFOSI Backend - Port 5000" cmd /k "cd backend && echo Starting Backend Server... && npm run dev"
timeout /t 2 /nobreak >nul
echo       Backend started in new window
echo.

REM Start Main Website
echo [2/3] Starting Main Website (Port 8080)...
if not exist "node_modules" (
    echo [WARN] Website dependencies not installed. Run 'npm install' in root folder.
)
start "AFOSI Website - Port 8080" cmd /k "echo Starting Main Website... && npm run dev"
timeout /t 2 /nobreak >nul
echo       Website started in new window
echo.

REM Start Admin Dashboard
echo [3/3] Starting Admin Dashboard (Port 3000)...
if not exist "ADMIN\node_modules" (
    echo [WARN] Admin dependencies not installed. Run 'npm install' in ADMIN folder.
)
start "AFOSI Admin - Port 3000" cmd /k "cd ADMIN && echo Starting Admin Dashboard... && npm run dev"
timeout /t 2 /nobreak >nul
echo       Admin started in new window
echo.

echo ========================================
echo    All Servers Started Successfully!
echo ========================================
echo.
echo Server URLs:
echo   Backend API:      http://localhost:5000
echo   Main Website:     http://localhost:8080
echo   Admin Dashboard:  http://localhost:3000
echo.
echo ========================================
echo.
echo [TIP] Each server is running in its own window.
echo       Close the windows to stop the servers.
echo.
echo [TIP] To stop all servers at once, close all
echo       terminal windows or press Ctrl+C in each.
echo.
echo ========================================
echo.
echo Press any key to close this launcher window...
echo (Servers will continue running in their windows)
pause >nul
