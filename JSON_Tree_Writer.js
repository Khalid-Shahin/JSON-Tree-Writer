if (getCookie("jsonView") == "false"){
   hideShowJSON();
}

if (getCookie("sides") == "TreeRight") {
   swapSides();
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
   readFileContent(file).then(function(content) { json = JSON.parse(content); buildTree(); }).catch( function(error) { console.log(error) });
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

      _.isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
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
};

window.addEventListener("beforeunload", function (e) {
    if (hashDict != 0 && hashDict != hashCode(JSON.stringify(TreeToJSON()))) {
		var confirmMessage = 'If you leave this page your changes to the form, if any, will be lost.';
		(e || window.event).returnValue = confirmMessage; //Gecko + IE
		return confirmMessage; //Gecko + Webkit, Safari, Chrome etc.
	}
}); 
//END OF NOT MY CODE

function convertTreeToJSON(){
   var jsonToSave = JSON.stringify(TreeToJSON(), null, 2).replace(/"{\[{NeGaTiVe!_!0}]}"/g, "-0").replace(/([^\r])\n/g, "$1\r\n");
   jsonToSave = jsonToSave.replace(/"{\[{NeGaTiVe!_!0pointZERO}]}"/g, "-0.0");
   document.getElementById("]....}?|?|?{....[jsonTextArea").value = jsonToSave;
}
function convertJSONToTree(){
     try {
        var convertingJSON = JSON.parse(document.getElementById("]....}?|?|?{....[jsonTextArea").value);
        json = convertingJSON;
        buildTree();
     } catch(err){
        alert("Invalid JSON formatting");
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

function deleteEmptyFields (){
   var hashBefore = hashCode(JSON.stringify(TreeToJSON()));
   var previousCheck = document.getElementById("]....}?|?|?{....[keepFields").checked;
   document.getElementById("]....}?|?|?{....[keepFields").checked = false;
   var dict = TreeToJSON();
   var hashAfter = hashCode(JSON.stringify(dict));
   if (hashBefore != hashAfter){
      //Warning
      if (confirm('Are you sure you want to delete these empty field(s)')) {
        json = dict;
        buildTree();
      }
   } else {
      toastNothingToDelete();
   }
   
   document.getElementById("]....}?|?|?{....[keepFields").checked = previousCheck;
}

function switchReadWrite(){
    var allInputs = document.getElementsByTagName("input");
	var allButtons = document.getElementsByClassName("addButton");
	var onlyTextBoxes = [];
	for (var i = 0; i < allInputs.length; i++) {
		if((allInputs[i].type.toLowerCase() == 'text' || allInputs[i].type.toLowerCase() == 'number' || allInputs[i].type.toLowerCase() == 'hidden') && (allInputs[i].id.substring(0, 18) != "]....}?|?|?{....[_")) {
			onlyTextBoxes.push(allInputs[i]);
		}
	}
	allInputs = onlyTextBoxes;
	if (document.getElementById("]....}?|?|?{....[treeWriteChecked").checked) {
	   for (var i in allInputs) {
	      allInputs[i].style.display = "inline";
	      allInputs[i].nextSibling.nextSibling.style.display = "none";
	   }
	   for (var j = 0; j < allButtons.length; j++) {
		  allButtons[j].style.display = "inline";
	   }
	} else {
		for (var i in allInputs) {
		  allInputs[i].style.display = "none";
		  allInputs[i].nextSibling.nextSibling.style.display = "inline";
          if (allInputs[i].type.toLowerCase() != 'hidden') {
		     if (typeof allInputs[i].value == typeof "" && allInputs[i].value.substring(0, 4).toLowerCase() == "http"){
			    allInputs[i].nextSibling.nextSibling.innerHTML = '(' + '<a href="' + allInputs[i].value + '">' + allInputs[i].value + '</a>)';
			 } else {
		        allInputs[i].nextSibling.nextSibling.innerHTML = "(" + allInputs[i].value + ")";
		     }
          } else {
             var allListBoxes = document.getElementsByName(allInputs[i].name);
             var allListBoxValues = [];
             for (var z = 0; z < allListBoxes.length; z++){
                if(allListBoxes[z].id  == "]....}?|?|?{....[_" + allInputs[i].name){
                   if (!document.getElementById("]....}?|?|?{....[keepFields").checked && allListBoxes[z].value == "") {
                      //Does nothing
                   } else {
                      allListBoxValues.push(allListBoxes[z].value);
                   }
                }
             }
             allInputs[i].nextSibling.nextSibling.innerHTML = "(" + allListBoxValues.toString() + ")";
          }
		}
	    for (var j = 0; j < allButtons.length; j++) {
		  allButtons[j].style.display = "none";
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
        var d1 = document.getElementById(']....}?|?|?{....[treeChart');
        
        var current_index = -1;
        
        var allInputs = document.getElementsByTagName("input");
        
        var onlyTextBoxes = [];
        for(var i = 0; i < allInputs.length; i++) {
            if(allInputs[i].type.toLowerCase() == 'text' || allInputs[i].type.toLowerCase() == 'hidden' || allInputs[i].type.toLowerCase() == 'number') {
                onlyTextBoxes.push(allInputs[i]);
            }
        }
        allInputs = onlyTextBoxes;
    
        var dict = {};
    
        for (x in allInputs) {
          var paths = allInputs[x].name.split(".");
          var current_path = "";
          
            for (var y = 0; y < paths.length - 1; y++){
               var previous_path = current_path;
               current_path += "." + paths[y];
               var temp_path = current_path;
               if (paths[y].indexOf("[") > -1) {
                  temp_path = current_path.substring(0, current_path.lastIndexOf("["));
                  temp_previous_path = previous_path.substring(0, previous_path.lastIndexOf("["));
               }
               if (eval("dict"+temp_path)) {
			     if (current_path.indexOf("[") > -1){
					 array_index = current_path.substring(current_path.lastIndexOf("[")+1, current_path.lastIndexOf("]"));
					 if (eval("dict"+temp_path).length <= parseInt(array_index)) {
						eval("dict"+temp_path).push({});
					 }
				 }
               } else {
                  if (paths[y].indexOf("[") > -1) {
                     eval("dict"+current_path.substring(0, current_path.lastIndexOf("[")) + " = " + "[{}]");
                  } else {
                     eval("dict"+current_path + " = " + "{}")
                  }
               }
            }
          
          
          if (!document.getElementById("]....}?|?|?{....[keepFields").checked && (allInputs[x].value == "" && allInputs[x].type != "hidden")) {
            //DON'T SAVE THE INPUT IF IT IS BLANK and the checkbox is unchecked
          } else if(allInputs[x].id.substring(0, 18) != "]....}?|?|?{....[_") {
            
            var inputValue = allInputs[x].value;
			inputValue = inputValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            if (inputValue == "null"){
               eval("dict"+"."+allInputs[x].name + " = " + "null");
            } else if (inputValue.toLowerCase() == "false"){
               eval("dict"+"."+allInputs[x].name + " = " + "false");
               //Automatically converts false and true to a boolean in the JSON, this unfortunately doesn't allow true and false as a string.
            } else if (inputValue.toLowerCase() == "true"){
               eval("dict"+"."+allInputs[x].name + " = " + "true");
            } else if (allInputs[x].type == "hidden") {
               var allListBoxes = document.getElementsByName(allInputs[x].name);
               var allListBoxValues = [];
               for (var z = 0; z < allListBoxes.length; z++){
                  if(allListBoxes[z].id  == "]....}?|?|?{....[_" + allInputs[x].name){
                     if (!document.getElementById("]....}?|?|?{....[keepFields").checked && allListBoxes[z].value == "") {
                        //Does nothing
                     } else {
                     
                     if (allListBoxes[z].type == "number") {
                         var tempValue = allListBoxes[z].value;
						 tempValue = tempValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                         if (allListBoxes[z].value == ""){
                            tempValue = "'{[{NeGaTiVe!_!0}]}'";
                            //TO DO todo
                            //THIS IS POTENTIALLY VERY BAD, and it may not be valid JSON either.
                            //Would using tempValue = "'{[{NeGaTiVe!_!0pointZERO}]}'" is better? So that it would be -0.0?
                            //I think it would be smarter to save this as
                            //tempValue = "null"
                         } else if (allListBoxes[z].value == "-0") {
                            tempValue = "'{[{NeGaTiVe!_!0}]}'";
                            //This negative 0 is fine because this would be the user explicitly typing in -0;
                         } else if(allListBoxes[z].value == "-0.0"){
                            tempValue = "'{[{NeGaTiVe!_!0pointZERO}]}'";
                            //This negative 0 is fine because this would be the user explicitly typing in -0.0;
                         }
                         allListBoxValues.push(parseFloat(tempValue));
                      } else {
                         var tempValue = allListBoxes[z].value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                         allListBoxValues.push(tempValue);
                      }
                        //allListBoxValues.push(allListBoxes[z].value);
                     }
                  }
               }
               
               if (!document.getElementById("]....}?|?|?{....[keepFields").checked && allListBoxValues == []){
                  //Does nothing
               } else {
                  eval("dict"+"."+allInputs[x].name + " = " + JSON.stringify(allListBoxValues));
               }
            } else if (allInputs[x].type == "number") {
               var tempValue = allInputs[x].value;
			   tempValue = tempValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
               if (allInputs[x].value == ""){
                  tempValue = "'{[{NeGaTiVe!_!0}]}'";
                  //TO DO todo
                  //THIS IS POTENTIALLY VERY BAD, and it may not be valid JSON either.
                  //Would using tempValue = "'{[{NeGaTiVe!_!0pointZERO}]}'" is better? So that it would be -0.0?
                  //I think it would be smarter to save this as
                  //tempValue = "null"
               } else if (allInputs[x].value == "-0") {
                  tempValue = "'{[{NeGaTiVe!_!0}]}'";
                  //This negative 0 is fine because this would be the user explicitly typing in -0;
               } else if(allInputs[x].value == "-0.0"){
                  tempValue = "'{[{NeGaTiVe!_!0pointZERO}]}'";
                  //This negative 0 is fine because this would be the user explicitly typing in -0.0;
               }
               eval("dict"+"."+allInputs[x].name + " = " + tempValue);
            } else {
               var tempValue = allInputs[x].value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
			   
               eval("dict"+"."+allInputs[x].name + " = " + "'" + tempValue + "'");
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

function elementAdd(elementNumber){
   var fullJsonBlock = {};
   fullJsonBlock[jsonBlocks[elementNumber][3]] =  jsonBlocks[elementNumber][0];
   var htmlBlock = loopDictionary(fullJsonBlock, jsonBlocks[elementNumber][1], jsonBlocks[elementNumber][2]);
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
   
    var i = 'input id="' + jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString();
    i = i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var re = new RegExp(i, 'g');
    htmlBlock = htmlBlock.replace(re, 'input id="' + jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString()+"["+num+"]");
   
    var i = 'name="' + jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString();
    i = i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var re = new RegExp(i, 'g');
    htmlBlock = htmlBlock.replace(re, 'name="' + jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString()+"["+num+"]");
   
   //Clear the for the inputs
   htmlBlock = htmlBlock.replace(/value=".*?"/g, 'value=""');
   
   //Then it loops through and finds all the folders inside that block, and replaces the same way in the jsonBlocks
   var tempBlock = htmlBlock;
   while(tempBlock.indexOf("<div id='folder") != -1){
      tempBlock = tempBlock.substring(tempBlock.indexOf("<div id='folder")+15, tempBlock.length);
	  var folderFound = tempBlock.substring(0, tempBlock.indexOf("'"));
      if (jsonBlocks[folderFound]) {
		  var tempPath = jsonBlocks[elementNumber][2]+(jsonBlocks[elementNumber][3]).toString();
		  var tempExten = jsonBlocks[folderFound][2].substring(tempPath.length, jsonBlocks[folderFound][2].length);
		  jsonBlocks[folderFound][2] = tempPath+"["+num+"]"+tempExten;
	  }
   }
   document.getElementById(latestFolder.id).insertAdjacentHTML("afterend", htmlBlock);
   
   var temp_a = htmlBlock.substring(htmlBlock.indexOf("id='folder")+10, htmlBlock.length);
   var temp_x = temp_a.indexOf("'");
   var temp_b = temp_a.substring(0, temp_x);
   jsonBlocks[elementNumber][4] = temp_b;
   toastElementAdded();
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

function loopDictionary(json, indent, current_path){
   var generatedHTML = "";
	for (var key in json) {
		
		// HOVER TEXT CODE
		if (typeof key == typeof "" && key.substring(key.length-8, key.length) == "---HoVeR") {		//If the field ends with "---HoVeR" then it will add title text to the normal field
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
			continue;
		}
		// END OF HOVER TEXT CODE
		
		if (json[key] == null || typeof json[key] != typeof {}){
           var inputType = 'text'
           if (typeof(json[key]) == typeof(1)){
              inputType = 'number' 
           } else if (json[key] != null) {
		      json[key] = (json[key]).toString().replace(/"/g, '&quot;');
		   }
           //For the "hidden" input type used for the arrays.
           if (json[key] != null && json[key] === 0 && (1/json[key]) === -Infinity) {
             json[key] = "";
           }
		   generatedHTML += '<p id="' + current_path+key.toString() +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px;' +'"><img src="' + file +'"><b> ' + key.toString() + '</b> <input id="' + current_path + key.toString() + '" name="' + current_path + key.toString() + '" type="' + inputType + '" style="width: 300px;" value="' + json[key] +'"></input> <span style="display: none;">()</span></p>';
		} else {
			if (!Array.isArray(json[key])){
				generatedHTML += '<p id="' + current_path+key.toString() + '" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px"><img src="' + folder +'" onclick="toggleHideShow(this, \'folder' + folderCount.toString() + '\');"><b> ' + key.toString() + '</b>' + '</p>';
                generatedHTML += "<div id='folder" + folderCount.toString() + "'>";
                folderCount += 1;
				indent += 1;
				if (current_path != "" && current_path[current_path.length - 1] != "."){
				   current_path += ".";
				}
				generatedHTML += loopDictionary(json[key], indent, current_path+key.toString()+".");
				indent -= 1;
                generatedHTML += "</div>";
			} else if (Array.isArray(json[key])){
				if (typeof json[key][0] == typeof {}) {
				    var visibilityButton = "";
					var visibility = 'display: inline;';
					for (var entry in json[key]) {
						var sendDict = { };
						sendDict[key] = json[key][entry];
						var currentFolderCount = folderCount;
						jsonBlocks[folderCount] = [json[key][entry], indent, current_path, key, folderCount.toString()];
						
						generatedHTML += '<p id="' + current_path+key.toString()+ '[' + entry + ']' +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px"><img src="' + folder +'" onclick="toggleHideShow(this, \'folder' + folderCount.toString() + '\');"><b> ' + key + '</b> <span id="buttonAdd' + folderCount.toString() + '" class="addButton' + visibilityButton + '" style="' + visibility + '"><button class="circle plus" onclick="elementAdd(' + folderCount.toString() + ')" title="Add another one of this element."></button></span>' + '</p>';
                        generatedHTML += "<div id='folder" + folderCount.toString() + "'>";
						visibilityButton = "Invisible";
						visibility = 'display: none;'
						var previous_folderCount = folderCount;
                        folderCount += 1;
						indent += 1;
						if (current_path != "" && current_path[current_path.length - 1] != "."){
							current_path += ".";
						}
						var returnedHTML = loopDictionary(json[key][entry], indent, current_path+key.toString()+"[" + entry.toString() + "]" + ".");
						generatedHTML += returnedHTML;
						
						indent -= 1;
                        generatedHTML += "</div>";
                        //break;  //This is added to only allow one instance of a field. This could be replaced with code to have an "Add" button for the field.
					}
				} else {
                    //generatedHTML += '<p style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px;' +'"><img src="' + file +'"><b> ' + key.toString() + '</b> <input type="text" style="width: 300px;" value="' + json[key] +'"></input> <button style="border-radius: 50%;">+</button></p>';
					//There's two ways to do this.
                    var visibilityButton = "";
                    var visibility = 'display: inline;';
					generatedHTML += '<p id="' + current_path+key.toString()+ '[0]' +'" style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (indent*indentSize).toString() + 'px;' +'"><img src="' + file +'"><b> ' + key.toString() + '</b> <input id="' + current_path + key.toString() + '" name="' + current_path + key.toString() + '" type="hidden" style="width: 300px;"></input><span style="display: none;">()</span><span style="display: none;">()</span><span id="buttonAdd' + folderCount.toString() + '" class="addButton' + visibilityButton + '" style="' + visibility + '">';
				    var visibilityButton = "";
					var visibility = 'display: inline;'
                    var latestTextField = "";
                    for (var entry in json[key]){
                        var inputType = 'text';
                        if (typeof(json[key][entry]) == typeof(1)){
                           inputType = 'number' 
                        } else if (json[key][entry] != null) {
						   json[key][entry] = json[key][entry].replace(/"/g, '&quot;');
						}
                        //For the "hidden" input type used for the arrays.
                        if (json[key][entry] != null && json[key][entry] === 0 && (1/json[key][entry]) === -Infinity) {
                           json[key][entry] = "";
                        }
                       //TODO to do make sure that the right type is stored in the type field
                       generatedHTML += '<input id="]....}?|?|?{....[_' + current_path + key.toString() + '" name="' + current_path + key.toString() + '" type="' + inputType + '" value="' + json[key][entry] +'" style="width: 80px; margin-left: 3px;"></input>';
                    }
                    //Latest field, without the value, also the ID changed
                    var latestTextField = '<input id=&quot;]....}?|?|?{....[_' + current_path + key.toString() + '&quot; name=&quot;' + current_path + key.toString() + '&quot; type=&quot;' + inputType + '&quot; style=&quot;width: 80px; margin-left: 3px;&quot;></input>';
                    //FIX THIS
                    generatedHTML += '<button class="circle plus" onclick="addToInputList(this, \'' + latestTextField + '\');" title="Add another one of this element."></button></span></p>';
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

function addToInputList(plusButton, textField){
   plusButton.insertAdjacentHTML("beforebegin", textField);
}

function oneInstanceOfEachElementJSON(jsonBlock) {
	for (var key in jsonBlock) {
	   if (!(jsonBlock[key] == null || typeof jsonBlock[key] != typeof {})){
		  if (Array.isArray(jsonBlock[key])){
			jsonBlock[key] = [jsonBlock[key][0]];
			if (typeof jsonBlock[key][0] == typeof {}) {
				jsonBlock[key][0] = oneInstanceOfEachElementJSON(jsonBlock[key][0]);
			}
		  }
	   }
	}
	return jsonBlock;
}

function initiatePage(){
   buildTree();
   convertTreeToJSON();
}

function buildTree(){
	folderCount = 0;
    var image1 = new Image();
    var image2 = new Image();
    var image3 = new Image();
    image1.src = file;
    image2.src = folder;
    image3.src = closedfolder;
	var generatedHTML = "";
	generatedHTML += "<div id='folder" + folderCount.toString() + "'>";
	folderCount += 1;
    if ("resourceType" in json) {
       generatedHTML += '<p style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (0*indentSize).toString() + '"><img src="' + folder +'"><b> ' + json["resourceType"] + '</b>' + '</p>';
    } else {
       generatedHTML += '<p style="margin-top: 2px; margin-bottom: 2px;'+ ' margin-left: ' + (0*indentSize).toString() + '"><img src="' + folder +'">' + '</p>';
    }
	
	loopDictionary(hovertext_json, 1, "");
	hovertext_json = {};
	generatedHTML += loopDictionary(json, 1, "");
	generatedHTML += "</div>";
	var d1 = document.getElementById(']....}?|?|?{....[treeChart');
    
    d1.innerHTML = generatedHTML;
     hashDict = hashCode(JSON.stringify(TreeToJSON()));
	 document.getElementById("]....}?|?|?{....[treeWriteChecked").checked = true;
	 document.getElementById("]....}?|?|?{....[treeReadChecked").checked = false;
	
	//Puts only one instance of each array for the add button, for example if you're starting json had "Example": {"numbers": [{"letter": "A"}, {"letter": "B"}]},
	//when a new instance of "Example" is added it would just be "Example": {"numbers": [{"one": ""}]}
	//If this is undesired then please comment out the code below.
	for (var block in jsonBlocks){
	   jsonBlocks[block][0] = oneInstanceOfEachElementJSON(jsonBlocks[block][0]);
	}
	
}