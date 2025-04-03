

echo "Starting Keeviqo platform..."

pg_isready -h localhost -p 5432 > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "PostgreSQL is not running. Please start PostgreSQL first."
  exit 1
fi

npm run dev
