if (getCookie("jsonView") == "false"){
   hideShowJSON();
}

if (getCookie("sides") == "TreeRight") {
   swapSides();
}

if (getCookie("showElementButtons") == "true") {
   document.getElementById(']....}?|?|?{....[TreeToJSON_ShowDeleteElements').checked = true;
} else {
	document.getElementById(']....}?|?|?{....[TreeToJSON_ShowDeleteElements').checked = false;
}

if (getCookie("TreeToJSONrealtime") == "true"){
	document.getElementById(']....}?|?|?{....[TreeToJSON_RealTime').checked = true;
} else {
	document.getElementById(']....}?|?|?{....[TreeToJSON_RealTime').checked = false;
}

var indentSize = 20;

var file = "file.png";
var folder = "folder.png";
var closedfolder = "closed-folder-transparent.png";

var json;
var hovertext_json = {};

//var lodash = false;

var folderCount = 0;

var htmlBlocks = {};
var jsonBlocks = {};

var hashDict = 0;

var acceptableExtensions = [".txt", ".json", ".js", ".ts", ".tex", ".rtf", ".odt", ".wpd", ".text"]

//NOT MY CODE below
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Only uses this imported script if they're using Internet Explorer.
if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    var bluebirdscript = document.createElement("script");
    bluebirdscript.src = "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js";
    bluebirdscript.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(bluebirdscript);
}

document.getElementById(']....}?|?|?{....[jsonFile').addEventListener('change', loadJsonFile);

function loadJsonFile(event){
  const input = event.target;
  if ('files' in input && input.files.length > 0) {
	  placeFileContent(input.files[0]);
  }
}

function placeFileContent(file) {
   readFileContent(file).then(function(content) { json = JSON.parse(content); buildTree(true); convertTreeToJSON(); }).catch( function(error) { console.log(error) });
}

function readFileContent(file) {
   const reader = new FileReader();
   return new Promise(function(resolve, reject) { reader.onload = function(event) { resolve(event.target.result) };  reader.onerror = function(error) { reject(error) }; reader.readAsText(file); })
}

function cleanDictionary(el) {
  function internalClean(el) {
    return _.transform(el, function(result, value, key) {
      var isCollection = _.isObject(value);
      var cleaned = isCollection ? internalClean(value) : value;

      if (isCollection && _.isEmpty(cleaned)) {
        return;
      }

      if (_.isArray(result)){
		  if (typeof cleaned !== "undefined"){
			  result.push(cleaned);
		  }
	  } else {
		 result[key] = cleaned;
	  }
    });
  }
  return _.isObject(el) ? internalClean(el) : el;
}

