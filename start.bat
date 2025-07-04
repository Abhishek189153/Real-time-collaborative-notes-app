@echo off
echo Starting Collaborative Notes App...
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause