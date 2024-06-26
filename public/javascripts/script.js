function showAndHideUserMenu() {
  const userIcon = document.querySelector(".user-icon");
  const menuBtn = document.querySelector(".menu-btn");
  const menuList = document.querySelector(".menu-list");

  let isOpen = false;

  if (!menuBtn || !menuList) {
    return;
  }

  const toggleMenu = () => {
    if (isOpen) {
      menuList.style.right = "-90%";
      isOpen = false;
    } else {
      menuList.style.transform = "scale(1)";
      menuList.style.right = "0%";
      isOpen = true;
    }
  };

  menuBtn.addEventListener("click", toggleMenu);

  if (userIcon) {
    userIcon.addEventListener("click", toggleMenu);
  }

  document.addEventListener("click", (event) => {
    if (
      isOpen &&
      !menuList.contains(event.target) &&
      !menuBtn.contains(event.target) &&
      (!userIcon || !userIcon.contains(event.target))
    ) {
      menuList.style.right = "-90%";
      isOpen = false;
    }
  });
}

showAndHideUserMenu();

function NoteCreation() {
  const noteBtn = document.querySelector(".note-btn");
  const closeBtn = document.querySelector(".close-btn");
  const closeInfo = document.querySelector(".close-info");
  const noteCreateDiv = document.querySelector(".note-create-div");
  const noteInfo = document.querySelector(".note-info");

  if (!noteBtn) {
    return null;
  }
  noteBtn.addEventListener("click", () => {
    noteInfo.style.display = "none";
    noteCreateDiv.style.opacity = 1;
    noteCreateDiv.style.pointerEvents = "all";
    isOpen = true;
  });

  closeBtn.addEventListener("click", () => {
    noteInfo.style.display = "block";
    noteCreateDiv.style.opacity = 0;
    noteCreateDiv.style.pointerEvents = "none";
    isOpen = false;
  });
  closeBtn.addEventListener("mouseenter", () => {
    closeInfo.style.opacity = 1;
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeInfo.style.opacity = 0;
  });

  function removeTextAreaWhiteSpace() {
    var body = document.getElementById("body");
    body.value = body.value.trim();
  }

  removeTextAreaWhiteSpace();

  noteBtn.addEventListener("mouseenter", () => {
    noteInfo.style.opacity = 1;
  });

  noteBtn.addEventListener("mouseleave", () => {
    noteInfo.style.opacity = 0;
  });
}

NoteCreation();

function NoteCreationPhone() {
  const noteBtn = document.querySelector(".note-btn-1");
  const closeBtn = document.querySelector(".close-btn");
  const closeInfo = document.querySelector(".close-info");
  const noteCreateDiv = document.querySelector(".note-create-div");
  const noteInfo = document.querySelector(".note-info");

  if (!noteBtn) {
    return null;
  }
  noteBtn.addEventListener("click", () => {
    noteInfo.style.display = "none";
    noteCreateDiv.style.opacity = 1;
    noteCreateDiv.style.pointerEvents = "all";
    isOpen = true;
  });

  closeBtn.addEventListener("click", () => {
    noteInfo.style.display = "block";
    noteCreateDiv.style.opacity = 0;
    noteCreateDiv.style.pointerEvents = "none";
    isOpen = false;
  });
  closeBtn.addEventListener("mouseenter", () => {
    closeInfo.style.opacity = 1;
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeInfo.style.opacity = 0;
  });

  function removeTextAreaWhiteSpace() {
    var body = document.getElementById("body");
    body.value = body.value.trim();
  }

  removeTextAreaWhiteSpace();

  noteBtn.addEventListener("mouseenter", () => {
    noteInfo.style.opacity = 1;
  });

  noteBtn.addEventListener("mouseleave", () => {
    noteInfo.style.opacity = 0;
  });
}
NoteCreationPhone();

