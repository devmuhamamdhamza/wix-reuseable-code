import { validateInputs } from "@velo/wix-bulk-validation";
import { local } from 'wix-storage';
import { icons } from "public/constant.js"
import { baseUrl, to } from 'wix-location';

export const toggleFilters = (filtersId, btnId) => {
    if ($w(filtersId).collapsed) {
        $w(filtersId).expand()
        $w(btnId).icon = icons.arrowUp
    } else {
        $w(filtersId).collapse()
        $w(btnId).icon = icons.arrowDown
    }
}

export const shiftTab = (tab) => {
    const currentTab = $w("#tabs").tabs.filter(item => item.label === tab)
    if (currentTab.length === 1) $w("#tabs").changeTab($w("#" + currentTab[0].id))
}

export const getDate = () => {
    const date = new Date()

    return {
        year: date.getFullYear()
    }
}

export const setDashboardMenu = (menuList, menu) => {
    if (menuList.length === 3) menu.splice(-1, 1)
    if (menuList.length === 2) menu.splice(-1, 2)
    if (menuList.length === 1) menu.splice(-1, 3)
    menu.forEach((item, ind) => {
        $w(item).text = menuList[ind]
        $w(item).rendered && $w(item).expand()
    })
}

// Get Form Data Object | Showing and Hide error message
let isScrolled = false
export const getFormData = async (parentBox, scrollOnError = true) => {
    const isFormValidate = await validateInputs($w(parentBox))
    const iptComponents = isFormValidate.components
    const types = ["$w.Checkbox"]

    if (isFormValidate.valid) {
        const formData = {}
        iptComponents.forEach(ipt => {
            const componentName = ipt.component
            const type = $w(`#${componentName}`).type
            // if (!types.includes(type)) $w(`#${componentName}Mesg`).hide()
            formData[componentName] = $w(`#${componentName}`).value

        })
        return formData
    } else {
        iptComponents.forEach(ipt => {
            const componentName = ipt.component
            const type = $w(`#${componentName}`).type

            if (ipt.msg && !ipt.valid) {
                if (!types.includes(type)) {
                    // $w(`#${componentName}Mesg`).text = `${ipt.msg}`
                    // $w(`#${componentName}Mesg`).show()
                }
                if (!isScrolled && scrollOnError) {
                    $w(`#${componentName}`).scrollTo()
                    isScrolled = true
                }
            }
            // if (ipt.valid && ipt.msg === '' && !types.includes(type)) {
            //     $w(`#${componentName}Mesg`).hide()
            // }
        })
        return false
    }
}

// Set Form Data
export const setFormData = async (parentBox, values) => {
    const isFormValidate = await validateInputs($w(parentBox))
    const iptComponents = isFormValidate.components
    setTimeout(() => {
        iptComponents.forEach(elem => {
            const comp = elem.component
            if (values[comp]) {
                if (typeof (values[comp]) === 'object') {
                    console.log("");
                } else {
                    $w(`#${comp}`).value = values[comp]
                }
            } else {
                $w(`#${comp}`).resetValidityIndication()
            }
        })
    }, 500)
}
// Set All fields disabled
export const setAllFieldsDisable = async (parentBox) => {
    const isFormValidate = await validateInputs($w(parentBox))
    const iptComponents = isFormValidate.components
    iptComponents.forEach(elem => {
        const comp = elem.component
        $w(`#${comp}`).style.color = "#000"
        $w(`#${comp}`).disable()
    })

}

// Set Form Options
export const setFormOptions = async (parentBox, values) => {
    const isFormValidate = await validateInputs($w(parentBox))
    const iptComponents = isFormValidate.components
    setTimeout(() => {
        iptComponents.forEach(elem => {
            const comp = elem.component
            if (values[comp] && $w("#" + comp).type === "$w.Dropdown") {
                $w(`#${comp}`).options = values[comp]
                $w(`#${comp}`).resetValidityIndication()
            } else {
                $w(`#${comp}`).resetValidityIndication()
            }
        })
    }, 500)
}

// Set Reset Form
export const resetFormData = async (parentBox) => {
    const isFormValidate = await validateInputs($w(parentBox))
    const iptComponents = isFormValidate.components
    const inputTypes = ["text", "password", "email", "url", "tel"]
    iptComponents.forEach(elem => {
        const comp = elem.component
        const compType = $w(`#${comp}`).inputType
        if (inputTypes.includes(compType)) {
            $w(`#${comp}`).value = ""
            $w(`#${comp}`).resetValidityIndication()
        }
        if (compType === "number") {
            $w(`#${comp}`).value = null
            $w(`#${comp}`).resetValidityIndication()
        }
    })

}

