git clone https://github.com/archstackapp/workspace-selection-app
cd workspace-selection-app
git filter-repo --to-subdirectory-filter frontend/workspace

cd ..
git remote add workspace workspace-selection-app
git fetch workspace --tags
git merge --allow-unrelated-histories workspace/master # or whichever branch you want to merge
git remote remove workspace