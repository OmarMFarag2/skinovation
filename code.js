new WOW().init();
let flag = false;
let scrolled = false;
let count = 0;
let prevOffset = $(window).scrollTop();
const img = document.getElementById("image")
const preview = document.getElementById("preview")
let Name = document.getElementById("input")
let clear = document.getElementById("clear")
let cam = document.getElementById("capture")
let navflag = true;
$(document).ready(function () {
  setTimeout(function () {
    $(".overlay").fadeOut(700, function () {
      $("body").css("overflow", "visible");
      // $(".navbar").slideDown();
      $(".secondary").each(function () {
        $(this).removeClass("secondary");
      });
    });
  }, 100); // 2000 milliseconds = 2 seconds
});
img.onchange = function () {
  preview.src = URL.createObjectURL(img.files[0])
  Name.innerHTML = img.files[0].name;
  clear.classList.remove("hidden")
  preview.classList.add("Rounded")
  $("#submit").removeClass("Disable")
  $("#submit").removeAttr("disabled")
  $("#camError").addClass("hidden");
}
function remove() {
  clear.classList.add("hidden")
  Name.innerHTML = "no file chosen";
  preview.src = "images/istockphoto-1147544807-612x612.jpg"
  $("#submit").addClass("Disable")
  $("#submit").attr("disabled", "disabled");

}
function Test(id) {
  let btn = document.getElementById(id)
  btn.click()
}
$(".nav-link").click(function () {
  $(".navActive").removeClass("navActive")
  $(this).addClass("navActive")
})
$(window).scroll(function () {
  let currentOffset = $(window).scrollTop()
  let targetOffset = $("#test").offset().top
  count = currentOffset - prevOffset
  $("section").each(function (index) {
    let secOffset = $(this).offset().top + Number($(this).css("height").replace("px", ""))
    if ($(this).offset().top - 200 < currentOffset && secOffset > currentOffset) {
      $(".navActive").removeClass("navActive")
      $(".nav-link")[index].classList.add("navActive")
      console.log(1);
    }
  })
  if ($(window).scrollTop() == 0) {
    $("nav").css("box-shadow", "0 0 0 0");
  } else {
    $("nav").css("box-shadow", "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)");
  }
  // console.log(count);
  //  console.log(typeof(Number($("nav").css("top"))));
  // if (Math.abs(currentOffset - prevOffset) > 10)
  //   trigger = true;
  // if (currentOffset > prevOffset) {
  //   if (scrolled) {
  //     scrolled = false;
  //     $("nav").css({ top: `${Number($("nav").css("top"))-count}` })
  //   }
  // }
  // else {
  //   if (!scrolled) {
  //     scrolled = true;
  //     $("nav").animate({ top: "0" })
  //   }
  // }
  let navOffset = Number($("nav").css("top").replace("px", ""))
  let navHeight = Number($("nav").css("height").replace("px", ""))+5
  navHeight *= -1
  if ((navOffset <= 0 || navOffset >= navHeight) && navflag) {
    if (count > 0) {
      if (navOffset - count < navHeight)
        $("nav").css({ top: `${navHeight}` })
      else
        $("nav").css({ top: `${navOffset - count}px` })
    }
    else {
      if (navOffset + Math.abs(count) > 0)
        $("nav").css({ top: "0px" })
      else
        $("nav").css({ top: `${navOffset + Math.abs(count)}px` })
    }
  }
  if (currentOffset >= targetOffset - 70) {
    if (!flag) {
      $("#upBtn").animate({ margin: "30px 30px" }, 200)
      flag = true
    }
  }
  else {
    if (flag) {
      $("#upBtn").animate({ margin: "0px 30px -60px 0px" }, 200)
      flag = false
    }
  }
  prevOffset = currentOffset
})
function Toggle() {
  if (navflag)
    navflag = false
  else
    navflag = true
}
document.getElementById('capture-btn').addEventListener('click', function () {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the data URL representing the current frame
  var dataURL = canvas.toDataURL('image/png');
  preview.src = dataURL
  Name.innerHTML = "captured_img";
  clear.classList.remove("hidden")
  preview.classList.add("Rounded")
  cam.classList.add("hidden")
  document.body.style.overflow = "visible"
});
function webcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      var video = document.getElementById('video');
      video.srcObject = stream;
      video.play();
      cam.classList.remove("hidden")
      $("#camError").addClass("hidden");
      // document.body.style.overflow = "hidden";
    })
    .catch(function (err) {
      $("#camError").removeClass("hidden");
      $("#test").addClas
    });
  // $("#capture").html(`            <div class="position-relative">
  // <video id="video" width="640" height="480" autoplay></video>
  // <button id="capture-btn"></button>
  // </div>
  // <canvas id="canvas" width="640" height="480" style="display:none;"></canvas>`)
}
function exit2() {
  cam.classList.add("hidden")
  document.body.style.overflow = "visible"
}