function hashCode(dictString) {
  var hash = 0, i, chr;
  if (dictString.length === 0) return hash;
  for (i = 0; i < dictString.length; i++) {
    chr   = dictString.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    //hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

window.addEventListener("beforeunload", function (e) {
	var previousCheck = document.getElementById("]....}?|?|?{....[keepFields").checked;
	document.getElementById("]....}?|?|?{....[keepFields").checked = true;
    if (hashDict != 0 && hashDict != hashCode(JSON.stringify(TreeToJSON()))) {
		document.getElementById("]....}?|?|?{....[keepFields").checked = previousCheck;
		var confirmMessage = 'If you leave this page your changes to the form will be lost.';
		(e || window.event).returnValue = confirmMessage; //Gecko + IE
		return confirmMessage; //Gecko + Webkit, Safari, Chrome etc.
	}
	document.getElementById("]....}?|?|?{....[keepFields").checked = previousCheck;
}); 
//END OF NOT MY CODE

function convertTreeToJSON(){
   var treeToJsonDict = TreeToJSON();
   var jsonToSave = JSON.stringify(treeToJsonDict, null, 2).replace(/"{\[{NeGaTiVe!_!0}]}"/g, "-0").replace(/([^\r])\n/g, "$1\r\n");
   jsonToSave = jsonToSave.replace(/"{\[{NeGaTiVe!_!0pointZERO}]}"/g, "-0.0");
   document.getElementById("]....}?|?|?{....[jsonTextArea").value = jsonToSave;
   //json = JSON.parse(jsonToSave); //I recently commented out this line, is it not needed at all?
   return treeToJsonDict;
}

function convertJSONToTree(){
     try {
        var convertingJSON = JSON.parse(document.getElementById("]....}?|?|?{....[jsonTextArea").value);
        json = convertingJSON;
        buildTree(true);
     } catch(err){
		 try {
			//CRASH();
			var jsonTextAreaChecked = document.getElementById("]....}?|?|?{....[jsonTextArea").value.trim();
			if (jsonTextAreaChecked[0] === "[" || jsonTextAreaChecked[0] === "{") {
				
				var dictionaryParse;
				eval('dictionaryParse = ' + jsonTextAreaChecked);
				var dictionaryToJSON = JSON.stringify(dictionaryParse);
				var convertingJSON = JSON.parse(dictionaryToJSON);
				
				if (confirm("Invalid JSON formatting, but changes can be made to the input to make it work. The most common problem that gets fixed is having integers as the keyname or a misplaced comma. Do you want your JSON to be automatically corrected?")) {
					json = convertingJSON;
					buildTree(true);
					convertTreeToJSON();
				} else {
					// Do nothing!
				}
				

			} else {
				CRASH();
			}
		 } catch(err) {
			alert("Invalid JSON formatting");
		 }
     }
}

function swapSides() {
   if (document.getElementsByClassName("chart")[0].style.float == "right"){
      document.getElementsByClassName("chart")[0].style.float = "left";
      document.getElementsByClassName("jsonArea")[0].style.float = "right";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").innerHTML = "<b>Convert Tree to JSON ➡</b>";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.right = "auto";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.marginRight = "auto";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.left = "50%";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.marginLeft = "-210px";      
      document.getElementById("]....}?|?|?{....[convertToTreeButton").innerHTML = "<b>⬅ Convert JSON to Tree</b>";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.left = "auto";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.marginLeft = "auto";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.right = "50%";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.marginRight = "-210px";
      document.cookie = "sides=TreeLeft;";
   } else {
      document.getElementsByClassName("chart")[0].style.float = "right";
      document.getElementsByClassName("jsonArea")[0].style.float = "left";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").innerHTML = "<b>⬅ Convert Tree to JSON</b>";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.left = "auto";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.marginLeft = "auto";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.right = "50%";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.marginRight = "-210px";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").innerHTML = "<b>Convert JSON to Tree ➡</b>";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.right = "auto";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.marginRight = "auto";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.left = "50%";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.marginLeft = "-210px";
      document.cookie = "sides=TreeRight;";
   }
}

function hideShowJSON(){
   if (document.getElementById("]....}?|?|?{....[jsonArea").style.display != "none"){
      document.getElementById("]....}?|?|?{....[jsonArea").style.display = "none";
      document.getElementById("]....}?|?|?{....[hideJSONButton").innerHTML = "<b>Show JSON View</b>";
      document.getElementById("]....}?|?|?{....[bottomSection").style.height = "auto";
      document.getElementsByClassName("swapButton")[0].style.display = "none";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.display = "none";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.display = "none";
      document.getElementsByClassName("chart")[0].style.width = "100%";
      document.cookie = "jsonView=false";
   } else {
      document.getElementById("]....}?|?|?{....[jsonArea").style.display = "block";
      document.getElementById("]....}?|?|?{....[hideJSONButton").innerHTML = "<b>Hide JSON View</b>";
      //document.getElementById("]....}?|?|?{....[bottomSection").style.height = "81%";
      document.getElementById("]....}?|?|?{....[bottomSection").style.height = "calc(100vh - 146px)";
      document.getElementsByClassName("swapButton")[0].style.display = "inline";
      document.getElementById("]....}?|?|?{....[convertToJSONButton").style.display = "inline";
      document.getElementById("]....}?|?|?{....[convertToTreeButton").style.display = "inline";
      document.getElementsByClassName("chart")[0].style.width = "50%";
      document.cookie = "jsonView=true";
   }
}

function TreeToJSONsetting(){
	if (document.getElementById("]....}?|?|?{....[TreeToJSON_RealTime").checked) {
		document.cookie = "TreeToJSONrealtime=true;";
	} else {
		document.cookie = "TreeToJSONrealtime=false;";
	}
}

function deleteEmptyFields (){
   var previousCheck = document.getElementById("]....}?|?|?{....[keepFields").checked;
   document.getElementById("]....}?|?|?{....[keepFields").checked = true;
   var hashBefore = hashCode(JSON.stringify(TreeToJSON()));
   document.getElementById("]....}?|?|?{....[keepFields").checked = false;
   var dict = TreeToJSON();
   var hashAfter = hashCode(JSON.stringify(dict));
   if (hashBefore != hashAfter){
      //Warning
      if (confirm('Are you sure you want to delete these empty field(s)')) {
        json = dict;
        buildTree(true);
      }
   } else {
      toastNothingToDelete();
   }
   document.getElementById("]....}?|?|?{....[keepFields").checked = previousCheck;
}

function BlankCheckBoxReadWrite(){
   if (!document.getElementById("]....}?|?|?{....[treeWriteChecked").checked) {
		document.getElementById("]....}?|?|?{....[treeWriteChecked").checked = true;
		document.getElementById("]....}?|?|?{....[treeReadChecked").checked = false;
		switchReadWrite();
		document.getElementById("]....}?|?|?{....[treeWriteChecked").checked = false;
		document.getElementById("]....}?|?|?{....[treeReadChecked").checked = true;
		switchReadWrite();
   }
}

function switchReadWrite(){
    var allInputs = document.getElementsByTagName("input");
	var allAddButtons = document.getElementsByClassName("addButton");
	var allMinusButtons = document.getElementsByClassName("minusButton");
	var onlyTextBoxes = [];
	for (var i = 0; i < allInputs.length; i++) {
		if((allInputs[i].type.toLowerCase() == 'text' || allInputs[i].type.toLowerCase() == 'number' || allInputs[i].type.toLowerCase() == 'hidden')) {
			onlyTextBoxes.push(allInputs[i]);
		}
	}
	allInputs = onlyTextBoxes;
	if (document.getElementById("]....}?|?|?{....[treeWriteChecked").checked) {
	   for (var i in allInputs) {
	      allInputs[i].style.display = "inline";
		  if (allInputs[i].id.substring(0, 18) != "]....}?|?|?{....[_") {
			allInputs[i].nextSibling.nextSibling.style.display = "none";
		  }
	   }
	   for (var j = 0; j < allAddButtons.length; j++) {
		  allAddButtons[j].style.display = "inline";
	   }
	   
	   if (document.getElementById("]....}?|?|?{....[TreeToJSON_ShowDeleteElements").checked) {
			for (var i in allMinusButtons){
			try {
				allMinusButtons[i].style.display = "inline";
			} catch(err){
				//Skips it;
			}
		   }
		}

	} else {
		var i = 0;
		while (i < allInputs.length) {
		  allInputs[i].style.display = "none";
		  if (allInputs[i].id.substring(0, 18) != "]....}?|?|?{....[_") {
				allInputs[i].nextSibling.nextSibling.style.display = "inline";
		  }
          if (allInputs[i].type.toLowerCase() != 'hidden' && allInputs[i].id.substring(0, 18) != "]....}?|?|?{....[_") {
		     if (typeof allInputs[i].value == typeof "" && allInputs[i].value.substring(0, 4).toLowerCase() == "http"){
			    allInputs[i].nextSibling.nextSibling.innerHTML = '(' + '<a href="' + allInputs[i].value + '">' + allInputs[i].value + '</a>)';
			 } else {
		        allInputs[i].nextSibling.nextSibling.innerHTML = "(" + allInputs[i].value + ")";
		     }
          } else {
			 var numberOfBoxes = simpleArrayTracker[allInputs[i].getAttribute("data-newid")];
			 var allListBoxValues = [];
			 for (var j = 0; j < numberOfBoxes; j++) {
				 i++;
                 if (!(!document.getElementById("]....}?|?|?{....[keepFields").checked && allInputs[i].value == "")) {
						allListBoxValues.push(allInputs[i].value);
				 }
			 }
			 allInputs[i-numberOfBoxes].nextSibling.nextSibling.innerHTML = "(" + allListBoxValues.toString() + ")";
          }
		  i++;
		}
	    for (var j = 0; j < allAddButtons.length; j++) {
		  allAddButtons[j].style.display = "none";
	    }
	   if (document.getElementById("]....}?|?|?{....[TreeToJSON_ShowDeleteElements").checked) {
			for (var i in allMinusButtons){
				try {
					allMinusButtons[i].style.display = "none";
				} catch(err){
					//Skips it;
				}
		   }
	   }
	}
}

function SaveTreeToJSON(){
    var saveJSONfile = prompt("Filename for the JSON you're saving", "Resource JSON file.txt");
    
	if (saveJSONfile != null) {
        var dict = TreeToJSON();
        
	    if (saveJSONfile.indexOf(".") == -1 || acceptableExtensions.indexOf(saveJSONfile.substring(saveJSONfile.lastIndexOf("."), saveJSONfile.length)) == -1) {
		   saveJSONfile = saveJSONfile + ".txt";		   
		}
        
        var jsonToSave = JSON.stringify(dict, null, 2).replace(/"{\[{NeGaTiVe!_!0}]}"/g, "-0").replace(/([^\r])\n/g, "$1\r\n");
        jsonToSave = jsonToSave.replace(/"{\[{NeGaTiVe!_!0pointZERO}]}"/g, "-0.0");

        if (navigator.msSaveBlob) { // IE 10+ 
          navigator.msSaveBlob(new Blob([jsonToSave], { type: 'data:text/plain;charset=utf-8;' }), saveJSONfile);
        } else {
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonToSave));
          element.setAttribute('download', saveJSONfile);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
		hashDict = hashCode(JSON.stringify(dict));
    }
}

