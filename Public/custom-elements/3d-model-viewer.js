// Render 3d files url in website.
// For using this component you must need to add the below script in custom code (Note: script must be in Head) 
// (Website Dashboard -> Settings -> Custom Code)
// Script:
// <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>


const template = document.createElement("template");
template.innerHTML = `
    <style>
        model-viewer{
            width: auto;
            height: 680px;
        }
    </style>
    <div class="model-wrapper"></div>
      
  `;

class Model extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "model-file") {
            console.log("model-file", newValue);
            this.renderImages(newValue, false);
        }
        if (name === "model-height") {
            console.log("model-height", newValue);
            this.renderImages(newValue, true);
        }
    }

    static get observedAttributes() {
        return ["model-file", "model-height"];
    }

    renderImages = (fileURL, isMobile) => {
        const modelWrapper = this.shadowRoot.querySelector(".model-wrapper");

        modelWrapper.innerHTML = `
            <model-viewer
            id="mv-demo"
            shadow-intensity="1"
            alt="A 3D model of a car"
            src="${fileURL}"
            auto-rotate
            camera-controls
            poster="./spacesuit.jpg"
            ></model-viewer>
        `
        if (isMobile) {
            const modelViewer = modelWrapper.querySelector("model-viewer");
            modelViewer.style.height = "200px"

        }
        return true;
    };

    connectedCallback() {

    }
}

window.customElements.define("embed-model", Model);