function NoteCardInfo() {
  const noteCards = document.querySelectorAll(".note-card");
  const titleInfos = document.querySelectorAll(".title-info");

  if (noteCards.length === titleInfos.length) {
    noteCards.forEach((noteCard, index) => {
      const titleInfo = titleInfos[index];

      noteCard.addEventListener("mouseenter", () => {
        titleInfo.style.opacity = 1;
        titleInfo.style.pointerEvents = "all";
      });

      noteCard.addEventListener("mouseleave", () => {
        titleInfo.style.opacity = 0;
        titleInfo.style.pointerEvents = "none";
      });
    });
  } else {
    console.warn('Mismatch between ".note-card" and ".title-info" elements.');
  }
}

NoteCardInfo();


function showNotesContainer() {
  const noteViewer = document.querySelector(".note-viewer-container");
  const noteDiv = document.querySelector(".note-div");

  // Check if elements exist
  if (!noteViewer || !noteDiv) {
    return null;
  }

  noteDiv.addEventListener("dblclick", (event) => {
    const target = event.target.closest(".note-card");
    if (target) {
      const title = target.querySelector(".title").textContent.trim();
      const body = target.querySelector(".body").textContent.trim();

      const titleElement = noteViewer.querySelector(".view-title");
      const contentElement = noteViewer.querySelector(".view-content");

      titleElement.textContent = title;
      contentElement.textContent = body;

      noteViewer.style.opacity = 1;
      noteViewer.style.pointerEvents = "all";


      const backBtn = document.getElementById("backBtn");
      backBtn.addEventListener("click", () => {
        noteViewer.style.opacity = 0;
        noteViewer.style.pointerEvents = "none";
      });
    }
  });
}

showNotesContainer();

function UpdateNote() {
  const editBtns = document.querySelectorAll(".edit-btn");
  const noteUpdateDiv = document.querySelector(".note-update-div");
  const closeBtn = document.querySelector(".close-btn2");
  const closeInfo = document.querySelector(".close-info2");

  if (!editBtns || !closeBtn) {
    return null;
  }
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {

      noteUpdateDiv.style.opacity = 1;
      noteUpdateDiv.style.pointerEvents = "all";
      const target = event.target.closest(".note-card");
  
      const title = target.querySelector(".title").textContent.trim();
      const body = target.querySelector(".body").textContent.trim();
  
      const titleElement = noteUpdateDiv.querySelector(".update-title");
      const contentElement = noteUpdateDiv.querySelector(".update-body");
  
      titleElement.textContent = title;
      contentElement.textContent = body;

      const updateBtn = document.querySelector(".update-btn");
      updateBtn.addEventListener("click", () => {
        const updateForm = document.querySelector(".update-form");
    
        const noteId = editBtn.dataset.noteId;
      
        const id = `/note/update/${noteId}`;
      
        updateForm.setAttribute('action', id);
      });
      
 
    });
  });

  closeBtn.addEventListener("click", () => {
    noteUpdateDiv.style.opacity = 0;
    noteUpdateDiv.style.pointerEvents = "none";
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeInfo.style.opacity = 1;
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeInfo.style.opacity = 0;
  });

}

UpdateNote();

function DeleteNote() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const cancelBtn = document.querySelector(".cancel");
  const deleteConform = document.querySelector(".note-delete-conform");

  // Function to handle delete confirmation
  function showDeleteConfirmation(index, noteId) {
    deleteConform.style.opacity = 1;
    deleteConform.style.pointerEvents = "all";

    // Set up event listener for delete button inside delete confirmation
    const deleteConfirmBtn = document.querySelector(".confirm-delete");
    deleteConfirmBtn.addEventListener("click", () => {
      // Redirect to delete route
      window.location.href = `/note/delete/${index}/${noteId}`;
    });
  }

  // Add event listener to each delete button
  deleteBtns.forEach((deleteBtn, index) => {
    deleteBtn.addEventListener("click", () => {
      // Retrieve note ID from data attribute or other means
      const noteId = deleteBtn.dataset.noteId;
      // Call function to show delete confirmation
      showDeleteConfirmation(index, noteId);
    });
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      deleteConform.style.opacity = 0;
      deleteConform.style.pointerEvents = "none";
    });
  }
}

DeleteNote();

function logOutUser () {
  const logOut  = document.querySelector(".logout");

  if (!logOut) {
    return null;
  }
  logOut.addEventListener("click", () => {
    window.location.href = '/user/logout';
  });
}
logOutUser();

