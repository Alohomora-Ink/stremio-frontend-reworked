# Rebuild
docker build -t stremio-app .

# Run
docker run -p 3000:3000 --name stremio-test stremio-app