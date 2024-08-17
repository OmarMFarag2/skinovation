new WOW().init();
//-----------------------------------------loading screen-----------------------------------------
$(document).ready(function () {
  setTimeout(function () {
    $(".overlay").fadeOut(600, function () {
      $("body").css("overflow", "visible");
      $(".secondary").each(function () {
        $(this).removeClass("secondary");
      });
    });
  }, 100);
});
//-----------------------------check remember option-----------------
if (!localStorage.getItem('remember'))
  localStorage.setItem('remember', 'false')

if (localStorage.getItem("remember") == 'true' && localStorage.getItem('username')) {
  document.getElementById("log").classList.add("d-none")
  document.getElementById("mainContainer").classList.remove("d-none")
  $("#user").html((localStorage.getItem("username")))
  GetHistory()
  new WOW().init();
}

function setRememberFlag() {
  if (localStorage.getItem('remember') == 'true') {
    localStorage.setItem('remember', "false")
    $(".checkbox").css('background-color', 'white')
  }
  else {
    $(".checkbox").css('background-color', ' rgb(152, 63, 152)')
    localStorage.setItem('remember', 'true')
  }
}


//-----------------------------input validation-----------------------------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[A-Za-z0-9]{4,}$/
let emailFlag = false
let passwordFlag = false;
let usernameFlag = false;
function validateEmail(id) {
  let input = document.getElementById(id);
  console.log(emailRegex.test(input.value));

  if (emailRegex.test(input.value)) {
    emailFlag = true;
    $(input).removeClass("is-invalid")
    $(input).addClass("is-valid")

  }
  else {
    emailFlag = false
    $(input).removeClass("is-valid")
    $(input).addClass("is-invalid")
  }
}
function validateUsername(id) {
  let input = document.getElementById(id);
  console.log(usernameRegex.test(input.value));

  if (usernameRegex.test(input.value)) {
    usernameFlag = true;
    $(input).removeClass("is-invalid")
    $(input).addClass("is-valid")

  }
  else {
    usernameFlag = false
    $(input).removeClass("is-valid")
    $(input).addClass("is-invalid")
  }
}

function validatePassword(id) {
  let input = document.getElementById(id);
  console.log(passwordRegex.test(input.value));
  if (passwordRegex.test(input.value)) {
    passwordFlag = true;
    $(input).removeClass("is-invalid")
    $(input).addClass("is-valid")

  }
  else {
    passwordFlag = false
    $(input).removeClass("is-valid")
    $(input).addClass("is-invalid")
  }
}

//------------------------------history manipulation functions------------------
let history = [];
let saveHistory = false;
function setHistoryFlag() {
  if (saveHistory) {

    $(".checkbox2").css('background-color', 'white')
    saveHistory = false
  }
  else {
    $(".checkbox2").css('background-color', ' rgb(152, 63, 152)')
    saveHistory = true
  }
}

