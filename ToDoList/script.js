//Delta(Δ) U+03p4 find datatype
var Δ = function(type, i){
  return i? $(document).find("[data-"+type+"="+i+"]") : $(document).find("[data-"+type+"]")
}
var cards, listId, taskId;
var test;

$(document).ready(function(){
  saveToLocal = function(){
    let store = {'listId':listId, 'taskId':taskId, 'cards':cards};
    let str = JSON.stringify(store);
    localStorage.setItem('todos', str);
  }

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

  start = function(){
    let str = localStorage.getItem('todos')
    if (str) {
      listId = JSON.parse(str).listId;
      taskId = JSON.parse(str).taskId;
      cards = JSON.parse(str).cards;
    } else {
      listId = 1;
      taskId = 1;
      cards = [];
      cards[0] = new Card('Sample List');
      let task = new Task (0, 'Sample Item', 0)
      cards[0].task.push(task);
    }
    cards.forEach(function(card,i) {
      $($('#templateCard').html()).insertBefore($('#newCard'));
      $('#newList').find('span').html(card.title);
      $('#newList').attr('data-listid', i);
      $('#newList').removeAttr('id');
      card.task.forEach(function(task) {
        $('<span data-taskid="'+task.taskId+'" class="task">'+task.title+'</span>').insertBefore(Δ('listid',task.listId).children().last());
      })
    })
    updateQuickAddList();
  }
  start();
  //Object Prototypes
  function Card(title) {
    this.title = title;
    this.color = "#3bf";
    this.task = [];
  }
  function Task(id, title, listId) {
    // let list = get list name from list ID
    this.taskId = parseInt(id);
    this.listId = parseInt(listId);
    this.title = title;
    this.add = function () {
      $('<span data-taskid="'+id+'" class="task">'+title+'</span>').insertBefore(Δ('listid',listId).children().last());
      cards[listId].task.push(this);
    }
    // this.month = date[1];
    // this.day = date[2];
    // this.year = date[0];
  }
  //functions

  function blurSpan(e){
    //get listId & span element
    let listId = e.data[0];
    let element = e.data[1];
    cards[listId].title = e.target.innerText;
    element.removeAttr("contentEditable");
    $('#newList').attr('data-listid', listId);
    $('#newList').removeAttr('id');
    updateQuickAddList();
    saveToLocal();
  }
  function blurNewTask (e){
    let title = e.target.value;
    if (title.replace(/\s/g, "") != ""){
      let listId = e.target.parentElement.dataset.listid;
      let task = new Task(taskId, title, listId);
      task.add();
      e.target.value="";
      taskId++;
      saveToLocal();
    }
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

  // function getIndex() {
  //   var p = $(this).parent().children();
  //   return $p.index(this);
  // }

  function submit(e){
    e.preventDefault();
    if (this.name == 'newList' || this.id == 'newCard'){

      //create & add html element
      newCardAnimate();
      $($('#templateCard').html()).insertBefore($('#newCard'));
      cards[listId] = new Card();
      let thisEl = $('#newList').find('span');
      thisEl.attr('contentEditable', true).focus();
      let id = listId;
      listId++;
      thisEl.blur([id, thisEl], blurSpan);
    } else if(this.name == 'newTask'){
      let sibling = $(e.target).siblings();
      if (sibling[0].value.replace(/\s/g, "") != ""){
        let task = new Task (taskId, sibling[0].value, sibling[1].value);
        task.add();
        taskId++;
        saveToLocal();
      }
    }
    console.log('saved');
  }
  function editText(e){
    $(this).attr('contentEditable', true);
    $(this).focus();
    let listId = $(this).parents('div').data().listid;
    $(this).on('blur',function () {
      if ( $(this).hasClass('task') ) { // if editing a task
        let i = $(this).siblings('span').addBack().index($(this));
        cards[listId].task[i].title = $(this).html();
      } else { // if editing a card
        cards[listId].title = $(this).html();
        // updateQuickAddList();
      }
      saveToLocal();
      $(this).attr('contentEditable', false);
    })
  }

  $('body').on('click', 'input[type="submit"]', submit);
  $('body').on('click', 'button', submit);
  $('body').on('blur', '.newTask', blurNewTask);
  $('#newCard').click(submit);
  $('#button_clearLocal').click(function () {
    if (window.confirm('Are you sure you want to clear all data')){
      localStorage.clear();
      location.reload();
    }
  })
  $('body').on('click', 'span', editText);
});
