// Old project file from the 2020 project. Form + Sheet IDs redacted for privacy.
// This was used as a bespoke inventory system for the Garfield Neighbours non-profit. Because of COVID, community members needed a way to order clothing and uniforms donated from our clothing drive.
// Since we lacked a budget, this project was built as a way to allow community members to request donated items without having to mingle in a public space.
// This project had additional functions, such as auto-closing the form if the inventory was exhausted, and automatically removing reserved items from the inventory. The only manual actions required were entering new donated items into the inventory and reviewing incoming requests to watch out for duplicates.

var LIST_DATA = [{title:"Select an Item", sheet:"Inventory"}];

function updateLists() {
  var form = FormApp.getActiveForm();
  //var form = FormApp.openById("[REDACTED]");
  var items = form.getItems();
  for (var i = 0; i < items.length; i += 1){
    for (var j = 0; j < LIST_DATA.length; j+=1) {
      var item = items[i];

      if (item.getTitle() === LIST_DATA[0].title){
        updateListChoices(item.asCheckboxItem(), LIST_DATA[0].sheet);
        break;
    }
    }
  }
}

function updateListChoices(item, sheetName){
  var inventory = (SpreadsheetApp.openById("[REDACTED]")
              .getSheetByName("Inventory")
              .getDataRange()
              .getValues());
  var selected = (SpreadsheetApp.openById("[REDACTED]")
              .getSheetByName("Form Responses")
              .getDataRange()
              .getValues());

  var choices = [];
  var selectedReal = [];
  
  //Store form reponses from col 11 (L) in selectedReal[]
  for (var i = 0; i< selected.length; i+=1){
     selectedReal.push(selected[i][14]);selectedReal.push(selected[i][15]);selectedReal.push(selected[i][16]);
    selectedReal.push(selected[i][17]);selectedReal.push(selected[i][18]) 
  }
  
  //loops through inventory items in col 0 (A)
  //if in selectedReal[] we can't find this inventory item
  //  add it to the end of choices[]
  for (var i = 1; i< inventory.length; i+=1){
    if(selectedReal.indexOf(inventory[i][0])=== -1){
      choices.push(item.createChoice(inventory[i][0]))}
  }
  
  //If the inventory is exhausted, the form is unavailable for responses!
  //Otherwise, it sets the available inventory as the multiple choice list
  if (choices.length < 1) {
    var form = FormApp.getActiveForm();
    form.setAcceptingResponses(false); 
    //FormApp.getUi().alert('nothing left!');
  } else {
    //FormApp.getUi().alert('heress the bad code!!');
    if (item != choices) {item.setChoices(choices); }
  }
  
}

