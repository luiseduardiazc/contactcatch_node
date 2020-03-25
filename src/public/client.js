
$( document ).ready(function() {
    const socket = io('ws://localhost:3000');

    $("#send").click(function() {
        let urlPost = $('#url').val()
        console.log(urlPost)
        $.ajax({
            type: 'POST',
            data : { 'url': urlPost},
            url: "http://localhost:3000/api/v1/scrap",
            success: function(response)
            {
                response =  JSON.parse(response)
              console.log("response: " + response.task_id)
              socket.on(response.task_id, (fileName) => {
                console.log(fileName)
            })
            }
          });
    })


});