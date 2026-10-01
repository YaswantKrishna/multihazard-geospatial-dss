@echo off
echo =======================================================================
echo  MULTIHAZARD DSS - PUSH TO GITHUB (YaswantKrishna)
echo =======================================================================
cd /d "%~dp0\.."

echo 1. Ensure you have created the repository 'multihazard-geospatial-dss'
echo    at https://github.com/new under the account YaswantKrishna
echo.
echo 2. Pushing main branch to https://github.com/YaswantKrishna/multihazard-geospatial-dss.git ...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo  SUCCESS: Code pushed to GitHub!
    echo  URL: https://github.com/YaswantKrishna/multihazard-geospatial-dss
    echo =======================================================================
) else (
    echo.
    echo If prompted for password, use a GitHub Personal Access Token (PAT):
    echo Create one at: https://github.com/settings/tokens (classic, with 'repo' scope)
)
pause