async function GetHistory() {
  const id = localStorage.getItem('id');
  // Prepare the data to be sent in the request
  const data = {
    id: id,
  };
  try {
    // Send the POST request to the login API
    const response = await fetch('https://omarmfarag-test.hf.space/getHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // Check if the response is successful
    if (response.ok) {
      $("#histSpinner").addClass('hidden')
      const result = await response.json();
      console.log('Login successful:', result);
      history = result
      printHistory()

    } else {
      const error = await response.json();
      console.log(error);
    }
    // You can show an error message to the user
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle network errors or other unexpected issues
  }
}
async function PostHistory(result, mode) {
  if (!saveHistory)
    return
  if (mode == "cam") {
    let data = {
      "id": localStorage.getItem('id'),
      "result": result,
      'file': dataURL
    }
    try {
      const response = await fetch('https://omarmfarag-test.hf.space/upload2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      GetHistory()

    } catch (error) {
      console.error('Error sending image data:', error);
    }
  }
  else {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('result', result);
    formData.append('id', localStorage.getItem('id'));
    try {
      const response = await fetch('https://omarmfarag-test.hf.space/upload', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const result = await response.json();
        GetHistory()
      } else {
        console.error('Error uploading image:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
}
document.getElementById("history").addEventListener('click', function (e) {
  var clickedElement = e.target;
  if (clickedElement.id == "history") {
    toggleHistory()
  }
})

async function updateHistory(id) {
  const userid = localStorage.getItem('id');
  console.log(id);
  console.log(userid);
  const data = {
    'userid': userid,
    'id': id
  };

  try {
    const response = await fetch('https://omarmfarag-test.hf.space/deleteHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function deleteHistory(index) {
  let histid = history[index].id
  console.log(history);
  history.splice(index, 1)
  printHistory()
  updateHistory(histid)
}
function hideHistory() {
  if (!$('#history').hasClass('hidden')) {
    $('#history').addClass('hidden')
  }
}
function toggleHistory() {
  $('.navActive').removeClass('navActive')
  if ($('#history').hasClass('hidden')) {
    $('#history').removeClass('hidden')
    $('#histBtn').addClass('navActive')
  }
  else {
    $('#history').addClass('hidden')
    let currentOffset = $(window).scrollTop()
    count = currentOffset - prevOffset
    $("section").each(function (index) {
      let secOffset = $(this).offset().top + Number($(this).css("height").replace("px", ""))
      if ($(this).offset().top - 200 < currentOffset && secOffset > currentOffset && $('#history').hasClass('hidden')) {
        $(".navActive").removeClass("navActive")
        $(".nav-link")[index].classList.add("navActive")
      }
    })
  }
}
function printHistory() {
  $("#historySpinner").addClass('hidden')
  let html = ''
  console.log(12);
  if (history.length == 0) {
    $("#noHist").removeClass('hidden')
    $("#header").addClass('hidden')
    $("#items").addClass('hidden')
  }
  else {
    $("#noHist").addClass('hidden')
    $("#header").removeClass('hidden')
    $("#items").removeClass('hidden')
    for (let i = 0; i < history.length; i++) {
      let dateString = new Date(history[i].time);
      let formattedDate = moment(dateString).format("ddd MMM YYYY h:mm:ss A");
      html += ` 
      <div class="col-md-3 ${i == history.length - 1 ? 'noBorder' : ''}   py-3 d-flex justify-content-center align-items-center">
      <p class="text-center">${formattedDate}</p>
      </div>
                    <div class="col-md-3 ${i == history.length - 1 ? 'noBorder' : ''}  py-3 d-flex justify-content-center align-items-center">
                    <p class="text-center">${history[i].result}</p>
                    </div>
                    <div class="col-md-3 ${i == history.length - 1 ? 'noBorder' : ''}  py-3 d-flex justify-content-center align-items-center">
                    <div>
                    <img src="${history[i].path}" class="rounded-3" alt="">
                    </div>
                    </div>
                    <div class="col-md-3 ${i == history.length - 1 ? 'noBorder' : ''}  py-3 d-flex justify-content-center align-items-center">
                    <div>
                    <i onclick=deleteHistory(${i}) class="fa-solid delete fa-trash">delete</i>
                    </div>
                    </div>
                    `
    }
  }
  document.getElementById("items").innerHTML = html
}






//---------------------------------uploading image---------------------------------
const img = document.getElementById("image")
const preview = document.getElementById("preview")
let Name = document.getElementById("input")
let clear = document.getElementById("clear")
let cam = document.getElementById("capture")
img.onchange = function () {
  preview.src = URL.createObjectURL(img.files[0])
  Name.innerHTML = img.files[0].name;
  clear.classList.remove("hidden")
  preview.classList.add("Rounded")
  $("#submit").removeClass("Disable")
  $("#submit").removeAttr("disabled")
  $("#camError").addClass("hidden");
  image = img.files[0];
  console.log(img.files[0]);
}
function remove() {
  clear.classList.add("hidden")
  Name.innerHTML = "no file chosen";
  preview.src = "images/istockphoto-1147544807-612x612.jpg"
  $("#submit").addClass("Disable")
  $("#submit").attr("disabled", "disabled");

}
function slide(id) {
  let btn = document.getElementById(id)
  btn.click()
}
//---------------------------------------navbar and up arrow animations-------------------------------------
let flag = false;
let scrolled = false;
let count = 0;
let prevOffset = $(window).scrollTop();
let navflag = true;
let image = undefined;
$(window).scroll(function () {
  let currentOffset = $(window).scrollTop()
  let targetOffset = $("#test").offset().top
  count = currentOffset - prevOffset
  $("section").each(function (index) {
    let secOffset = $(this).offset().top + Number($(this).css("height").replace("px", ""))
    if ($(this).offset().top - 200 < currentOffset && secOffset > currentOffset && $('#history').hasClass('hidden')) {
      $(".navActive").removeClass("navActive")
      $(".nav-link")[index].classList.add("navActive")
    }
  })
  if ($(window).scrollTop() == 0) {
    $("nav").css("box-shadow", "0 0 0 0");
  } else {
    $("nav").css("box-shadow", "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)");
  }
  let navOffset = Number($("nav").css("top").replace("px", ""))
  let navHeight = Number($("nav").css("height").replace("px", "")) + 5
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
  if (!navflag) {
    closeNav()
  }
  prevOffset = currentOffset
})
function closeNav() {
  if ($("nav button")[0].ariaExpanded == 'true') {
    console.log(1);
    $("nav button").click()
    navflag = true
  }
}
function Toggle() {
  if (navflag)
    navflag = false
  else
    navflag = true
}
//-----------------------------------------Model api-----------------------------------------
async function sendData() {
  try {
    const response = await fetch('https://omarmfarag-test.hf.space/predict2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'image': dataURL })
    });
    const result = await response.json();
    if (response.ok) {
      showPrediction(result, "cam")
    }
  } catch (error) {
    console.error('Error sending image data:', error);
  }
}



function printResult(result) {
  let symptoms = ''
  let desc = '';
  let disPath = '';
  switch (result) {
    case "Atopic dermatitis":
      symptoms = "Intense itching, red to brownish-gray patches, small raised bumps that may leak fluid, thickened skin, and sensitive, swollen areas from scratching.";
      desc = "Atopic dermatitis, commonly known as eczema, is a chronic skin condition characterized by inflamed, itchy, and red patches of skin. It often starts in childhood and can persist into adulthood. The exact cause is unknown, but it's believed to be a combination of genetic, environmental, and immune system factors."
      disPath = 'images/skin.png'
      break;
    case "Lichen planus":
      symptoms = "Purplish flat-topped bumps with a white lacy pattern, severe itching, blisters, mouth lesions, genital lesions, hair loss, and nail damage.";
      desc = "Lichen planus is an inflammatory condition that affects the skin and mucous membranes. Its exact cause is unknown, but it's thought to be related to an abnormal immune response. It can occur at any age but is most common in middle-aged adults."
      disPath = 'images/hand.png'

      break;
    case "Onychomycosis":
      symptoms = "Thickened, discolored nails that are brittle, crumbly, and distorted in shape, sometimes accompanied by a foul smell"
      desc = "Onychomycosis is a fungal infection of the nails, more commonly affecting toenails than fingernails. It can cause nails to become thickened, discolored, and brittle. The condition can be persistent and difficult to treat."

      disPath = 'images/nail.png'
      break;
    case "Tinea capitis":
      symptoms = "Scaly, itchy patches on the scalp, bald spots, expanding patches, tender areas, pus-filled sores, and sometimes low-grade fever with swollen lymph nodes.";
      desc = "Tinea capitis, also known as scalp ringworm, is a fungal infection of the scalp. It primarily affects children but can occur in adults. The infection spreads through direct contact with infected individuals or objects."
      disPath = 'images/man.png'
      break;
    case "Acne vulgaris":
      symptoms = "Whiteheads, blackheads, red tender bumps, pimples with pus, and large painful lumps under the skin.";
      desc = "Acne vulgaris is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It often causes whiteheads, blackheads, or pimples and typically appears on the face, forehead, chest, upper back, and shoulders. Acne is most common among teenagers, though it affects people of all ages."
      disPath = 'images/face.png'
      break;
    default:
      symptoms = "";
      desc = "The 'Unknown' class is assigned to images that do not contain identifiable skin regions or when no detectable skin condition is present. "
      disPath = 'images/Unknown skin disease.png'

      break;
  }
  let res = `  <h2>${result}</h2>
         <p>${desc}</p>
         <h2 id="sym">${result == 'Unknown' ? '' : 'symptoms'}</h2>
         <p id="symptoms">${symptoms}</p>`
  let disImg = `<img src="${disPath}" class="border-1 shadow-sm rounded-3" alt="" width="100%">`
  document.getElementById("diagnosis").innerHTML = res
  document.getElementById("disease").innerHTML = disImg
}


async function uploadImage() {
  $("#loader3").removeClass("d-none")
  $("#sub3").addClass("d-none")
  if (saveHistory) {
    $("#historySpinner").removeClass("hidden")
    $("#noHist").addClass('hidden')
    $("#items").addClass('hidden')
    $("#header").addClass('hidden')
  }
  if (Name.innerHTML == "captured_img") {
    sendData()
  }
  else {
    const formData = new FormData();
    formData.append('file', image);
    try {
      const response = await fetch('https://omarmfarag-test.hf.space/predict', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.prediction);
        showPrediction(result, URL.createObjectURL(img.files[0]), 'upload')
      } else {
        console.error('Error uploading image:', response);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

}
function showPrediction(result, mode) {
  slide("result")

  $("#sub3").removeClass("d-none")
  $("#loader3").addClass("d-none")
  printResult(result.prediction)
  if (saveHistory)
    PostHistory(result.prediction, mode)

}
//-----------------------------------------WebCam handling-----------------------------------------
let dataURL = 0;
document.getElementById('capture-btn').addEventListener('click', function () {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.width = Number($("#video").css("width").replace("px", ""))
  canvas.height = Number($("#video").css("height").replace("px", ""))
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  dataURL = canvas.toDataURL('image/png');
  preview.src = dataURL
  Name.innerHTML = "captured_img";
  clear.classList.remove("hidden")
  preview.classList.add("Rounded")
  closeCamera()
  cam.classList.add("hidden")
});


function closeCamera() {
  var stream = video.srcObject;
  var tracks = stream.getTracks();
  tracks.forEach(function (track) {
    track.stop();
  });
}
function webcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      console.log(stream);
      var video = document.getElementById('video');
      video.srcObject = stream;
      video.play();
      cam.classList.remove("hidden")
      $("#camError").addClass("hidden");
      $("#submit").removeClass("Disable")
      $("#submit").removeAttr("disabled")
    })
    .catch(function (err) {
      $("#camError").removeClass("hidden");
    });
}
function exit2() {
  closeCamera()
  cam.classList.add("hidden")
  document.body.style.overflow = "visible"
}

//-----------------------------------------Login/Signup-----------------------------------------
function resetInputs() {
  usernameFlag = passwordFlag = emailFlag = false
  let input = document.querySelectorAll("#log input,#sign input")
  input = Array.from(input)

  console.log(input);
  for (let i = 0; i < input.length; i++) {
    input[i].value = ''
    input[i].classList.remove('is-valid')
    input[i].classList.remove('is-invalid')
  }
}
function toggleEye(id) {
  let element = document.getElementById(id)
  if ($('.fa-eye').hasClass('hidden')) {
    $('.fa-eye-slash').addClass('hidden')
    $('.fa-eye').removeClass('hidden')
    element.type = 'text'
  }
  else {
    $(id).attr('type', 'password')
    $('.fa-eye-slash').removeClass('hidden')
    $('.fa-eye').addClass('hidden')
    element.type = 'password'

  }
}
function logSign(id, id2) {
  resetInputs()
  usernameFlag = passwordFlag = emailFlag = false;
  new WOW().init();
  $(id2).addClass("d-none")
  $(id).removeClass("d-none")

}
function logout() {
  saveHistory = false;
  resetInputs()
  localStorage.setItem('remember', "false")
  $(".checkbox").css('background-color', 'white')
  $(".checkbox2").css('background-color', 'white')


  localStorage.clear()
  document.getElementById("mainContainer").classList.add("d-none")
  document.getElementById("log").classList.remove("d-none")
  $('#history').addClass('hidden')
  $('#histBtn').removeClass('navActive')
  history = []
  remove()
}
async function login() {
  if (!emailFlag) {
    $("#email").removeClass("is-valid")
    $("#email").addClass("is-invalid")
    $('#isValidMail').html("Make sure to enter valid a email")
  }
  if (!passwordFlag) {
    $("#password").removeClass("is-valid")
    $("#password").addClass("is-invalid")
    $('#isValidPassword').html("password should be atleast 8 <br> characters including 1 letter and 1 number")
  }
  if (!(emailFlag && passwordFlag))
    return

  // Get the input values
  $("#loader").removeClass("d-none")
  $("#sub").addClass("d-none")
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Prepare the data to be sent in the request
  const data = {
    email: email,
    password: password
  };

  try {
    // Send the POST request to the login API
    const response = await fetch('https://omarmfarag-test.hf.space/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    $("#sub").removeClass("d-none")
    $("#loader").addClass("d-none")
    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      console.log('Login successful:', result);
      localStorage.setItem("username", result[0].username)
      localStorage.setItem("email", result[0].email)
      localStorage.setItem("id", result[0].id)
      $("#user").html(result[0].username)
      document.getElementById("log").classList.add("d-none")
      document.getElementById("mainContainer").classList.remove("d-none")
      new WOW().init();
      $(".nav-link")[0].classList.add("navActive")
      GetHistory()

    } else {
      let a = "aa"
      const error = await response.json();
      if (error.error.includes("email")) {
        $('#isValidMail').html("Email not registered")
        $("#isValidMail").removeClass("d-none")
        $("#email").addClass("is-invalid")
      }
      else {
        console.log(1);
        $('#isValidPassword').html("Wrong password")
        $("#isValidPassword").removeClass("d-none")
        $("#password").addClass("is-invalid")
      }
      // You can show an error message to the user
    }
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle network errors or other unexpected issues
  }
}
async function signup() {
  if (!emailFlag) {
    $("#new_email").removeClass("is-valid")
    $("#new_email").addClass("is-invalid")
    $('#isValidMail2').html("Make sure to enter valid a email")
  }
  if (!passwordFlag) {
    $("#new_password").removeClass("is-valid")
    $("#new_password").addClass("is-invalid")
    $('#isValidPassword2').html("password should be atleast 8 <br> characters including 1 letter and 1 number")
  }
  if (!usernameFlag) {
    $("#new_username").removeClass("is-valid")
    $("#new_username").addClass("is-invalid")
    $('#isValidUser').html("username should be atleast 4 characters <br> and shouldn't contain special characters")
  }
  if (!(emailFlag && passwordFlag && usernameFlag))
    return

  $("#loader2").removeClass("d-none")
  $("#sub2").addClass("d-none")
  // Get the input values
  const email = document.getElementById('new_email').value;
  const password = document.getElementById('new_password').value;
  const username = document.getElementById('new_username').value;

  // Prepare the data to be sent in the request
  const data = {
    email: email,
    password: password,
    username: username
  };

  try {
    // Send the POST request to the login API
    const response = await fetch('https://omarmfarag-test.hf.space/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    $("#sub2").removeClass("d-none")
    $("#loader2").addClass("d-none")
    // Check if the response is successful
    if (response.ok) {
      toast()
      logSign("#log", "#sign")
      const result = await response.json();
      console.log('Login successful:', result);

    } else {
      $("#new_email").removeClass("is-valid")
      $("#new_email").addClass("is-invalid")
      $('#isValidMail2').html("email already registered")
      const error = await response.json();
      console.log(error);
      if (error.error.includes("email")) {
        $("#isValidMail2").removeClass("d-none")
        $("#new_email").addClass("is-invalid")
      }
      // You can show an error message to the user
    }
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle network errors or other unexpected issues
  }
}



function reset(input, id) {
  input.classList.remove("is-invalid");
  $(id).html("")
}
function toast() {
  const toastLiveExample = document.getElementById('liveToast')
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()
}
function hideToast() {
  $("#liveToast").fadeOut(200)
}