function TreeToJSON(){
		var dict = json;
		if (!document.getElementById("]....}?|?|?{....[keepFields").checked) {;
			dict = JSON.parse(JSON.stringify(json));			//THIS CODE MIGHT NOT BE NEEDED
		}
		
        var allInputs = document.getElementsByTagName("input");
        		
		var onlyTextBoxes2 = [];
		for(var i = 0; i < allInputs.length; i++) {
            if(allInputs[i].type.toLowerCase() == 'text' || allInputs[i].type.toLowerCase() == 'number') {
                onlyTextBoxes2.push(allInputs[i]);
            }
        }

        allInputs = onlyTextBoxes2;
        
        for (x in allInputs) {
		
		  var paths2 = fieldIDs[allInputs[x].getAttribute("data-newid")];
		  var jsonPath = dict;
		  for (var y = 0; y < paths2.length - 1; y++){
			  jsonPath = jsonPath[paths2[y][0]];		  
			  var pathIndex = paths2[y][1];
			  if (pathIndex){
				  jsonPath = jsonPath[pathIndex];
			  }
		  }
		  
		  pathIndex = paths2[paths2.length - 1][1];
		  var inputValue = allInputs[x].value;
		  
		  if (!document.getElementById("]....}?|?|?{....[keepFields").checked && inputValue == "") {
            //DON'T SAVE THE INPUT IF IT IS BLANK and the checkbox is unchecked
			  if (pathIndex) {
				  //jsonPath[paths2[paths2.length - 1][0]][pathIndex] = "";
				  delete jsonPath[paths2[paths2.length - 1][0]][pathIndex];
			  } else {
				  //jsonPath[paths2[paths2.length - 1][0]] = "";
				  delete jsonPath[paths2[paths2.length - 1][0]];
			  }
          } else {
			  if (inputValue == "null"){
				  inputValue = null;
			  } else if (inputValue == "false") {
				  inputValue = false;
		      } else if (inputValue == "true") {
				  inputValue = true;
			  } else if (allInputs[x].type == "number") {
				  inputValue = inputValue.replace(/\s+/g, '');
				  if (inputValue == "" || inputValue == "-0." || inputValue == "-0.0" || inputValue == "-0.00" || inputValue == "-0.000" || inputValue == "-0.0000") {
					  inputValue = "{[{NeGaTiVe!_!0pointZERO}]}";
				  } else if (inputValue == "-0") {
					  inputValue = "{[{NeGaTiVe!_!0}]}";
				  } else {
					  if (inputValue.indexOf(".")) {
						 inputValue = parseFloat(inputValue);
					  } else {
						  inputValue = Number(inputValue);
					  }
				  }
			  } else {
				  //If it's a regular string.
			  }
			  			  
			  var pathIndex = paths2[paths2.length - 1][1];
			  if (pathIndex) {
				  jsonPath[paths2[paths2.length - 1][0]][pathIndex] = inputValue;
			  } else {
				  jsonPath[paths2[paths2.length - 1][0]] = inputValue;
			  }
		  }
		}
		
        if (!document.getElementById("]....}?|?|?{....[keepFields").checked) {
           dict = cleanDictionary(dict);
        }
		
		return dict;
}

