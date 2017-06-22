rm index.zip
cd src
zip -X -r ../index.zip *
cd ..
aws lambda update-function-code --function-name NAME_HERE --zip-file fileb://index.zip
