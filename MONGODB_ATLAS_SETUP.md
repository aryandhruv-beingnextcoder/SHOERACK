# MongoDB Atlas Setup Guide

## Steps to migrate from local MongoDB to MongoDB Atlas:

### 1. Create MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
- Sign up for a free account
- Create a new project

### 2. Create a Cluster
- Click "Build a Database"
- Choose "FREE" tier (M0 Sandbox)
- Select your preferred cloud provider and region
- Name your cluster (e.g., "shoerack-cluster")

### 3. Configure Database Access
- Go to "Database Access" in the left sidebar
- Click "Add New Database User"
- Choose "Password" authentication
- Create username and password (save these!)
- Set privileges to "Read and write to any database"

### 4. Configure Network Access
- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- Choose "Allow access from anywhere" (0.0.0.0/0) for development
- Or add your specific IP address for production

### 5. Get Connection String
- Go to "Database" in the left sidebar
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string

### 6. Update Environment Variables
Replace the connection string in your `.env` file:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/shoerack?retryWrites=true&w=majority
```

Replace:
- `<username>` with your database username
- `<password>` with your database password
- `<cluster-name>` with your actual cluster name

### 7. Test Connection
Run your backend server:
```bash
cd backend
npm start
```

You should see: "✅ MongoDB Atlas connected successfully"

### 8. Migrate Data (Optional)
If you have existing data in local MongoDB, you can:
- Export data using `mongodump`
- Import to Atlas using `mongorestore`
- Or use MongoDB Compass for GUI-based migration

## Security Best Practices
- Use strong passwords for database users
- Restrict IP access in production
- Enable MongoDB Atlas monitoring
- Regular backups are automatically handled by Atlas

## Benefits of MongoDB Atlas
- Automatic backups
- Built-in security features
- Global clusters
- Performance monitoring
- Automatic scaling
- 24/7 support