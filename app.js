 //BUDGET CONTROLLER

 
var budgetController= (function(){


  var Expenses=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  var calculatetotal=function(type){
    var sum=0;
    
    for(var i=0;i<(data.allitems[type].length);i++){
      sum=sum+data.allitems[type][i].value;
      
    };

    data.totals[type]=sum;
    
    }
  var data={
    allitems:{ 
      inc:[],
      exp:[]
    },
    totals:{
      inc:0,
      exp:0
    },
    budget:0,
    percentage:0
  }
  return{
    addItem: function(type,des,val){
      var newItem,ID;
      //creation of id
      if (data.allitems[type].length > 0) {
        ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
    } else {
        ID = 0;
    }
      
      //create new item based on inc and exp
      if(type==='exp'){
        newItem=new Expenses(ID,des,val);
      }else if(type==='inc'){
        newItem=new Income(ID,des,val)
      }
      data.allitems[type].push(newItem);
      //return the new item
     
      return newItem;

    },
    calculateBudget:function(){
      calculatetotal('inc');
      calculatetotal('exp');
      data.budget= (data.totals.inc )- (data.totals.exp);
      data.percentage=Math.round((data.totals.inc )/(data.totals.exp)*100)

    },
    getBudget:{
      budget_f:data.budget,
      percentage_f:data.percentage,
      income_f:data.totals.inc,
      expenses_f:data.totals.exp
    },
    testing:data
  };

})();




//UI CONTROLLER
var UIController= (function(){
   var  DomStrings={
      inputType:".add__type",
      inputDes:".add__description",
      inputNum:".add__value",
      inputBtn:".add__btn",
      incomes:".income__list",
      expenses:".expenses__list",
      totIncome:".budget__income--value",
      totExp:".budget__expenses--value"
    }

   return {
        getInput:function(){
          return{
            type:document.querySelector(DomStrings.inputType).value,
            description:document.querySelector(DomStrings.inputDes).value,
            number:parseFloat(document.querySelector(DomStrings.inputNum).value)
          };
       
        },
        updateUI:function(){
          document.querySelector(DomStrings.totIncome).innerHTML=budgetController.getBudget.income_f;
        },
        getDomStrings:function(){
          return DomStrings;
        },
        addListItem: function(obj, type) {
          var html, newHtml, element;
          // Create HTML string with placeholder text
          
          if (type === 'inc') {
              element = DomStrings.incomes;
              
              html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp') {
              element = DomStrings.expenses;
              
              html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }
          
          // Replace the placeholder text with some actual data
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);
          
          // Insert the HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },
      clearfields:function(){
        var fields;
       fields= document.querySelectorAll(DomStrings.inputDes+','+DomStrings.inputNum);
        for(var i=0;i<fields.length;i++){
          fields[i].value="";
        }
        fields[0].focus();//focus the cursor again to discription
      }
      
          
    };

})();



//GLOBAL APP CONTROLLER
var controller=(function(budgetctrl,UIctrl){
    var Dom=UIctrl.getDomStrings();
    var setUpEventListeners=function(){
          document.querySelector(Dom.inputBtn).addEventListener('click',ctrlAdditem);
          document.addEventListener('keypress',function(e){
           if(e.keyCode==13||e.which==13){
              ctrlAdditem();
      }
    });
    } 
    var updateBudget=function(){
        budgetController.calculateBudget();
    };
    var ctrlAdditem= function(){
          var input,newItem;
          UIctrl.updateUI();
          input=UIctrl.getInput();
          if (input.description !== "" && !isNaN(input.number) && input.number > 0){
            //creating new itemc
            newItem = budgetctrl.addItem(input.type,input.description,input.number);
            //adding that new item yto uI
            UIctrl.addListItem(newItem,input.type);
            UIctrl.clearfields();
            updateBudget();
          }
          
         
          
    }
    
   return {
     init: function(){
       setUpEventListeners();
     }
   }
    

})(budgetController,UIController);

controller.init();                    //initialization function
  