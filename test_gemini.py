
from pathlib import Path
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini client
client = genai.Client()

# Project paths
BASE_DIR = Path(__file__).resolve().parent
BOOK_PATH = BASE_DIR / "extracted" / "85jkr_harrypotter_1_cleaned.txt"
SUMMARY_PATH = BASE_DIR / "extracted" / "summary.txt"


def main():
    # Check whether the cleaned book file exists
    if not BOOK_PATH.exists():
        raise FileNotFoundError(
            f"Cleaned book file not found: {BOOK_PATH}"
        )

    # Read the cleaned book
    book_text = BOOK_PATH.read_text(encoding="utf-8")

    if not book_text.strip():
        raise ValueError("The cleaned book file is empty.")

    # Use the first 5000 characters for testing
    sample_text = book_text[:5000]

    # Gemini prompt
    prompt = f"""
You are an AI book summarization assistant.

Summarize the following section of a book in simple,
clear language suitable for audiobook listeners.

Requirements:
- Keep the important events.
- Mention important characters.
- Do not invent information.
- Write approximately 150-200 words.
- Use natural, flowing sentences suitable for narration.

Book text:

{sample_text}
"""

    print("Generating book summary with Gemini...")

    # Generate summary
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    summary = (response.text or "").strip()

    if not summary:
        raise RuntimeError(
            "Gemini returned an empty summary."
        )

    # Ensure the output directory exists
    SUMMARY_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # Save summary for the TTS pipeline
    SUMMARY_PATH.write_text(
        summary,
        encoding="utf-8"
    )

    print("\n===== BOOK SUMMARY =====\n")
    print(summary)

    print("\n===== SUMMARY SAVED =====")
    print(f"Saved to: {SUMMARY_PATH}")
    print(f"Summary length: {len(summary)} characters")


if __name__ == "__main__":
    main()