function loginAndForgotForm () {
  const forgotBtn = document.querySelector(".forgot-btn");
  const loginBtn = document.querySelector(".login-btn");
  const loginForm = document.querySelector(".login-form-div");
  const resetPassForm = document.querySelector(".reset-pass-form-div");

  if (!forgotBtn || !loginBtn) {
    return null;
  }

  forgotBtn.addEventListener("click", () => {
    loginForm.style.opacity = 0;
    loginForm.style.pointerEvents = "none";
    loginForm.style.position = "absolute";
    resetPassForm.style.opacity = 1;
    resetPassForm.style.pointerEvents = "all";
    resetPassForm.style.position = "relative";
  });

  loginBtn.addEventListener("click", () => {
    resetPassForm.style.opacity = 0;
    resetPassForm.style.pointerEvents = "none"
    resetPassForm.style.position = "absolute";
    loginForm.style.opacity = 1;
    loginForm.style.pointerEvents = "all";
    loginForm.style.position = "relative";
  });


}

loginAndForgotForm();


function normalAndAuth0LoginForm () {
  const loginForm = document.querySelector(".login-form-div");
  const auth0Form = document.querySelector(".auth0-login-form-div");

   const otherOptions = document.querySelector(".other-option");
   const emailPass = document.querySelector(".email-pass-options");

   if (!otherOptions || !emailPass) {
    return null;
  }

   otherOptions.addEventListener("click", () => {
    loginForm.style.opacity = 0;
    loginForm.style.pointerEvents = "none";
    loginForm.style.position = "absolute";
    auth0Form.style.opacity = 1;
    auth0Form.style.pointerEvents = "all";
    auth0Form.style.position = "relative";
   });

   emailPass.addEventListener("click", () => {
    auth0Form.style.opacity = 0;
    auth0Form.style.pointerEvents = "none";
    auth0Form.style.position = "absolute";
    loginForm.style.opacity = 1;
    loginForm.style.pointerEvents = "all";
    loginForm.style.position = "relative";
   });
}
normalAndAuth0LoginForm();

function normalAndAuth0SignupForm () {
  const signupForm = document.querySelector(".signup-form-div")
  const auth0Form = document.querySelector(".auth0-signup-form-div")


  const otherOptions = document.querySelector(".other-option");
  const signupOps = document.querySelector(".signup-option");

  if (!otherOptions || !signupOps) {
   return null;
 }

  otherOptions.addEventListener("click", () => {
   signupForm.style.opacity = 0;
   signupForm.style.pointerEvents = "none";
   signupForm.style.position = "absolute";
   auth0Form.style.opacity = 1;
   auth0Form.style.pointerEvents = "all";
   auth0Form.style.position = "relative";
  });

  signupOps.addEventListener("click", () => {
   auth0Form.style.opacity = 0;
   auth0Form.style.pointerEvents = "none";
   auth0Form.style.position = "absolute";
   signupForm.style.opacity = 1;
   signupForm.style.pointerEvents = "all";
   signupForm.style.position = "relative";
  });
}
normalAndAuth0SignupForm();

function oauthSignupLogin() {
  const googleBtn = document.querySelectorAll(".google");
  const githubBtn = document.querySelectorAll(".github");
  const microsoftBtn = document.querySelectorAll(".microsoft");
  const discordBtn = document.querySelectorAll(".discord");

  if (!googleBtn || !githubBtn || !microsoftBtn || !discordBtn) {
    return null;
  }
  googleBtn.forEach( (btns) =>{
    btns.addEventListener("click", () => {
      window.location.href = '/auth/google';
    });
  });
  githubBtn.forEach( (btns) =>{
    btns.addEventListener("click", () => {
      window.location.href = '/auth/github';
    });
  });
  microsoftBtn.forEach( (btns) =>{
    btns.addEventListener("click", () => {
      window.location.href = '/auth/microsoft';
    });
  });
  discordBtn.forEach( (btns) =>{
    btns.addEventListener("click", () => {
      window.location.href = '/auth/discord';
    });
  });

}

oauthSignupLogin();