function toggleHideShow(folderImage, id){
   if (document.getElementById(id).style.display == 'none') {
       folderImage.src = folder;
       document.getElementById(id).style.display = 'block';
   } else {
       folderImage.src = closedfolder;
       document.getElementById(id).style.display = 'none';
   }
}

//Clicking the parent most folder will execute this function. It will collapse all if all the folders are open. If at least one folder is collapsed then it will expand all.
function toggleAllFolders(){
	var folderImages = document.getElementsByName("_$-$_ImAgEFoLdEr");
	var expandAll = false;
	for (var i = 0; i < folderImages.length; i++) {
		var folderID = folderImages[i].getAttribute("data-folderid");
		if (document.getElementById("_$-$_FoLdEr" + folderID).style.display == 'none') {
			expandAll = true;
			break;
		}
	}
	if (expandAll) {
		expandAllFolders();
	} else {
		collapseAllFolders();
	}
}

function expandAllFolders(){
	var folderImages = document.getElementsByName("_$-$_ImAgEFoLdEr");
	for (var i = 0; i < folderImages.length; i++) {
		var folderID = folderImages[i].getAttribute("data-folderid");
		folderImages[i].src = folder;
		document.getElementById("_$-$_FoLdEr"+folderID).style.display = 'block';
	}
}

function collapseAllFolders(){
	var folderImages = document.getElementsByName("_$-$_ImAgEFoLdEr");
	for (var i = 0; i < folderImages.length; i++) {
		var folderID = folderImages[i].getAttribute("data-folderid");
		folderImages[i].src = closedfolder;
		document.getElementById("_$-$_FoLdEr"+folderID).style.display = 'none';
	}
}

function clearDictionary(dict){
	for (var x in dict){
		if (typeof dict[x]  == typeof "" ){
			dict[x] = "";
		} else if (typeof dict[x] == typeof 1){
			dict[x] = -0;
		} else if (dict[x] == null || typeof dict[x] != typeof {}) {
		} else {
			if (!Array.isArray(dict[x])){
				//Dictionary
				clearDictionary(dict[x]);
			} else if (Array.isArray(dict[x])){
				//List
				if (typeof dict[x][0] == typeof {}) {
					//List of dictionaries
					for (var entry in dict[x]) {
						clearDictionary(dict[x][entry]);
					}
				} else {
					//List of other
					dict[x] = [];
				}
			}
		}
	}
	return dict;
}

