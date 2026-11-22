

function getLoader() {
    return document.querySelector(".loader");
}

function showLoader () {
    const loader= getLoader();

    if (loader){
        loader.classList.remove("hidden");
    }
}

function hideLoader () {
    const loader= getLoader();

    if (loader){
        loader.classList.add("hidden");
    }
}

export default {showLoader, hideLoader};

