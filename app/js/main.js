let customSelect = function () {
    const selectContainers = document.querySelectorAll(".form-select");
    let openedSelect;
    let prevSelect;
    const selectOptions = document.querySelectorAll(".form-select__option");

    selectContainers.forEach(item => {
        item.addEventListener("click", selectToggle);
    });

    function selectToggle () {
        openedSelect = this;

        if (prevSelect && prevSelect != openedSelect) {
            prevSelect.classList.remove("opened");
        }

        this.classList.toggle("opened");

        setInitScroll();

        prevSelect = openedSelect;
    }

    document.addEventListener("click", (event) => {
        if (
            openedSelect &&
            !openedSelect.contains(event.target) &&
            event.target.className != "book__form-option"
        ) {
            selectClose();
        }    
    });

    function selectClose () {
        openedSelect.classList.remove("opened");

        setInitScroll();
    }

    function setInitScroll () {
        openedSelect.querySelector(".form-select__options").scrollTop = 0;
    }

    selectOptions.forEach(item => {
        item.addEventListener("click", selectChoose);
    });

    function selectChoose () {
        const preParent = this.closest(".form-select");
        const selectValue = preParent.querySelector(".form-select__value");

        selectValue.innerText = this.innerText;
        selectValue.style.color = "inherit";
    }
}

customSelect();