function JSON_Walk(elementID){
   walkJson = json;
   for (var field = 0; field < fieldIDs[elementID].length - 1; field++){
	  var fieldPath = fieldIDs[elementID][field];
	  if (fieldPath.length > 1){
			walkJson = walkJson[fieldPath[0]][fieldPath[1]];
	  } else {
		  walkJson = walkJson[fieldPath[0]];
	  }
   }
   return walkJson;
}

function addToInputList(plusButton, textField, arrayID){
   latestID += 1;
   findString = 'data-newid="]....}?|?|?{....[_';
   start = textField.substring(0, textField.indexOf('data-newid="]....}?|?|?{....[_'));
   end = textField.substring(textField.indexOf(findString)+findString.length,textField.length);
   end = end.substring(end.indexOf('"')+1,end.length);
   textField = start + 'data-newid="' + latestID.toString() + '"' + end;
   var a = fieldIDs[arrayID];
   fieldIDs[latestID] = a.slice(0, a.length-1).concat([[a[a.length-1][0], simpleArrayTracker[arrayID].toString()]]);
   simpleArrayTracker[arrayID] += 1;
   plusButton.insertAdjacentHTML("beforebegin", textField);
   if (document.getElementById(']....}?|?|?{....[TreeToJSON_RealTime').checked) { convertTreeToJSON(); }
}

function elementAdd(elementNumber, elementID){
   fieldLocation = "";
   walkJson = JSON_Walk(elementID, true);
   walkJson = walkJson[fieldIDs[elementID][fieldIDs[elementID].length - 1][0]];
   walkJson.push(clearDictionary(JSON.parse(JSON.stringify(jsonBlocks[elementNumber][0]))));
   //Added a blank backboneElement to the JSON
   var elementIndex = (walkJson.length - 1).toString();		//The index of the current element

   var fullJsonBlock = {};
   fullJsonBlock[jsonBlocks[elementNumber][3]] =  jsonBlocks[elementNumber][0];
   var htmlBlock = loopDictionary(fullJsonBlock, jsonBlocks[elementNumber][1], jsonBlocks[elementNumber][2], jsonBlocks[elementNumber][5], elementIndex);
   var folder_path = jsonBlocks[elementNumber][2]+jsonBlocks[elementNumber][3].toString();
   
   var num = 1;
   var latestFolder = document.getElementById(folder_path + "[0]").nextSibling;
   while (true) {
      if (document.getElementById(folder_path + "[" + num.toString() + "]")) {
	     latestFolder = document.getElementById(folder_path + "[" + num.toString() + "]").nextSibling;
	  } else {
		 var i = '<p id="' + folder_path + '"';
         i = i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
         var re = new RegExp(i, 'g');
		 htmlBlock = htmlBlock.replace(re, '<p id="' + jsonBlocks[elementNumber][2]+jsonBlocks[elementNumber][3].toString() + '[' + num.toString() + ']' + '"');
		 var i = '<p id="' + folder_path + '.';
         i = i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
         var re = new RegExp(i, 'g');
		 htmlBlock = htmlBlock.replace(re, '<p id="' + jsonBlocks[elementNumber][2]+jsonBlocks[elementNumber][3].toString() + '[' + num.toString() + ']' + '.');
         break;
	  }
	  num += 1;
   }
   
   //Clear the for the inputs
   htmlBlock = htmlBlock.replace(/value=".*?"/g, 'value=""');
   
   //Then it loops through and finds all the folders inside that block, and replaces the same way in the jsonBlocks
   var tempBlock = htmlBlock;
   while(tempBlock.indexOf("<div id='_$-$_FoLdEr") != -1){
      tempBlock = tempBlock.substring(tempBlock.indexOf("<div id='_$-$_FoLdEr")+20, tempBlock.length);
	  var folderFound = tempBlock.substring(0, tempBlock.indexOf("'"));
      if (jsonBlocks[folderFound]) {
		  var tempPath = jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString();
		  var tempExten = jsonBlocks[folderFound][2].substring(tempPath.length, jsonBlocks[folderFound][2].length);
		  jsonBlocks[folderFound][2] = tempPath+"["+num+"]"+tempExten;
	  }
   }
   document.getElementById(latestFolder.id).insertAdjacentHTML("afterend", htmlBlock);
   
   var temp_a = htmlBlock.substring(htmlBlock.indexOf("id='_$-$_FoLdEr")+15, htmlBlock.length);
   var temp_x = temp_a.indexOf("'");
   var temp_b = temp_a.substring(0, temp_x);
   jsonBlocks[elementNumber][4] = temp_b;
   if (document.getElementById(']....}?|?|?{....[TreeToJSON_RealTime').checked) { convertTreeToJSON(); }
   ShowDeleteElementButtons();
   toastElementAdded();
}

