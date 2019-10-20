let recyclable=["paper",
        "newspaper",
        "magazine",
        "catalog",
        "map",
        "phonebook",
        "mail",
        "paperboard",
        "tissue",
        "box",
        "card",
        "folder",
        "can",
        "straw",
        "carton",
        "book",
        "cup",
        "envelope",
        "cardboard",
        "vase",
        "plastic",
        "boxboard",
        "box",
        "metal",
        "tin",
        "aluminum",
        "dish",
        "plate",
        "tray",
        "cookware",
        "copper",
        "jewelry",
        "key",
        "steel",
        "pot",
        "bucket",
        "pan",
        "tin",
        "pyrex",
        "utensil",
        "glass",
        "bottle",
        "jar",
        "cup",
        "jug",
        "metal",
        "spoon",
        "fork",
        "office paper",
        "blind",
        "curtain"];
let special=["battery",
            "computer",
            "electronics",
            "bulb",
            "microfilm",
            "cell phone",
            "phone",
            "mobile phone",
            "equipment",
            "inkjet",
            "cartridge",
            "inkjet cardridge",
            "cd",
            "disk",
            "tire",
            "ink cartridge",
            "tv",
            "power cord",
            "personal computer",
            "laptop",
            "portable computer"];
let compost=["fruit",
            "vegetable",
            "apple",
            "pear",
            "banana",
            "cucumber",
            "strawberry",
            "apricots",
            "avocado",
            "blackberry",
            "cherry",
            "coconut",
            "date",
            "durian",
            "dragonfruit",
            "grape",
            "grapefruit",
            "kiwi",
            "lime",
            "lemon",
            "lychee",
            "mango",
            "melon",
            "nectarine",
            "olive",
            "orange",
            "peach",
            "pineapple",
            "plum",
            "pomegranate",
            "pomelo",
            "raspberries",
            "watermelon",
            "broccoflower",
            "broccoli",
            "cabbage",
            "celery",
            "corn",
            "basil",
            "rosemary",
            "sage",
            "thyme",
            "kale",
            "lettuce",
            "mushroom",
            "onion",
            "pepper",
            "ginger",
            "wasabi",
            "squash",
            "tomato",
            "potato",
            "hair",
            "wood",
            "popcorn",
            "leaves",
            "egg",
            "pasta",
            "fish",
            "beef",
            "chicken",
            "pork",
            "meat",
            "soy",
            "pumpkin",
            "nut",
            "cheese",
            "toothpicks",
            "pickles",
            "feather",
            "fur",
            "bone"];


let classification=["recyclable","special","compost","trash"];
console.log(classifier(["Input device","Mouse","Electronic device","Technology","Computer component","Peripheral","Computer accessory","Computer"]));
//classification=["recyclable","special","compost","trash"];

/*
@param: possibilities of each classification
@return: most possibility classification
*/
function mostlikely(arr){
  if(arr[0]===0&&arr[0]===arr[1]&&arr[1]===arr[2]&&arr[2]===arr[3]){
    return classification[3];
  }
   var tmp=arr[0];
   for (var i in arr){
     if (tmp<arr[i]){
       tmp=arr[i];
     }
   }
   console.log(arr.indexOf(tmp));
   console.log(classification[arr.indexOf(tmp)]);
   return classification[arr.indexOf(tmp)];
}


/*
@paramL the labels of that object
@return the classification of that label
*/
function classifier(testdatas){

  var possibilities=[0,0,0,0];
  //use the label in test dates to compare to the classification, and calculate the possibility of each classification
  //based on the pirority and frenquency of the label.
  for (var index1 in testdatas){
    var tmp = testdatas[index1].split(" ");
    for (var index2 in tmp){
      if (recyclable.indexOf(tmp[index2])>-1){
        possibilities[0]+=(testdatas.length-index1);
      }
      if (special.indexOf(tmp[index2])>-1){
        possibilities[1]+=(testdatas.length-index1);
      }
      if (compost.indexOf(tmp[index2])>-1){
        possibilities[2]+=(testdatas.length-index1);
      }
    }
  }
  //console.log(mostlikely(possibilities));
  return mostlikely(possibilities);
}

module.exports = {
  classifier
}
