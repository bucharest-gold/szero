#!/bin/bash

PUBLISH_DIR="publish"

git status -s | grep "^[MADRCU\? ][ MDMAU\?]"
if [[ $? -eq 0 && "$1" != "-f" ]]; then
  echo "You have changes in your working directory. Take care of that first, 'k?"
  echo "Override this, with the '-f' flag."
  exit 1;
fi

while true; do
  read -p "This will publish the API docs. Continue? [Y/n] " yn
  case $yn in
    [Nn]* ) echo "Aborting."; exit;;
    * ) echo "Continuing."; break;;
  esac
done

npm run docs
git clone git@github.com:bucharest-gold/szero.git $PUBLISH_DIR
cd $PUBLISH_DIR
git checkout gh-pages
mkdir tmp-doc
rsync -r ../docs/* ./
rsync -r ../docs/* ./tmp-doc/
git status -s | grep "^[MADRCU\? ][ MDMAU\?]"

if [ $? -eq 0 ]; then
  git add .
  echo "Commiting and publishing"
  git commit -a -m "Update docs"
  git push origin gh-pages
else
  echo "No changes to publish"
fi

cd ..
rm -rf $PUBLISH_DIR
