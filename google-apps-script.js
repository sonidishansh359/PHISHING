/**
 * GOOGLE APPS SCRIPT FOR SCHOLARSHIP WEB FORM
 * 
 * Instructions for Setup:
 * 1. Open your Google Spreadsheet: https://docs.google.com/spreadsheets/d/1f1UiPl_93apUQwGesImkawkr-zZWeCeocnN9zuR9Zt8/edit
 * 2. Click on 'Extensions' in the top menu, then select 'Apps Script'.
 * 3. Delete any code in the editor (like the default myFunction).
 * 4. Copy and paste all the code in this file into the editor.
 * 5. Click the 'Save' icon (floppy disk) or press Ctrl+S.
 * 6. Click on the 'Deploy' button in the top right, and select 'New deployment'.
 * 7. Click the Gear icon next to 'Select type' and choose 'Web app'.
 * 8. Configure the deployment:
 *    - Description: Scholarship Form Submission Web App
 *    - Execute as: Me (your email address)
 *    - Who has access: Anyone (this is important so the website can send data)
 * 9. Click 'Deploy'.
 * 10. Authorize the script if prompted (click "Review Permissions", select your Google account, click "Advanced" and then "Go to Untitled project (unsafe)", and click "Allow").
 * 11. Copy the "Web app URL" provided (it starts with https://script.google.com/macros/s/...).
 * 12. Paste this Web app URL into the website's Developer Settings panel (accessible via the Gear icon in the header).
 */

function doPost(e) {
  // Setup CORS headers for response
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };

  try {
    var ss;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {
      ss = null;
    }
    
    // Fallback if the script is standalone and not bound to the sheet
    if (!ss) {
      ss = SpreadsheetApp.openById("1f1UiPl_93apUQwGesImkawkr-zZWeCeocnN9zuR9Zt8");
    }
    
    var sheet = ss.getActiveSheet() || ss.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    // Define the column structure
    var columnNames = [
      "Timestamp", 
      "Full Name", 
      "Aadhar Card Number", 
      "Student City", 
      "College Name", 
      "College Address", 
      "Education Level", 
      "IFSC Code", 
      "Bank Account Number", 
      "Father's Occupation", 
      "Annual Income", 
      "12th Result (%)"
    ];
    
    // If sheet is completely empty, write the headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columnNames);
      // Format header row
      var range = sheet.getRange(1, 1, 1, columnNames.length);
      range.setFontWeight("bold");
      range.setBackground("#0052a5");
      range.setFontColor("#white");
      range.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Map the incoming form data to the columns
    var rowData = [
      new Date(), // Timestamp
      data.fullName || "",
      data.aadharNumber || "",
      data.studentCity || "",
      data.collegeName || "",
      data.collegeAddress || "",
      data.educationLevel || "",
      data.ifscCode || "",
      data.bankAccount || "",
      data.fatherOccupation || "",
      data.annualIncome || "",
      data.result12th || ""
    ];
    
    // Append the row
    sheet.appendRow(rowData);
    
    // Auto-fit columns to content
    for (var i = 1; i <= columnNames.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Application submitted successfully to Google Sheet!" 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// Handle preflight OPTIONS requests for CORS
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Scholarship API is running. Send POST request to submit form data.");
}
