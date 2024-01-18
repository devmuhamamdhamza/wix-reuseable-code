// Custom profile piture upload and view profile picture component.

const template = document.createElement("template");
template.innerHTML = `
    <style>
          body {
            background-color: #efefef;
          }
          .profile-pic {
            border-radius: 100%;
            width: 112px;
            height: 112px;
            object-fit: cover;
            object-position: center;
            display: inline-block;
            border: 2px solid #ffbd59;
          }
  
          .file-upload {
            display: none;
          }
          .circle {
            width: 112px;
            height: 112px;
            position: relative;
            
          }
          .change-profile{
            position: absolute;
            bottom: 0px;
            right: 0px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            border-radius: 100%;
            padding: 4px;
            width: 24px;
        }
          .change-profile .upload-button {
            width: 100%;
            filter: drop-shadow(0px 0px 2px orange);
          }
          .change-profile .upload-button:hover {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        </style>
  
        <div class="circle">
          <img
            class="profile-pic"
            src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            ,
          />
          <div class="change-profile">
            <img
              src="https://static.wixstatic.com/shapes/fdb99c_3f1820aba1804e3dbf1a1376154aaca9.svg"
              alt="Camera-icon"
              width=""
              class="upload-button"
              title="Change Profile Picture"
            />
          </div>
          <input class="file-upload" type="file" accept="image/*" />
        </div>
    `;

class ProfileImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      const profilePic = this.shadowRoot.querySelector(".profile-pic");
      profilePic.setAttribute("src", newValue);
    }
  }

  static get observedAttributes() {
    return ["src"];
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector(".file-upload");
    const uploadButton = this.shadowRoot.querySelector(".upload-button");
    const profilePic = this.shadowRoot.querySelector(".profile-pic");

    input.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const previousSrc = profilePic.getAttribute("src");
        var reader = new FileReader();
        reader.onload = function (e) {
          profilePic.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        console.log(e.target.files);
        this.dispatchEvent(
          new CustomEvent("change-profile", {
            detail: { image: e.target.files[0], previousSrc },
          })
        );
      }
    });

    uploadButton.addEventListener("click", () => {
      input.click();
    });
  }
}

window.customElements.define("profile-image", ProfileImage);