function elementDelete(elementID){
	var treeToJsonDict = TreeToJSON();
	var jsonToSave = JSON.stringify(treeToJsonDict, null, 2).replace(/"{\[{NeGaTiVe!_!0}]}"/g, "-0").replace(/([^\r])\n/g, "$1\r\n");
	json = JSON.parse(jsonToSave.replace(/"{\[{NeGaTiVe!_!0pointZERO}]}"/g, "-0.0"));
	walkJson = JSON_Walk(elementID);
	if (fieldIDs[elementID][fieldIDs[elementID].length - 1].length == 1){
		delete walkJson[fieldIDs[elementID][fieldIDs[elementID].length - 1][0]];
	} else {
		walkJson[fieldIDs[elementID][fieldIDs[elementID].length - 1][0]].splice(fieldIDs[elementID][fieldIDs[elementID].length - 1][1], 1);
		if (walkJson[fieldIDs[elementID][fieldIDs[elementID].length - 1][0]].length == 0){
			delete walkJson[fieldIDs[elementID][fieldIDs[elementID].length - 1][0]];
		}
	}
	buildTree(true);
	if (document.getElementById(']....}?|?|?{....[TreeToJSON_RealTime').checked) { convertTreeToJSON(); }
}

function ShowDeleteElementButtons(){
	var deleteButtons = document.getElementsByClassName("minusButton");
	var buttonDisplay = "none";
	if (document.getElementById("]....}?|?|?{....[TreeToJSON_ShowDeleteElements").checked) {
		buttonDisplay = "inline";
		document.cookie = "showElementButtons=true;";
	} else {
		document.cookie = "showElementButtons=false;";
	}
	if (document.getElementById("]....}?|?|?{....[treeWriteChecked").checked) {
		for (var i in deleteButtons){
			try {
				deleteButtons[i].style.display = buttonDisplay;
			} catch(err){
				//Skips it;
			}
		}
	}
}

function toastElementAdded() {
  var x = document.getElementById("ElementAddedToast");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2990);
}

function toastNothingToDelete() {
  var x = document.getElementById("NothingToDeleteToast");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2990);
}

// HOVER TEXT CODE
var HoverTextFields = {};
// END OF HOVER TEXT CODE

var fieldIDs = {0: [[]]};
var simpleArrayTracker = {};
var latestID = 0;

