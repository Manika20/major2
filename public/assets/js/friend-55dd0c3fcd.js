{let e=$("#friend");console.log(e),console.log(e.attr("href")),e.click((function(o){console.log("inside"),o.preventDefault(),console.log("done"),$.ajax({url:e.attr("href"),type:"get",success:function(o){console.log(o.deleted),o.deleted?e.html("Add Friend"):e.html("Remove Friend")},error:function(e){console.log(e.responseText)}})}))}