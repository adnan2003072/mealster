# Mealster

## Project setup

This guide will walk you through setting up the **Ollama** project.

### 1. Install Ollama

To get started, you need to download and install Ollama. Follow the steps below:

- Visit the [Ollama website](https://www.ollama.com/) to download the installer for your operating system.
- Once downloaded, follow the installation instructions provided by the installer.

After installing Ollama, you can proceed to download the necessary project files.

### 2. Download Project Files

Download the `wizardlm2:7b` LLM using Ollama:

```sh
ollama pull wizardlm2:7b
```

### 3. Setup the website

Next, you need to set up the website by following these steps:

#### Install Dependencies for Next.js App
Navigate to the `/client` directory and install the dependencies for the Next.js app:

```sh
cd client
npm install
```

#### Configure Environment Variables
Update the environment variables in the .env file:

- MONGODB_URI="your-mongoDB-connection-URI"
- GOOGLE_CLIENT_ID="your-google-client-id"
- GOOGLE_CLIENT_SECRET="your-google-client-secret"

Replace "your-mongoDB-connection-URI", "your-google-client-id", and "your-google-client-secret" with your actual MongoDB connection URI and Google Cloud credentials.

### 4. Run the project
Now, you're ready to run the project:

#### Run the Flask API
Navigate to the `/api` folder and run the API:

```sh
python main.py
```

#### Host the Next.js app

return to the `/client` directory and host the Next.js app:

```sh
npm run dev
```

This will start the development server for the Next.js app.
Once both the Flask API and Next.js app are running, you can access the project in your web browser from this url: `http://localhost:3000`.
That's it! You've successfully set up the Ollama project. Happy coding! 🚀