export const loadingButton = (button, text, isDisable, $item) => {
    const btn = $item ? $item(`#${button.target.id}`) : $w(`#${button.target.id}`)
    if (isDisable) {
        btn.disable()
        btn.label = text
        btn.collapseIcon()

    } else {
        btn.enable()
        btn.label = text
        btn.expandIcon()
    }
}

export const loadingAdminBtns = (button, text, isDisable, secButton) => {

    const btn = $w(`#${button.target.id}`)
    const secBtn = $w(secButton)
    if (isDisable) {
        btn.disable()
        secBtn.disable()
        btn.label = text
        btn.collapseIcon()

    } else {
        btn.enable()
        secBtn.enable()
        btn.label = text
        btn.expandIcon()
    }

}

export const loadingButtonRepeater = ($item, button, text, isDisable) => {
    const id = `#${button.target.id}`
    if (isDisable) {
        $item(id).disable()
        $item(id).label = text
        $item(id).collapseIcon()

    } else {
        $item(id).enable()
        $item(id).label = text
        $item(id).expandIcon()
    }
}

export const state = {
    get: (key) => local.getItem(key),
    set: (key, value) => local.setItem(key, value),
    delete: (key) => local.removeItem(key),
    clear: () => local.clear(),
}

let timer = setTimeout(() => {}, 100);
export const showHideMesg = (elem, text = "Something wrong", time = 3000, $item) => {
    clearTimeout(timer)
    if (elem && !$item) {
        $w(elem).text = text
        $w(elem).show()
        timer = setTimeout(() => {
            $w(elem).hide()
        }, time);
    }
    if ($item && elem) {
        $item(elem).text = text
        $item(elem).show()
        timer = setTimeout(() => {
            $item(elem).hide()
        }, time);
    }
}
export const collapseExpandMesg = (elem, text = "Something wrong", time = 3000) => {
    clearTimeout(timer)
    if (elem) {
        $w(elem).text = text
        $w(elem).expand()
        timer = setTimeout(() => {
            $w(elem).collapse()
        }, time);
    }
}

export const expandElementFromElements = (element, elements) => {
    const splitElement = element.split(",")
    if (element) {
        $w(element).expand()
        elements.forEach(elem => {
            !splitElement.includes(elem) && $w(elem).collapse()
        })
    }
}

export const authentication = async ({ restricted, content, loader, text, token, redirect }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'true') {
                $w(restricted).delete()
                $w(content).expand()
            }
            if (token === 'false') {
                $w(`${content}, ${loader}`).delete()
                text && $w(text).show()
                redirect && to(baseUrl)
            }
            resolve(true)
        }, 100);
    })

}

export const createRepeaterFromKey = (obj, isIcon) => {
    if (isIcon) {
        return Object.keys(obj).map((key, ind) => ({
            _id: (ind + 1) + "",
            key: key,
            value: obj[key][0],
            icon: obj[key][1]
        }))

    }
    return Object.keys(obj).map((key, ind) => ({
        _id: (ind + 1) + "",
        key: key,
        value: obj[key]
    }))
}

export const createRepeaterFromArray = (arr) => {
    return arr.map((val, ind) => {
        return ({
            _id: `0${ind+1}`,
            value: val
        })
    })
}

// Return array of strings of slected option 
export const getCheckBoxSelection = (elemId) => {
    const options = $w(elemId).options
    const selected = $w(elemId).selectedIndices
    let selectedOption = options.filter((_, ind) => selected.includes(ind) && _.value)
    return selectedOption.map(({ value }) => value)
}

export const createOptions = (options) => {
    if (options.length) return options.map(option => ({ label: option, value: option }))
    return []
}

export const setSelectedBtnFromBtns = (button, buttons) => {
    $w(button).style.backgroundColor = "#ffbd59"
    buttons.forEach(btn => {
        button !== btn && ($w(btn).style.backgroundColor = "#fff")
    })
}

export const setSelectedAdminBtnFromBtns = (button, buttons) => {
    $w(button).style.borderColor = "#0B1316";
    $w(button).style.backgroundColor = "#0B1316";
    $w(button).style.color = "#fff";
    buttons.forEach(btn => {
        if (button !== btn) {
            $w(btn).style.color = "#000";
            $w(btn).style.backgroundColor = "#f2f2f2";
            $w(btn).style.borderColor = "#0C0C0C";
        }
    })
}



export const formatPrice = (price) => {
    const format = new Intl.NumberFormat().format(price)
    return `$${format}`
}

export const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

export const textSplice = (text, maxLenght) => {
    if (text.length >= maxLenght) {
        return `${text.slice(0, maxLenght-3)} ...`
    }
    return text
}