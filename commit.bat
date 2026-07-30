git add -A frontend/src/pages frontend/src/components
git commit -m "ui chnaged"

git add -A frontend/src/App.jsx frontend/src/main.jsx frontend/src/routes frontend/src/context frontend/src/services frontend/src/index.css frontend/src/utils
git commit -m "Update application layout and routing"

git add -A frontend/
git commit -m "Configure new frontend build and assets"

git add -A backend/models backend/package.json backend/package-lock.json backend/server.js
git commit -m "Optimize backend data models and configuration"

git add -A backend/
git commit -m "Refactor backend services and controllers"

git push