function loopDictionary(json, indent, current_path, current_path_ID, entry_number){
    var generatedHTML = "";
	for (var key in json) {
		key = key.toString();
		// HOVER TEXT CODE
		if (key.substring(key.length-8, key.length) == "---HoVeR") {		//If the field ends with "---HoVeR" then it will add title text to the normal field
			if (current_path != "" && current_path[current_path.length - 1] != "."){
				current_path += ".";
			}
			if (generatedHTML.indexOf('<p id="' + current_path + key.substring(0, key.length-8) + '"') == -1){
				var x = 0;
				while (true) {
					if (generatedHTML.indexOf('<p id="' + current_path + key.substring(0, key.length-8) + '[' + x.toString() + ']' + '"') == -1){
						break;
					} else {
						//generatedHTML = generatedHTML.replace('<p id="' + current_path + key.substring(0, key.length-8) + '[' + x.toString() + ']' + '"', '<p id="' + current_path + key.substring(0, key.length-8) + '[' + x.toString() + ']'  + '" title="' + json[key] + '"');
						HoverTextFields[current_path + key.substring(0, key.length-8) + '[' + x.toString() + ']'] = json[key];
					}
					x++;
				}
			} else {
				//generatedHTML = generatedHTML.replace('<p id="' + current_path + key.substring(0, key.length-8) + '"', '<p id="' + current_path + key.substring(0, key.length-8) + '" title="' + json[key] + '"');
				HoverTextFields[current_path + key.substring(0, key.length-8)] = json[key];
			}
			delete json[key]; //Deletes the hover text field from the dictionary. I can have a conditional statement here if I want to keep the hovertext field when the JSON is saved.
			continue;
		}
		// END OF HOVER TEXT CODE
		
		var keyValue = json[key];
		if (keyValue == null || typeof keyValue != typeof {}){
           var inputType = 'text';
           if (typeof(keyValue) == typeof(1)){
              inputType = 'number' 
		   } else if (keyValue != null) {
		      keyValue = keyValue.toString().replace(/"/g, '&quot;'); //TO DO todo Comment this line out? Is this line needed?
		   }
           //For the "hidden" input type used for the arrays.
           if (keyValue != null && keyValue === 0 && (1/keyValue) === -Infinity) {
             keyValue = "";		//TO DO todo Comment this line out? Is this line needed?
           }
		   latestID += 1;
		   fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key]]);
		   generatedHTML += '<p id="' + current_path+key +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px;" data-newid="' + latestID.toString() + '"><img src="' + file +'"><b> ' + key + '</b> <input type="' + inputType + '" style="width: 300px;" value="' + keyValue + '" data-newid="' + latestID.toString() + '"></input> <span style="display: none;">()</span><span class="minusButton" style="display: none;"><button class="circle minus" onclick="elementDelete(' + latestID + ')" title="Deletes this element instance."></button></span></p>';
		} else {
			if (!Array.isArray(keyValue)){
				latestID += 1;
				if (entry_number){
					fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key, entry_number]]);
				} else {
					fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key]]);
				}
				generatedHTML += '<p id="' + current_path+key + '" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px" data-newid="' + latestID.toString() + '"><img name="_$-$_ImAgEFoLdEr" src="' + folder +'" onclick="toggleHideShow(this, \'_$-$_FoLdEr' + folderCount.toString() + '\');" data-folderid="' + folderCount.toString() +'"><b> ' + key + '</b><span class="minusButton" style="display: none;"><button class="circle minus" onclick="elementDelete(' + latestID + ')" title="Deletes this element instance."></button></span>' + '</p>';
                generatedHTML += "<div id='_$-$_FoLdEr" + folderCount.toString() + "'>";
                folderCount += 1;
				indent += 1;
				if (current_path != "" && current_path[current_path.length - 1] != "."){
				   current_path += ".";
				}
				//hardcoded_path
				generatedHTML += loopDictionary(keyValue, indent, current_path+key+".", latestID);
				indent -= 1;
                generatedHTML += "</div>";
			} else if (Array.isArray(json[key])){
				if (typeof json[key][0] == typeof {}) {
				    var visibilityButton = "";
					var visibility = 'display: inline;';
					var foldCountString;
					for (var entry in json[key]) {			
						latestID += 1;
						foldCountString = folderCount.toString();
						fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key, entry]]);
						jsonBlocks[folderCount] = [json[key][entry], indent, current_path, key, foldCountString, current_path_ID];
						generatedHTML += '<p id="' + current_path+key+ '[' + entry + ']' +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px" data-newid="' + latestID.toString() + '"><img name="_$-$_ImAgEFoLdEr" src="' + folder +'" onclick="toggleHideShow(this, \'_$-$_FoLdEr' + foldCountString + '\');" data-folderid="' + folderCount.toString() +'"><b> ' + key + '</b> <span id="buttonAdd' + foldCountString + '" class="addButton' + visibilityButton + '" style="' + visibility + '"><button class="circle plus" onclick="elementAdd(' + foldCountString + ', ' + latestID + ')" title="Add another one of this element."></button></span><span class="minusButton" style="display: none;"><button class="circle minus" onclick="elementDelete(' + latestID + ')" title="Deletes this element instance."></button></span>' + '</p>';
                        generatedHTML += "<div id='_$-$_FoLdEr" + foldCountString + "'>";
						visibilityButton = "Invisible";
						visibility = 'display: none;';
                        folderCount += 1;
						indent += 1;
						if (current_path != "" && current_path[current_path.length - 1] != "."){
							current_path += ".";
						}
						var returnedHTML = loopDictionary(json[key][entry], indent, current_path+key+"[" + entry.toString() + "]" + ".", latestID);
						generatedHTML += returnedHTML;
						
						indent -= 1;
                        generatedHTML += "</div>";
                        //break;  //This is added to only allow one instance of a field. This could be replaced with code to have an "Add" button for the field.
					}
				} else {
                    var visibilityButton = "";
                    var visibility = 'display: inline;';
					latestID += 1;
					fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key]]);
					var arrayID = latestID;
					generatedHTML += '<p id="' + current_path+key+ '[0]' +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px;' +'" ' + 'data-newid="' + latestID.toString() + '" ><img src="' + file + '"><b> ' + key + '</b> <input type="hidden" style="width: 300px;" data-newid="' + latestID.toString() + '"></input><span style="display: none;">()</span><span style="display: none;">()</span><span id="buttonAdd' + folderCount.toString() + '" class="addButton' + visibilityButton + '" style="' + visibility + '">';
					var visibility = 'display: inline;'
                    var latestTextField = "";
					var entryNumber = 0;
                    for (var entry in json[key]){
                        var inputType = 'text';
                        if (typeof(json[key][entry]) == typeof(1)){
                           inputType = 'number';
						} else if (typeof json[key][entry] == typeof false) {
							//It's a boolean, don't do anything. 
							//inputType = 'boolean'; //Not valid HTML and other problems.
                        } else if (json[key][entry] != null) {
						   json[key][entry] = json[key][entry].replace(/"/g, '&quot;');
						}
                        if (json[key][entry] != null && json[key][entry] === 0 && (1/json[key][entry]) === -Infinity) {
                           json[key][entry] = "";
                        }
					   latestID += 1;
					   fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key, entryNumber.toString()]]);
					   
                       generatedHTML += '<input id="]....}?|?|?{....[_" type="' + inputType + '" value="' + json[key][entry] +'" style="width: 80px; margin-left: 3px;"  data-newid="' + latestID.toString() + '"></input>';
					   entryNumber += 1;
                    }
					simpleArrayTracker[arrayID] = entryNumber;
                    //Latest field, without the value, also the ID changed
					latestID += 1;
					fieldIDs[latestID] = fieldIDs[current_path_ID].concat([[key, entryNumber.toString()]]);
					var latestTextField = '<input id=&quot;]....}?|?|?{....[_&quot; type=&quot;' + inputType + '&quot; style=&quot;width: 80px; margin-left: 3px;&quot; data-newid=&quot;]....}?|?|?{....[_' + (latestID-1).toString() + '&quot;></input>';
                    generatedHTML += '<button class="circle plus" onclick="addToInputList(this, \'' + latestTextField + '\', \''+ arrayID +'\');" title="Add another one of this element."></button></span></p>';
				}
			}
		}
	}
   
   // HOVER TEXT CODE
   for (var hoverKey in HoverTextFields){
	   generatedHTML = generatedHTML.replace('<p id="' + hoverKey + '"', '<p id="' + hoverKey + '" title="' + HoverTextFields[hoverKey] + '"');
	   if (HoverTextFields[hoverKey].slice(-1) == "]"){
		   var x = 1;
		   while (true){
				var otherEntry = hoverKey.substring(0, hoverKey.lastIndexOf("[")) + "[" + x.toString() + "]";
				if (generatedHTML.indexOf(otherEntry) == -1){
					break;
				}
				generatedHTML = generatedHTML.replace('<p id="' + otherEntry + '"', '<p id="' + otherEntry + '" title="' + HoverTextFields[hoverKey] + '"');
				x++;
		   }
	   }
   }
   // END OF HOVER TEXT CODE

   return generatedHTML;
}

