var cards = [];

function updateQuickAddList(){
  for (let i = 0; i < cards.length; i++){
    let option = '<option value="'+i+'">'+cards[i].title+'</option>';
    if (!$('#quickAddList').children()[i]) {
      $('#quickAddList').append(option);
    } else {
      $('#quickAddList').children()[i].outerHTML = option;
    }
  }
}
(function start(){
  let str = localStorage.getItem('todos')
  if (str) {
    listId = JSON.parse(str).listId;
    cards = JSON.parse(str).cards;
  } else {
    cards[0] = new Card('Sample List');
    let task = new Task ('Sample Item', 0)
    cards[0].task.push(task);
  }
  cards.forEach(function(card,i) {
    $($('#templateCard').html()).insertBefore($('#newCard')); //Add a new card(list) before the "Create New List" Card
    $('.listTitle:last').html(card.title); // Changes the title of the newly created list to whats in the cards array
    card.task.forEach(function(task) {
      displayTask(task.title, i);
    })
  })
  updateQuickAddList();
}());

//Object Prototypes
function Card(title) {
  this.title = title;
  this.color = "#3bf";
  this.task = [];
}
function Task(title, list) {
  this.title = title;
  this.add = function () { //method to add newly created task to card object and html display
    cards[list].task.push(this);
    displayTask(title, list);
  }
  // this.month = date[1];
  // this.day = date[2];
  // this.year = date[0];
}
function displayTask(title, list){
  $('<span class="task">'+title+'</span>').insertBefore($('.newTask:eq('+list+')'));
}

//functions
saveToLocal = function(){
  let store = {'cards':cards};
  let str = JSON.stringify(store);
  localStorage.setItem('todos', str);
}

function newCardAnimate(){
  let margin = $('main').children().first().offset().left - $('main').offset().left;
  let main = $('main').offset();
  let loc = $('#newCard').offset();
  let width = $('#newCard').width();
  let height = $('#newCard').height()+6;
  let i = $('#newCard').index()+1;
  $('html').css('height',$('html').height());
  $('#newCard').css({
    'left':loc.left,
    'top':loc.top,
    'position':'absolute',
    'width':width,
    'height':height,
    'margin': 0
  });
  if (i%3 == 0) { //if 3rd element
    $('#newCard').animate({'left':main.left+margin, 'top':loc.top+height+margin*2, 'height':129}, 'slow')
  } else{
    $('#newCard').animate({'left':loc.left+width+margin*2}, 'slow');
  }
  setTimeout(function() {
    $('#newCard').removeAttr('style');
    $('html').removeAttr('style');
  }, 598);
}

function newList(e){
  e.preventDefault();
  newCardAnimate();
  let list = $('.card').length - 1;
  $($('#templateCard').html()).insertBefore($('#newCard'));
  cards[list] = new Card();
  let that = $('.listTitle:last');
  that.attr('contentEditable', true).focus();
  that.blur(function () {
    cards[list].title = that.html();
    that.removeAttr("contentEditable");
    updateQuickAddList();
    saveToLocal();
  });
}
function createNewTask(e){
  e.preventDefault();
  let title = (this.type == "submit")? $(this).siblings()[0] : e.target;
  if (title.value.replace(/\s/g, "") != ""){
    let list = (this.type == "submit")? $(this).siblings()[1].value : $('.newTask').index($(e.target));
    let task = new Task(title.value, list);
    task.add();
    title.value = "";
    saveToLocal();
  }
}

$('.newList').click(newList); //Create new list from quickAdd bar or "Create New List" card

$('#quickAdd input[type="submit"]').click(createNewTask); //Create new task from quickAdd bar
$('main').on('blur', '.newTask', createNewTask); //Create new Task in card

$('main').on('click', 'span', function () { //Edit existing task or title by clicking the div
  $(this).attr('contentEditable', true).focus(); // Make content editable and focus on it
  let list = ( $('.card').index($(this).parents('.card'))); //Get list # based on parent card(list) index
  $(this).on('blur',function () { //When clicking away update card/task object and quickUpdateListSelector if list
    if ( $(this).hasClass('task') ) { // if editing a task
      let i = $(this).siblings('span').addBack().index($(this));
      cards[list].task[i].title = $(this).html();
    } else { // if editing a card
      cards[list].title = $(this).html();
      updateQuickAddList();
    }
    saveToLocal();
    $(this).attr('contentEditable', false);
  })
});

$('#button_clearLocal').click(function () { //Clear local storage & refresh page
  if (window.confirm('Are you sure you want to clear all data')){
    localStorage.clear();
    location.reload();
  }
});
