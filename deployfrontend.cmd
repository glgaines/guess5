robocopy src docs /e
robocopy build\contracts docs
git add .
git commit -m "adding front end files for Github Pages"
git push
