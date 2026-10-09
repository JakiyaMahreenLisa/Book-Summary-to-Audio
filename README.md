# FastAPI Book Extractor — Book Summary to Audio

A Python project that extracts cleaned book text, generates a short summary using Google's Gemini API, and converts the summary into audiobook-style speech in WAV and MP3 formats.

## Features

- Read cleaned book text from a TXT file.
- Generate a book summary using Gemini.
- Save the generated summary automatically.
- Convert the summary into speech using Gemini TTS.
- Convert WAV audio to MP3 using FFmpeg.

## 1. Requirements

- Windows 10/11
- Python
- Visual Studio Code
- Gemini API key
- FFmpeg

## 2. Open the Project

Open the project folder in VS Code.

Example:

```powershell
cd E:\fastapi-book-extractor
```

Open a terminal using **Terminal → New Terminal**.

## 3. Create a Virtual Environment

Run this command once:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then activate the environment again:

```powershell
.\venv\Scripts\Activate.ps1
```

When successful, `(venv)` appears at the beginning of the terminal prompt.

## 4. Install Python Libraries

With the virtual environment activated, install the required packages:

```powershell
python -m pip install --upgrade pip
python -m pip install google-genai python-dotenv
```

Check whether the packages are installed:

```powershell
python -m pip show google-genai
python -m pip show python-dotenv
```

If the project includes a `requirements.txt` file, you can install its dependencies with:

```powershell
python -m pip install -r requirements.txt
```

## 5. Configure the Gemini API Key

Create a file named `.env` in the project root.

Add your API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual API key.

> **Security:** Never upload your API key or `.env` file to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
venv/
__pycache__/
output/
```

If the extracted book or generated summary contains copyrighted or private content, keep those files out of a public repository as well.

## 6. Check the Input Book File

The summary script expects this file:

```text
extracted/85jkr_harrypotter_1_cleaned.txt
```

This file is created by the upload step in [Section 9](#9-start-the-fastapi-server-and-upload-a-book). Make sure it exists in the correct folder before running the summary script.

The current test script processes only the first 5,000 characters of the book.

Expected project structure:

```text
fastapi-book-extractor/
├── venv/
├── .env
├── main.py
├── test_gemini.py
├── test_tts.py
├── extracted/
│   └── 85jkr_harrypotter_1_cleaned.txt
└── output/
```

The `summary.txt` file will be created automatically by `test_gemini.py`.

## 7. Install FFmpeg

FFmpeg is a separate system program used to convert WAV audio into MP3. Installing a Python library alone is not sufficient.

### Option A: Install FFmpeg using Winget

Open PowerShell or the VS Code terminal and run:

```powershell
winget install --id Gyan.FFmpeg.Shared -e
```

If Winget reports that FFmpeg is already installed, continue to the verification steps.

### Option B: Check whether FFmpeg is already installed

Run:

```powershell
ffmpeg -version
```

Then:

```powershell
ffprobe -version
```

Check the executable location:

```powershell
where.exe ffmpeg
```

**If all commands work:** FFmpeg is installed and accessible through PATH. Skip to [Section 9](#9-start-the-fastapi-server-and-upload-a-book).

**If `ffmpeg` is not recognized:** follow [Section 8](#8-configure-ffmpeg-path-in-windows-and-vs-code).

## 8. Configure FFmpeg PATH in Windows and VS Code

Only follow this section if FFmpeg is installed but the terminal cannot recognize the command.

### Step 1: Find `ffmpeg.exe`

Run:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName
```

Example output:

```text
C:\Users\USER\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build-shared\bin\ffmpeg.exe
```

The folder containing `ffmpeg.exe` is the folder that must be added to PATH. Do not add the executable file itself.

### Step 2: Verify the executable directly

Copy your actual path and run this command, replacing the example path:

```powershell
& "C:\path\to\ffmpeg\bin\ffmpeg.exe" -version
```

If the version appears, the executable works.

If it fails, check the path or reinstall FFmpeg.

### Step 3: Add FFmpeg to User PATH

The following script searches for `ffmpeg.exe`, finds its `bin` folder, and adds that folder to the Windows User PATH only if it is not already present.

```powershell
$ffmpegExe = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1

if ($null -eq $ffmpegExe) {
    Write-Host "FFmpeg was not found. Install FFmpeg first."
}
else {
    $ffmpegBin = $ffmpegExe.DirectoryName

    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")

    $pathEntries = @(
        $userPath -split ';' |
        Where-Object { $_ }
    )

    if ($pathEntries -contains $ffmpegBin) {
        Write-Host "FFmpeg is already in User PATH."
    }
    else {
        $newUserPath = (@($pathEntries) + $ffmpegBin) -join ';'

        [Environment]::SetEnvironmentVariable(
            "Path",
            $newUserPath,
            "User"
        )

        Write-Host "FFmpeg added to User PATH."
    }

    # Make FFmpeg available in the current terminal too.
    if (($env:Path -split ';') -notcontains $ffmpegBin) {
        $env:Path += ";$ffmpegBin"
    }

    Write-Host "FFmpeg folder: $ffmpegBin"
}
```

### Step 4: Verify PATH

Run:

```powershell
ffmpeg -version
```

```powershell
ffprobe -version
```

```powershell
where.exe ffmpeg
```

