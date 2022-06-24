git clone https://github.com/archstackapp/inventory-app
cd inventory-app
git filter-repo --to-subdirectory-filter frontend/inventory

cd ..
git remote add inventoryapp inventory-app
git fetch inventoryapp --tags
git merge --allow-unrelated-histories inventoryapp/master # or whichever branch you want to merge
git remote remove inventoryapp