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

let swipeSlider = function () {
    const slides = document.querySelectorAll(".specialties__slider-item");
    const dots = document.querySelectorAll(".specialties__slider-dot");
    let rect;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    let marginLeft = parseInt(getComputedStyle(slides[1]).marginLeft);
    let prevIndex = 0;
    let currentIndex;
    let initialX;
    let currentX;
    let distance;
    let minDistance = 100;
    
    document.querySelectorAll(".specialties__image").forEach(item => {
        item.ondragstart = () => {
            return false;
        };
        item.oncontextmenu = () => {
            return false;
        };
    });

    dots[1].classList.add("current");

    dots.forEach((item, index) => {
        item.addEventListener("click", () => {
            dotsControl(index);
        });

        if (item.classList.contains("current")) {
            currentIndex = index;
        }
    });

    function dotsControl (index) {
        if (index === currentIndex) return;

        prevIndex = currentIndex;
        currentIndex = index;

        moveSlides();
    }

    function getRect () {
        rect = slides[currentIndex].getBoundingClientRect();
    }

    getRect();

    frame.addEventListener("resize", () => {
        getRect();
        moveSlides(false);
    });

    function getPosition (event) {
        try {
            return event.touches[0].clientX - rect.left;
        }
        catch (error) {
            return event.clientX - rect.left;
        }
    }

    function moveSlides (needEffects = true) {
        dots[prevIndex].classList.remove("current");
        dots[currentIndex].classList.add("current");

        slides.forEach(item => {
            item.style.transform = `translateX(-${currentIndex * (rect.width + marginLeft)}px`;

            if (needEffects) {
                item.style.opacity = "0.5";

                setTimeout(() => {
                    item.style.opacity = "1";
                }, 200);
            }
        });
    }

    moveSlides(false);

    slides.forEach(item => {
        item.addEventListener("touchstart", swipeStart);
        item.addEventListener("mousedown", (event) => {
            swipeStart(event);

            item.addEventListener("mousemove", swipeProcess);
        });
        item.addEventListener("touchmove", swipeProcess);
        item.addEventListener("touchend", swipeEnd);
        item.addEventListener("touchcansel", swipeEnd);
        item.addEventListener("mouseup", () => {
            swipeEnd();

            item.removeEventListener("mousemove", swipeProcess);
        });
    });

    function swipeStart (event) {
        initialX = getPosition(event);
    }

    function swipeProcess (event) {
        currentX = getPosition(event);
        distance = currentX - initialX;
    }

    function swipeEnd () {
        prevIndex = currentIndex;

        if (-distance >= minDistance) {
            currentIndex++;
        } else if (distance >= minDistance) {
            currentIndex--;
        } else {
            return;
        }

        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        } else if (currentIndex > slides.length - 1) {
            currentIndex = 0;
        }

        moveSlides();

        distance = 0;
    }
}

swipeSlider();