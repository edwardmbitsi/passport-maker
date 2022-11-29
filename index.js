// Paypal

 paypal.Buttons({
  // Sets up the transaction when a payment button is clicked
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '2.5' // Can also reference a variable or function
        }
      }]
    });
  },
  // Finalize the transaction after payer approval
  onApprove: (data, actions) => {
    return actions.order.capture().then(function(orderData) {
      // Successful capture! For dev/demo purposes:
      console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
      const transaction = orderData.purchase_units[0].payments.captures[0];
      alert(`Transaction ${transaction.status}: ${transaction.id}\n\n`);
      // When ready to go live, remove the alert and show a success message within this page. For example:
      // const element = document.getElementById('paypal-button-container');
      // element.innerHTML = '<h3>Thank you for your payment!</h3>';
       URL:  actions.redirect('success.html');
    });
  }
}).render('#paypal-button-container');

//Photo

console.log("Script started: " + length);
    const inputElement = document.getElementById("input-photo");
    inputElement.addEventListener("change", handleFiles, false);
    var fileUploaded = false;
    //If true, portrait 4x6. Else, landscape 4x6
    /* https://www.w3schools.com/js/js_comments.asp
      FUN FACT: iOS (and i assume other mobile devices) use the orientation variable name so you can't flip the 4x6 orientation in Safari. 
      Its a read-only field... yeah i went crazy trying to debug why setting orientation = true... didn't do anything.
      Changing this to a different name now. woohoo! 1/09/2022
    */
    var template_orientation = false;
    //Global Photo URL
    var PhotoLiveURL = null;
    var isSquare = false;

    function handleFiles() {
      let fileList = this.files; /* now you can work with the file list */
      if (fileList.length == 0) {
        fileUploaded = false;
        console.error("No file uploaded, don't run the rest of the script.");
        return;
      }
      console.log("File uploaded.")

      //If a new file/photo is uploaded, reset photos and canvas, then release ObjectURL
      if (fileUploaded) {
        let uploadedTitle = document.getElementById("upload-title");
        let photo = document.getElementById("uploaded_photo");
        let currentCanvas = document.getElementById("photo_canvas");
        let seperator = document.getElementById("seperatorID");
        uploadedTitle.remove();
        photo.remove();
        currentCanvas.remove();
        seperator.remove();

        delete photo;
        delete currentCanvas;
        delete seperator;
        //Must do memory management for object URLs. They'll be released when the user leaves the website.
        URL.revokeObjectURL(PhotoLiveURL);
      }

      

      //Only one photo can be uploaded, thus only check 1st element.
      PhotoLiveURL = URL.createObjectURL(fileList[0]);
      let checkImg = new Image();
      checkImg.src = PhotoLiveURL;
      checkImg.onload = function () {
        
            showFile(fileList);
            fileUploaded = true;
          }
        }

    function resize(resizeMe) {
      console.log("Resizing photo...")
      if (resizeMe == null || resizeMe.src == null) {
        return;
      }
      //Thank you https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
      let canvas = document.createElement("canvas");
      // Feel free to change
      let MAX_WIDTH = 600;
      let MAX_HEIGHT = 600;
      let width = resizeMe.width;
      let height = resizeMe.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx_temp = canvas.getContext("2d");
      ctx_temp.drawImage(resizeMe, 0, 0, width, height);

      let resize = canvas.toDataURL("image/jpg/", 1.0);
      PhotoLiveURL = resize;
    }

    function showFile(fileList) {
      console.log("Showing uploaded photo")

      const title = document.createElement("h1");
      title.innerHTML = "Uploaded File: ";
      title.setAttribute("style", "padding-top: 140px; text-align: center; font-family: 'Pathway Gothic One', sans-serif; font-size: 30px;")
      title.id = "upload-title";
      document.body.appendChild(title);

      let photo_html = new Image();
      photo_html.src = PhotoLiveURL;
      photo_html.setAttribute("id", "uploaded_photo");
      photo_html.setAttribute("style", "display: block; align-content: center; margin-bottom: 1em;");
      photo_html.classList.add("responsive");
      photo_html.onload = function () {
        create4x6_portrait(photo_html);
      };
      document.body.appendChild(photo_html);

      template_orientation = true;
      //Add line break to seperate uploaded photo and 4x6 canvas
      const seperator = document.createElement("hr");
      seperator.setAttribute("id", "seperatorID");
      seperator.setAttribute("style", "margin: 2em");
      document.body.appendChild(seperator);
    }

    function toggleOrientation() {
      if (fileUploaded) {
        let photo = document.getElementById("uploaded_photo");
        let currentCanvas = document.getElementById("photo_canvas");
        currentCanvas.remove();
        delete currentCanvas;

        if (template_orientation) {
          create4x6_landscape(photo);
          template_orientation = false;
        } else {
          create4x6_portrait(photo);
          template_orientation = true;
        }
      } else {
        console.error("No photo uploaded?")
        alert("Please upload a photo first 😅");
      }
    }

    function create4x6_portrait(photo_html) {
      console.log("Creating portrait")
      let canvas = document.createElement("canvas");
      canvas.setAttribute("id", "photo_canvas");
      canvas.setAttribute("width", photo_html.width * 2);
      canvas.setAttribute("height", photo_html.height * 2);
    canvas.setAttribute("style","padding-left:10px;")
      canvas.classList.add("responsive");
      document.body.appendChild(canvas);
      let html_canvas = document
        .getElementById("photo_canvas")
        .getContext("2d");

      html_canvas.drawImage(photo_html, 0, 0);
      html_canvas.drawImage(photo_html, photo_html.clientWidth, 0);
      html_canvas.drawImage(photo_html, 0, photo_html.clientWidth);
      html_canvas.drawImage(
        photo_html,
        photo_html.clientWidth,
        photo_html.clientWidth
      );
      html_canvas.drawImage(photo_html, 0, photo_html.clientWidth * 2);
      html_canvas.drawImage(
        photo_html,
        photo_html.clientWidth,
        photo_html.clientWidth * 2
      );
      console.log("Created portrait 4x6 photo.");
    }

    function create4x6_landscape(photo_html) {
      console.log("Creating landscape")
      let canvas = document.createElement("canvas");
      canvas.setAttribute("id", "photo_canvas");
      canvas.setAttribute("width", photo_html.height * 2);
      canvas.setAttribute("height", photo_html.width * 2);
   canvas.setAttribute("style", "padding-left: 10px;")
      canvas.classList.add("responsive");
      document.body.appendChild(canvas);
      let html_canvas = document
        .getElementById("photo_canvas")
        .getContext("2d");

      html_canvas.drawImage(photo_html, 0, 0);
      html_canvas.drawImage(photo_html, photo_html.clientWidth, 0);
      html_canvas.drawImage(photo_html, photo_html.clientWidth * 2, 0);
      html_canvas.drawImage(photo_html, 0, photo_html.clientWidth);
      html_canvas.drawImage(
        photo_html,
        photo_html.clientWidth,
        photo_html.clientWidth
      );
      html_canvas.drawImage(
        photo_html,
        photo_html.clientWidth * 2,
        photo_html.clientWidth
      );
      console.log("Created landscape 4x6 photo.");
    }

    

    function downloadCanvas() {
      console.log("Downloading 4x6")
      if (fileUploaded) {
        let html_canvas = document.getElementById("photo_canvas");
        let export_photo = html_canvas.toDataURL("image/jpg", 0.8);

        let file = document.createElement("a");
        file.href = export_photo;
        file.download = "4x6PassportPhoto";
        file.click();
      } else {
        console.error("No photo uploaded?")
        alert("Please upload a photo first 😅");
      }
    }

    
