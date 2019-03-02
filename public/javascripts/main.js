$(document).ready(function() {
  $("#register").validate({
    rules:{
      firstname:{
        required:true
      },
      lastname:{
        required:true
      },
      username:{
        required:true
      },
      email:{
        required:true,
        email:true
      },
      address:{
        required:true
      },
      phone_number:{
        required:true
      },
      terms:{
        required:true
      },
      password:{
        required:true,
        minlength:6
      },
      confirm_password:{
        required:true,
        minlength:6,
        equalTo:'[name="password"]'
      },
    },
    highlight: function(element) {
      $(element).closest('.form-g').removeClass('has-success').addClass('has-error')
      $(element).closest('.form-g').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function(element) {
      $(element).closest('.form-g').removeClass('has-error').addClass('has-success');
    },
    messages:{
      fullname:{
        required:"Username field is required "
      },
      terms:{
        required:"Please agree With our terms and conditions "
      }
    },
    submitHandler:function(form, event) {
      event.preventDefault()
      $('.loader,.overlay').fadeIn('slow');
      var form=$(form).serializeArray();
      $.ajax({
        url:"/agent/register",
        method:"post",
        data:form,
        success:function(data) {
          $('.loader,.overlay').fadeOut('slow');
          if (data.state=="success") {
            $('#register')[0].reset();
            window.location.href="/agent/login"
            console.log(data.state);
          }
          else if (data.state=="error") {
            $('.error-msg').html("")
            $('.error-msg').fadeIn('slow');
            $('.error-msg').append("<span class='fa fa-warning'> "+data.error+'</span><br>');
            $("html,body").animate({'scrollTop':'200'},1000)
          }

          else{
            $('.error-msg').fadeIn('slow');
            for (var i = 0; i < data.error.length; i++) {
              $('.error-msg').append("<span class='fa fa-warning'>"+data.error[i].msg+'</span><br>');
              $("input[name='"+data.error[i].param+"']").css("border-color","#d9534f").css("background","#f2dede")
            }
            console.log(data);
          }
        }

      })
    }
  });

  $(".property_image").dropify()

  /** ------------------- Posts validaton ------------ **/

 $("#post-property").validate({
   rules:{
     property_features:{
       required:true
     },
   },
   highlight: function(element) {
     $(element).closest('.form-g').removeClass('has-success').addClass('has-error')
     $(element).closest('.form-g').removeClass('has-success').addClass('has-error');
   },
   unhighlight: function(element) {
     $(element).closest('.form-g').removeClass('has-error').addClass('has-success');
   },
   messages:{
      property_image:{
       required:"The first image is required "
     },
     property_features:{
       required:"property features filed s required"
     }
   },
   submitHandler:function(form,event) {
     event.preventDefault()
     var params=$(form).serializeArray();
     //files=$(form).find('[name="product_image"]').files;
     //console.log(files);
     ///return false;
     var formd=new FormData();
     var property_image=$('.property_image');
   $.each(property_image,function(i,val) {
        formd.append('property_image',val.files[0])
    })
     $.each(params,function(i,val) {
       formd.append(val.name,val.value)
     })
     $('.loader,.overlay').fadeIn('slow');
     $.ajax({
       url:"/agent//property",
       method:"POST",
       dataType:'json',
       mimeType:"multipart/form-data",
       contentType:false,
       processData:false,
       data:formd,
       beforeSend:function() {
         $('.loader,.overlay').fadeIn()
       },
       success:function(data) {
         if (data.error) {
           $("#error_ms").html('');
                $('input,textarea,select').css('border','2px solid gray');
                for (var i = 0; i < response.error.length; i++) {
                  var field=response.error[i].param;
                  $('input[name='+field+'],textarea[name='+field+'],select[name='+field+']').css('border','2px solid red');
                  $("#error_ms").append(response.error[i].msg+'<br>').fadeIn("slow");
                }
                $('.custum-msg-danger').addClass("animated fadeInRight").fadeIn().text("All field are required")
                setTimeout(function() {
                  $('.custum-msg-danger').removeClass("animated fadeInRight")
                  $('.custum-msg-danger').addClass("animated fadeOutRight")
                },7000)
                $('.overlay').fadeOut()
         }else {
           $('.custum-msg-success').addClass("animated fadeInRight").fadeIn().text("Posted Successfully");
           setTimeout(function () {
             $('.custum-msg-success').removeClass("animated fadeInRight")
           },5000)
           $('.overlay').fadeOut()
           $('form input,form textarea,select').val('')
           $(".dropify-preview").fadeOut()
         }
         // console.log(data);
         // $('.loader,.overlay').fadeOut('slow');
         // if (data.state=="success") {
         //    $('form input[type=text],textarea,select,form input[type=number]').val('');
         //    $(".dropify-preview").fadeOut()
         // }else{
         //   console.log("error handle");
         //   }
       }

     })
   }
 });





    // var template =`
    // <div class="col-lg-4">
    //  <div class="dropify-wrapper">
    //   <input type="file" name="property_images" class="dropify property_image2" value="">
    //   <div class="dropify-message">
    //     <span class="file-icon" />
    //     <p>Drag and drop a file here of click</p>
    //     <p class="dropify-error">Sorry, this file is too large</p>
    //   </div>
    //   <div class="dropify-preview" >
    //      <span class="dropify-render"></span>
    //       <div class="dropify-infos"><div class="dropify-infos-inner">
    //        <p class="dropify-infos-message">Drag and drop or click to replace</p>
    //       </div>
    //     </div>
    //    </div>
    //      <button type="button" class="dropify-clear">Remove</button>
    //   </div>
    // </div>`
    // $(".img-field").append(template)

  $("#notify").validate({
    rules:{
      email:{
        required:true,
        email:true
      },
    },
    highlight: function(element) {
      $(element).closest('.form-g').removeClass('has-success').addClass('has-error')
      $(element).closest('.form-g').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function(element) {
      $(element).closest('.form-g').removeClass('has-error').addClass('has-success');
    },
    messages:{
      firstname:{
        required:"Firstname field is required "
      },
    },
    submitHandler:function(form, event) {
      event.preventDefault()
      $('.loader,.overlay').fadeIn('slow');
      var form =$(form).serializeArray();
      console.log(form);
      return false;
      $.ajax({
        url:"/agent/register",
        method:"post",
        data:form,
        success:function(data) {
          $('.loader,.overlay').fadeOut('slow');
          if (data.state=="success") {
            $('#register')[0].reset();
            window.location.href="/agent/login"
            console.log(data.state);
          }

          else{
            $('.error-msg').fadeIn('slow');
            for (var i = 0; i < data.error.length; i++) {
              $('.error-msg').append("<span class='fa fa-warning'>"+data.error[i].msg+'</span><br>');
              $("input[name='"+data.error[i].param+"']").css("border-color","#d9534f").css("background","#f2dede")
            }
            console.log(data);
          }


        }

      })
    }
  });

  $('#register').formAnimation({ animatedClass: 'shake' });

  $('.notify-me').click(function () {
    $('.notify-me-form').fadeIn()
    $('.notify-overlay').fadeIn(2000)

  })
  $('.notify-overlay,.cancel').click(function() {
    $('.notify-overlay').fadeOut()
    $('.notify-me-form').fadeOut()
    $('.request-info').fadeOut()
  })




})

$(document).ready(function () {
  $(".delete_property").click(function () {
    var id=$(this).attr("data-id");
    var warning=confirm("Are Sure You Want To Delete The Selected Item");
    if (warning==true) {
      $.ajax({
        method:'delete',
        url:'/property/delete',
        data:{'id':id},
        success:function(data) {
          $('.pro-'+data.data).css({'backgroundColor':'#ccc','border':'1px solid white'});
          setTimeout(function() {
            $('.pro-'+data.data).fadeOut(1200);
            $('.custum-msg-info').addClass("animated fadeInRight").fadeIn().text("property was removed successfully")
          },200)
          setTimeout(function() {
            $('.custum-msg-info').removeClass("animated fadeInRight")
            $('.custum-msg-info').addClass("animated fadeOutRight")
          },7000)
        }
      })
    }
    else {
      return
    }
    })
    $(".delete_land").click(function () {
      var id=$(this).attr("data-id");
      var warning=confirm("Are Sure You Want To Delete The Selected Land Item");
      if (warning==true) {
        $.ajax({
          method:'delete',
          url:'/land/delete',
          data:{'id':id},
          success:function(data) {
            $('.lan-'+data.data).css({'backgroundColor':'#ccc','border':'1px solid white'});
            setTimeout(function() {
              $('.lan-'+data.data).fadeOut(1200);
              $('.custum-msg-info').addClass("animated fadeInRight").fadeIn().text("property was removed successfully")
            },200)
            setTimeout(function() {
              $('.custum-msg-info').removeClass("animated fadeInRight")
              $('.custum-msg-info').addClass("animated fadeOutRight")
            },7000)
          }
        })
      }
      else {
        return
      }
      })
    $(".post-land").click(function (event) {
      event.preventDefault();
      var land_title=$('.land_title').val();
      var land_discription=$('.land_discription').val();
      var land_price=$('.land_price').val();
      var land_area=$('#land_area').val();
      var land_location=$('#land_location').val();
      var location_details=$('.location_details').val();
      var property_agent_id=$('.property_agent_id').val();
      $.ajax({
        method:'post',
        url:'/land',
        data:{
        'land_title':land_title,
        'land_discription':land_discription,
        'land_location':land_location,
        'location_details':location_details,
        'land_price':land_price,
        'land_area':land_area,
        'property_agent_id':property_agent_id,

      },
        success:function(data) {
          if (data.error) {
            $('.custum-msg-danger').addClass("animated fadeInRight").fadeIn().text("All field are required")
            setTimeout(function() {
              $('.custum-msg-danger').removeClass("animated fadeInRight")
              $('.custum-msg-danger').addClass("animated fadeOutRight")
            },7000)
          }
          else{
            setTimeout(function() {
              $('.pro-'+data.data).fadeOut(1200);
              $('.custum-msg-success').addClass("animated fadeInRight").fadeIn().text("Posted successfully")
            },200)
            setTimeout(function() {
              $('.custum-msg-success').removeClass("animated fadeInRight")
              $('.custum-msg-success').addClass("animated fadeOutRight")
            },7000)
            $('.land_title').val('');
            $('.land_discription').val('');
            $('.land_price').val('');
            $('.land_price').val('');
            $('.location_details').val('');
            $('#land_area').val('');
            $('.land_location').val('');
            $('.property_agent_id').val('');
          }
       }
      })
    });


     /**
      *   REQUEST DETAILS FORM
      */

    $("#request-form").validate({
      rules:{
        email:{
          required:true,
          email:true
        },
      },
      highlight: function(element) {
        $(element).closest('.form-g').removeClass('has-success').addClass('has-error')
        $(element).closest('.form-g').removeClass('has-success').addClass('has-error');
      },
      unhighlight: function(element) {
        $(element).closest('.form-g').removeClass('has-error').addClass('has-success');
      },
      submitHandler:function(form, event) {
        event.preventDefault()
        $('.loader,.overlay').fadeIn('slow');
        var form =$(form).serializeArray();
        for (var i = 0; i < form.length; i++) {
          if (form[i].value=='property') {
            var url="/property/buy/request";
          }
          else if(form[i].value=='land') {
            var url="/land/buy/request";
          }
        }
        console.log(form);
        $.ajax({
          url:url,
          method:"post",
          data:form,
          success:function(data) {
            $('.loader,.overlay').fadeOut('slow');
            $('.notify-overlay').fadeIn();
            if (data.state=="success"){
              $(".request-info").fadeIn().addClass("added")
            }
            /**
             *


           else{
           $('.error-msg').fadeIn('slow');
           for (var i = 0; i < data.error.length; i++) {
           $('.error-msg').append("<span class='fa fa-warning'>"+data.error[i].msg+'</span><br>');
           $("input[name='"+data.error[i].param+"']").css("border-color","#d9534f").css("background","#f2dede")
         }
         console.log(data);
       }

             */
             console.log(data);
          }

        })
      }
    });

    $('#admin-bar-open').click(function(){
       $('.sidebar-admin').animate({left:'0px'})
       $(".overlay").fadeIn()
       $(this).fadeOut()
    })
    $('#admin-bar-close').click(function(){
      $('.sidebar-admin').animate({left:'-320px'})
      $(".overlay").fadeOut()
       $('#admin-bar-open').fadeIn()
    })




    function humanReadableTimeDiff(date) {
      var dateDiff = Date.now() - date;
      if (dateDiff <= 0 || Math.floor(dateDiff / 1000) == 0) {
        return 'now';
      }
      if (dateDiff < 1000 * 60) {
        return Math.floor(dateDiff / 1000) + 's';
      }
      if (dateDiff < 1000 * 60 * 60) {
        return Math.floor(dateDiff / (1000 * 60)) + 'm';
      }
      if (dateDiff < 1000 * 60 * 60 * 24) {
        return Math.floor(dateDiff / (1000 * 60 * 60)) + 'h';
      }
      return Math.floor(dateDiff / (1000 * 60 * 60 * 24)) + 'd';
    }

  $('.request-details-action').click(function () {
    $('.retuest-details').fadeOut();
    let target=$(this).attr('data')
    $('.'+target).fadeIn().addClass("animated bounceIn")
    $(".overlay").fadeIn()
  })

  $('.r-cancel').click(function () {
    $('.retuest-details').fadeOut().removeClass("animated bounceIn")
    $(".overlay").fadeOut()
  })


    function price_range () {
        $( "#slider-range" ).slider({
          range: true,
          min: 0,
          max: 100000000,
          values: [ 0, 1000 ],
          slide: function( event, ui ) {
            $( "#amount" ).val( "#" + ui.values[ 0 ] + " - #" + ui.values[ 1 ] );
          }
        });
        $( "#amount" ).val( "#" + $( "#slider-range" ).slider( "values", 0 ) + " - #" + $( "#slider-range" ).slider( "values", 1 ) );
    }
    /* Price-range Js End */

price_range()

})
