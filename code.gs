/*
  Scripts for the FormSheet Demo project.
  On form submission/form open, grabs the list of the latest 10 fighters submitted and pushes them into the form's multiple-choice question. This way, the form is always showing the 10 most recent submissions.

  The Spreadsheet is linked to the Form, so the Google API allows form submissions to push updates directly to the spreadsheet without having to manually check for form submission changes. This allows us to seperate manual edits (onEdit) from form submissions (onSheetChange).

  When linked to the FORM, it should be triggered to run every time the form is opened.
  When linked to the SHEET, it should be triggered to run every time the sheet is updated by a form submission.
  The below structure is linked to the SHEET.

*/

  var linkedSheet = SpreadsheetApp.getActiveSpreadsheet(); // SpreadsheetApp.openByID('1vM5tDYsh08I9GfbwUGk7ZqbJ37GaLDsOQOQx6qhdyF8');
  var linkedForm = FormApp.openById('18fXPNVBK-JN40zXvqQsRPuJ68CBCeqYWApTNu6hS-Do');
  var responseSheet = linkedSheet.getSheetByName("Form Responses");
  var fighterSheet = linkedSheet.getSheetByName("Current Top 10");

  var topTen = []; var topMoves = []; var topQuote = []; //Separated arrays to make size more variable
  var prevTen = []; var prevMoves = []; var prevQuote = [];
  var lastBurnt = "";

  var topNum = 10;

function onSheetChange() {
  //
  var counter = 0;

  //1: Reorder the Responses so the most recent is on top. It would be less overhead to just move the newest submission to the top, but this covers our bases / any prior issues the system may have had updating. This also covers any internal syncing issues from the Google server, like if a submission goes through before the script is done running.
  reorderSubs();

  //2: Pulls the 10 most recent non-incinerated fighters from the list, as well as the most recent incineration.
  newTopTen();

  //3: Updates the form itself to show the NEW list of fighters
  updateForm();


  //fighterSheet.getRange('G2').setValue(counter);
  }

function reorderSubs() {
  subRange = responseSheet.getRange('A:I');
  subRange.sort({column:2, ascending:false});
}

function newTopTen() {
  //Iterate through all the rows in the submissions and grab the top 10 fighters.
  //Fighters cannot be incinerated, banned by a Mod, or anyone who skipped to the end.

  topTen = []; topMoves = []; topQuote = [];
  prevTen = []; prevMoves = []; prevQuote = [];
  count = 0;
  lastBurnt = "";

  //Grab the old top 10, which was updated at the last submission.
  for (i=0; i<=topNum; i++) {
    prevTen.push(fighterSheet.getRange(i+4,2).getValue());
    prevMoves.push(fighterSheet.getRange(i+4,3).getValue());
    prevQuote.push(fighterSheet.getRange(i+4,4).getValue());
  }

  //Calc # of rows (and columns) on the response sheet
  subRange = responseSheet.getRange('A:J');
  rangeCol = subRange.getNumColumns();
  //rangeRow = subRange.getLastRow(); //Inexplicably reads empty rows as having content in them. Oh, Google.
  rangeRow = 0;
  for (i = 1; i<subRange.getLastRow(); i++) {
    if (subRange.getCell(i,2).getValue()!="") rangeRow++;
    else {i=subRange.getLastRow()+1;}
    }
  
  //Load top 10 fighters into topTen array
  for (i=1; i<=rangeRow; i++) {
    if (subRange.getCell(i,1).getValue()==""
    && subRange.getCell(i,4).getValue() !=""){
      //Flogdor check
      if (subRange.getCell(i,9).getValue() != "Flogdor the Incinerator"){
        //Add to Top 10 if there is room.
        if (count < topNum) {
          //topTen.push(subRange.getCell(i,10).getValue());
          //topMoves.push(subRange.getCell(i,6).getValue());
          //topQuote.push(subRange.getCell(i,7).getValue());

          //Check if the guy I killed is on the prevlist. Then replace him
          killedGuy = prevTen.indexOf(subRange.getCell(i,9).getValue());
          if (killedGuy!=-1) {prevTen[killedGuy] = subRange.getCell(i,10).getValue(); prevMoves[killedGuy] = subRange.getCell(i,6).getValue(); prevQuote[killedGuy] = subRange.getCell(i,7).getValue();}
          
          count++;
          }
      }
      else if (lastBurnt=="") lastBurnt = subRange.getCell(i,10).getValue();
    }
  }

  //Update the Top 10 fighters

  topTen = prevTen; topMoves = prevMoves; topQuote = prevQuote;

  for (i=1; i<=topNum; i++) {
    fighterSheet.getRange(i+3, 2).setValue(topTen[i-1]);
    fighterSheet.getRange(i+3, 3).setValue(topMoves[i-1]);
    fighterSheet.getRange(i+3, 4).setValue(topQuote[i-1]);

    //fighterSheet.getRange(i+3, 7).setValue("its " + topTen[i-1]);
  }
  fighterSheet.getRange(15, 2).setValue(lastBurnt);

  fighterSheet.getRange('B:D').setHorizontalAlignment('center');
  fighterSheet.autoResizeColumn(2);

}

function updateForm() {
  items = linkedForm.getItems();
  opponentList = items[8].asMultipleChoiceItem();
  opList = opponentList.getChoices();
  endPage = items[9].asPageBreakItem();
  incinPage = items[10].asPageBreakItem(); //Hardcoded in for simplicity's sake. We can use getTitle on form Item elements to identify where we are.
  newOpList = [];
  newOpList.push(opponentList.createChoice('Flogdor the Incinerator', incinPage));
  for (i=0; i<topNum; i++) newOpList.push(opponentList.createChoice(topTen[i], endPage));
  //newOpList.push('The corpse of an incinerated soldier named "' + lastBurnt + '"'); //Leaving out the corpses until further notice...

  opponentList.setChoices(newOpList);

  //Debug
  /*for (i=0; i<newOpList.length; i++){
    fighterSheet.getRange(15+i,6).setValue(newOpList[i].getValue());
    fighterSheet.getRange('F28').setValue(items[10].getType());
  }*/
}