function oneInstanceOfEachElementJSON(jsonBlock) {
	var tempJsonBlock = {};
	for (var key in jsonBlock) {
	   if (!(jsonBlock[key] == null || typeof jsonBlock[key] != typeof {})){
		  if (Array.isArray(jsonBlock[key])){
			tempJsonBlock[key] = [jsonBlock[key][0]];
			if (typeof tempJsonBlock[key][0] == typeof {}) {
				tempJsonBlock[key][0] = oneInstanceOfEachElementJSON(jsonBlock[key][0]);
			}
		  } else {
			  tempJsonBlock[key] = jsonBlock[key];
		  }
	   } else {
		   tempJsonBlock[key] = jsonBlock[key];
	   }
	}
	return tempJsonBlock;
}

function initiatePage(){
   loopDictionary(hovertext_json, 1, "", 0); //For the hover text
   buildTree(false);
   hashDict = hashCode(JSON.stringify(convertTreeToJSON()));
}

function buildTree(hashTreeToJson){
	folderCount = 0;
    var image1 = new Image();
    var image2 = new Image();
    var image3 = new Image();
    image1.src = file;
    image2.src = folder;
    image3.src = closedfolder;
	var generatedHTML = "";
	generatedHTML += "<div id='_$-$_FoLdEr" + folderCount.toString() + "'>";
	folderCount += 1;
	
	generatedHTML += '<p style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (0*indentSize).toString() + '"><img onclick="toggleAllFolders();" title="Click this to toggle expand/collapse of all subfolders." src="' + folder +'">';
    if ("resourceType" in json) {
       generatedHTML += '<b> ' + json["resourceType"] + '</b>';
    }
	generatedHTML += '</p>';
	
	fieldIDs = {0: []};
	latestID = 0;
	simpleArrayTracker = {};
	generatedHTML += loopDictionary(json, 1, "", 0);
	//json = {};
	generatedHTML += "</div>";
	var d1 = document.getElementById(']....}?|?|?{....[treeChart');
    
    d1.innerHTML = generatedHTML;
	if (hashTreeToJson) {
		hashDict = hashCode(JSON.stringify(TreeToJSON()));
	}
	document.getElementById("]....}?|?|?{....[treeWriteChecked").checked = true;
	document.getElementById("]....}?|?|?{....[treeReadChecked").checked = false;
	
	//Puts only one instance of each array for the add button, for example if you're starting json had "Example": {"numbers": [{"letter": "A"}, {"letter": "B"}]},
	//when a new instance of "Example" is added it would just be "Example": {"numbers": [{"one": ""}]}
	//If this is undesired then please comment out the code below.
	for (var block in jsonBlocks){
	   jsonBlocks[block][0] = oneInstanceOfEachElementJSON(jsonBlocks[block][0]);
	}
	ShowDeleteElementButtons();
}