If these commands work, PATH is configured correctly.

### Step 5: If FFmpeg works in PowerShell but not VS Code

VS Code may have been opened before the PATH change.

1. Save your work.
2. Close all VS Code windows.
3. Reopen VS Code.
4. Open a new terminal.
5. Activate the virtual environment again if necessary:

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

6. Test:

   ```powershell
   ffmpeg -version
   ```

Python's virtual environment normally does not need a separate FFmpeg installation. FFmpeg must simply be accessible from the terminal's PATH.

### Temporary PATH fix

If you know the correct FFmpeg `bin` folder but do not want to restart VS Code yet, run:

```powershell
$env:Path += ";C:\path\to\ffmpeg\bin"
```

Replace the example with your actual folder path.

Then test:

```powershell
ffmpeg -version
```

This temporary change applies only to the current terminal session.

## 9. Start the FastAPI Server and Upload a Book

Before generating a summary or audio, upload a book through the FastAPI Swagger UI.

### Step 1: Start the FastAPI Server

Open the VS Code terminal and navigate to the project root:

```powershell
cd E:\fastapi-book-extractor
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Start the FastAPI development server:

```powershell
python -m uvicorn main:app --reload
```

> **Note:** This command assumes your FastAPI application is defined in `main.py` as `app = FastAPI()`. If your application uses a different filename or variable name, update the command accordingly.

Keep this terminal running while using the API.

### Step 2: Open Swagger UI

Open your browser and visit:

```text
http://127.0.0.1:8000/docs
```

This page provides an interactive interface for testing the FastAPI endpoints.

### Step 3: Upload the Book

1. Find the book upload endpoint, usually named `POST /upload` or something similar.
2. Click the endpoint to expand it.
3. Click **Try it out**.
4. Click **Choose File** and select your PDF or EPUB book.
5. Click **Execute** to submit the upload request.
6. Check the response to confirm whether the upload succeeded.

The exact endpoint name and accepted file formats depend on the implementation of this project.

### Step 4: Verify the Extracted Text

After a successful upload, check the API response for the uploaded filename, processing status, or output file location.

If the API extracts and cleans the text automatically, verify that the cleaned text file has been created in the expected folder.

For example:

```text
extracted/
└── 85jkr_harrypotter_1_cleaned.txt
```

The filename above is only an example. Use the actual output filename created by your upload endpoint.

### Step 5: Generate the Summary

After confirming that the cleaned text file exists at the path expected by the summary script, open a **second** VS Code terminal and activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Run:

```powershell
python test_gemini.py
```

The script will read the cleaned book text, send the first 5,000 characters to Gemini, print the summary in the terminal, and save it to:

```text
extracted/summary.txt
```

### Step 6: Generate the Audio

After the summary has been saved, run:

```powershell
python test_tts.py
```

The script will read `extracted/summary.txt`, send up to 1,500 characters to the configured Gemini TTS model, save the WAV file, and use FFmpeg to convert it into MP3.

The output files are:

```text
output/
├── summary.wav
└── summary.mp3
```

Check the generated files:

```powershell
Get-ChildItem .\output\
```

Check MP3 metadata and duration:

```powershell
ffprobe -hide_banner .\output\summary.mp3
```

## 10. Quick Start — Commands in Order

Once the initial setup is complete, follow these steps whenever you want to process a book.

**Step 1: Activate the virtual environment** (terminal 1)

```powershell
.\venv\Scripts\Activate.ps1
```

**Step 2: Start the FastAPI server** (keep it running)

```powershell
python -m uvicorn main:app --reload
```

**Step 3: Upload the book**

Open `http://127.0.0.1:8000/docs`, use the upload endpoint, and confirm the cleaned text file is created in `extracted/`.

**Step 4: Generate the summary** (terminal 2, after activating the virtual environment)

```powershell
python test_gemini.py
```

**Step 5: Generate the audio**

```powershell
python test_tts.py
```

You must run the summary script before the TTS script whenever you need fresh audio from a new book section.

## 11. Troubleshooting

| Problem                              | Solution                                                    |
| ------------------------------------ | ----------------------------------------------------------- |
| `ffmpeg is not recognized`           | Follow Section 8 and restart VS Code if necessary.          |
| `Summary not found`                  | Run `python test_gemini.py` first.                          |
| Cleaned book file not found          | Upload the book first (Section 9) and verify the file name. |
| `Could not import module "main"`     | Check the filename and `app` variable in the uvicorn command. |
| Gemini API key error                 | Check `.env` and the API key.                               |
| Model not found or unavailable       | Check the model ID and confirm API access for your account. |
| WAV-to-MP3 conversion fails          | Check `ffmpeg -version` and review the FFmpeg error output. |
| Virtual environment activation fails | Use the process-scoped execution policy in Section 3.       |

A Gemini SDK warning about automatic function calling (AFC) does not necessarily mean the request failed. Check whether the summary was generated and saved.

## Important Notes

- The FastAPI server handles book upload and text extraction. Summary and TTS generation run as separate test scripts (`test_gemini.py`, `test_tts.py`), not as a production service.
- The model IDs used by the scripts must be supported by your installed Google Gen AI SDK and available to your API account.
- FFmpeg is used for audio conversion; the Gemini API generates the summary and speech.
- Use only books and documents you have permission to process.
