$(document).ready(function(){
  let submit = $('#submit');
  let toDoList = $('#list');
  let id = 0;
  var list = []
  function Item(id, title, date) {
    this.id = id;
    this.title = title;
    this.month = date[1];
    this.day = date[2];
    this.year = date[0];
  }

  submit.on('click', function (e) {
    let input = document.querySelectorAll('input[type="text"]')[0].value;
    let date = document.querySelectorAll('input[type="date"]')[0].value.split('-');
    e.preventDefault();
    list.push(new Item(id, input, date));
    toDoList.append('<li id="'+id+'">'+input+'</li>');
    id++;

  });
  toDoList.on('click','li', function() {
    let i = $('li').index($("#"+this.id));
    list.splice(i, 1);
    $('#'+this.id).remove();
  });
});
