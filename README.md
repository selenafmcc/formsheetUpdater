# formsheetUpdater
Maintains a dynamic Google Form on form submission. Spreadsheet automatically updates with new form submissions, and automatically restructures both the sheet and the form questions to show the most recent submissions.
In the style of a battle royale, if you submit an animal fighter, they will either be added to the roster of winners, or burnt to a crisp. These updates are visible instantly upon hitting "Submit". Entirely uses the Google Drive API, so I don't need to interfere at all. Since this is open to the public, I can ban certain entries if they're rude, all without deleting them from the response list.

# Demo
Live demo runs <a href="https://docs.google.com/forms/d/e/1FAIpQLScvLAqfzygjUU5dR8bXivg8eGSu3lgdCeTEIZ1eN4lNIcJLpQ/viewform?usp=dialog">here</a>. Spreadsheet publically visible <a href="https://docs.google.com/spreadsheets/d/1vM5tDYsh08I9GfbwUGk7ZqbJ37GaLDsOQOQx6qhdyF8/edit?usp=sharing">here</a>.
# Required Permissions
    https://www.googleapis.com/auth/forms
    https://www.googleapis.com/auth/spreadsheets
    https://www.googleapis.com/auth/script.container.ui

# Instructions
The script is connected to the Response Sheet, which is generated from the Form. Connecting the script to the sheet allows us to use the "on Form Submit" trigger, automatically running the script when the form is submitted. The form and sheet ID are hard-coded in, and can be changed. Certain values, like data columns and rows, will need to be modified if you are using this for your own sheet.
