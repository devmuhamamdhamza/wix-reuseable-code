// User can select multiple images, view all selcted images and user can also update selcted images
// Component return selected images files array
// You need to add event listener with the name "upload-photos" on page code.


const generateId = () => {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
const template = document.createElement("template");
template.innerHTML = `
      <style>
      * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
      }

      .container {
        max-width: 585px;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 36px;
        margin-bottom: 24px;
      }
      .inputBox {
        max-width: 285px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }
      .container > .inputBox > img {
        width: clamp(80px, 11vw, 100px);
      }
      .container > .inputBox > .upload-photos {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;
      }
      .container > .inputBox > .upload-photos > div {
        width: 100%;
        flex: 1;
      }
      .container > .inputBox > .upload-photos > div > button {
        width: 100%;
        padding: 8px 12px;
        border: none;
        outline: none;
        border-radius: 5px;
        background: #ffbd59;
        cursor: pointer;
      }

      .container > .inputBox > .upload-photos > .error {
        color: #cc0000;
        font-size: 12px;
        text-align: center;
      }
      .container > .inputBox > .upload-photos > .selected {
        width: clamp(140px, 4vw, 170px);
        text-overflow: ellipsis;
        text-wrap: nowrap;
        overflow: hidden;
        color: #6e6e6e;
        text-align: center;
        font-size: 12px;
      }
      .input-photos {
        visibility: hidden;
        width: 0px;
        height: 0px;
        position: absolute;
      }
      .previewImages {
        list-style-type: none;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
      }
      .previewImages li {
        width: 80px;
        height: 80px;
        position: relative;
      }
      .previewImages li .imageSrc {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: 1px solid #ffbd59;
        border-radius: 4px;
      }
      .previewImages li button {
        position: absolute;
        padding: 0px;
        outline: none;
        border: none;
        background: transparent;
        top: 4px;
        right: 4px;
        cursor: pointer;
      }
    </style>

    <div class="container">
      <div class="inputBox">
        <img
          src="https://static.wixstatic.com/shapes/fdb99c_23044f2fffb44afbbf2554e679937193.svg"
          alt=""
          width=""
          height=""
        />
        <div class="upload-photos">
          <div>
            <button class="add-photos"><span>+</span> ADD PHOTOS</button>
          </div>
          <p class="error"></p>
          <p class="selected">(Max limit 5 MB per image)</p>
        </div>
        <input class="input-photos" type="file" multiple accept="image/*" />
      </div>
      <ul class="previewImages">
        
      </ul>
    </div>
  `;

let photosURL = [];
class UploadPhotos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ("previous-images") {
            const previousImages = JSON.parse(newValue);
            console.log({previousImages});
            photosURL = []
            previousImages.forEach((item) => {
                photosURL.push({
                    title: "",
                    src: item,
                    _id: generateId(),
                    previousImage: item,
                });
            });
            this.renderImages(photosURL);
        }
    }

    static get observedAttributes() {
        return ["previous-images"];
    }

    removeImage = (e) => {
        const id = e.target.parentNode.parentNode.getAttribute("id");
        let photos = photosURL;
        photos = photos.filter((photo) => photo._id !== id);
        photosURL = photos;
        this.renderImages(photosURL);
        this.dispatchPhotos({ photosURL });
    };

    renderImages = (images) => {
        const imagesList = this.shadowRoot.querySelector(".previewImages");

        imagesList.innerHTML = images
            .map((image) => {
                return `
        <li class="previewImage" id=${image._id}>
          <img
            class="imageSrc"
            src="${image.src}"
            alt="${image.title}"
            width="100%"
            height=""
            title="${image.title}"
          />
          <button class="btnRemove">
            <img
              src="https://static.wixstatic.com/media/fdb99c_7d849fef7204465483a6e66334601e5b~mv2.png"
              width="16px"
              height="16px"
            />
          </button>
        </li>
    `;
            })
            .join("");
        this.shadowRoot.querySelectorAll(".btnRemove").forEach((elem) => {
            elem.addEventListener("click", this.removeImage);
        });

        return true;
    };

    dispatchPhotos = (data) => {
        this.dispatchEvent(
            new CustomEvent("upload-photos", {
                detail: data,
            })
        );
    };

    disconnectedCallback() {
        console.log("Custom Element Disconnected from DOM");
        const imagesList = this.shadowRoot.querySelector(".previewImages");
        this.shadowRoot.querySelectorAll(".btnRemove").forEach((elem) => {
            elem.removeEventListener("click", () => console.log("removed"));
        });
        imagesList.innerHTML = ""
    }

    connectedCallback() {
        const addPhotos = this.shadowRoot.querySelector(".add-photos");
        const inputPhotos = this.shadowRoot.querySelector(".input-photos");
        const error = this.shadowRoot.querySelector(".error");
        const selected = this.shadowRoot.querySelector(".selected");
        const imagesList = this.shadowRoot.querySelector(".previewImages");
        const createClickEvent = () => {
            this.shadowRoot.querySelectorAll(".btnRemove").forEach((elem) => {
                elem.addEventListener("click", this.removeImage);
            });
        };

        addPhotos.addEventListener("click", (e) => {
            inputPhotos.click();
        });

        inputPhotos.addEventListener("change", async (e) => {
            const photos = e.target.files;
            let isSizeValid = true;
            let fileNames = [];
            for (let i = 0; i < photos.length; i++) {
                fileNames.push(photos[i].name);
                photosURL.push({
                    title: photos[i].name,
                    src: URL.createObjectURL(photos[i]),
                    _id: generateId(),
                    file: photos[i],
                });
                if (photos[i].size > 5000000) {
                    isSizeValid = false;
                }
            }
            if (isSizeValid) {
                // selected.innerText = `${photos.length} photos selected`;
                selected.title = fileNames.join("\n");
                error.innerText = "";
                this.renderImages(photosURL);
                // createClickEvent();
                this.dispatchPhotos({ photosURL });

                // Continue from here
            } else {
                showHideMesg(error, "Each Image size must have 5mb or less than 5mb");
            }
        });

        // const

        let timer;
        const showHideMesg = (element, mesg) => {
            clearTimeout(timer);
            element.style.display = "initial";
            element.innerText = mesg;
            selected.innerText = "";
            timer = setTimeout(() => {
                element.innerText = "";
            }, 3000);
        };
    }
}

window.customElements.define("upload-photos", UploadPhotos);