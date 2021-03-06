let customSelect = function () {
    const selectContainers = document.querySelectorAll(".form-select");
    let openedSelect;
    let prevSelect;
    const selectOptions = document.querySelectorAll(".form-select__option");
    const firstOptions = [];
    const lastOptions = [];

    document.querySelectorAll(".form-select__options").forEach(item => {
        firstOptions.push(item.firstElementChild);
        lastOptions.push(item.lastElementChild);
    });

    lastOptions.forEach((item, index) => {
        item.addEventListener("keydown", (event) => {
            if (!event.shiftKey && event.code === "Tab") {
                event.preventDefault();

                firstOptions[index].focus();
            }
        });
    });

    selectContainers.forEach(item => {
        item.addEventListener("click", selectToggle);

        item.addEventListener("keyup", (event) => {
            switch (event.code) {
                case "Enter":
                    selectToggle.call(item);
                    break;
                case "Escape":
                    item.classList.remove("form-select--opened");
                    break;
            }
        });

        item.addEventListener("keydown", (event) => {
            if (
                openedSelect &&
                event.shiftKey && 
                event.code === "Tab" &&
                !item.querySelector(".form-select__options").contains(document.activeElement)
            ) {
                selectClose();
            }
        });
    });

    function selectToggle () {
        openedSelect = this;

        if (prevSelect && prevSelect != openedSelect) {
            prevSelect.classList.remove("form-select--opened");
        }

        this.classList.toggle("form-select--opened");

        setInitScroll();

        prevSelect = openedSelect;
    }

    document.addEventListener("click", (event) => {
        if (
            openedSelect &&
            !openedSelect.contains(event.target) &&
            event.target.className != "form-select__option"
        ) {
            selectClose();
        }    
    });

    function selectClose () {
        openedSelect.classList.remove("form-select--opened");

        setInitScroll();
    }

    function setInitScroll () {
        openedSelect.querySelector(".form-select__options").scrollTop = 0;
    }

    selectOptions.forEach(item => {
        item.addEventListener("click", selectChoose);

        item.addEventListener("keyup", (event) => {
            if (event.code === "Enter") {
                selectChoose.call(item);

                if (openedSelect.previousElementSibling.value === "") {
                    openedSelect.previousElementSibling.focus();
                } else {
                    openedSelect.nextElementSibling.focus();
                }
            }
        });
    });

    function selectChoose () {
        const preParent = this.closest(".form-select");
        const selectValue = preParent.querySelector(".form-select__value");

        selectValue.innerText = this.innerText;
        selectValue.style.color = "inherit";
    }
}();

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

    dots[1].classList.add("specialties__slider-dot--current");

    dots.forEach((item, index) => {
        item.addEventListener("click", () => {
            dotsControl(index);
        });

        item.addEventListener("keyup", (event) => {
            if (event.code === "Enter") {
                dotsControl(index);
            }
        });

        if (item.classList.contains("specialties__slider-dot--current")) {
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
        dots[prevIndex].classList.remove("specialties__slider-dot--current");
        dots[currentIndex].classList.add("specialties__slider-dot--current");

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
        item.addEventListener("mousedown", swipeStart);
        item.addEventListener("touchend", swipeEnd);
        item.addEventListener("touchcansel", swipeEnd);
        item.addEventListener("mouseup", swipeEnd);
    });

    function swipeStart (event) {
        initialX = getPosition(event);
    }

    function swipeEnd (event) {
        currentX = getPosition(event);

        if (!currentX) {
            currentX =  event.changedTouches[event.changedTouches.length - 1].clientX - rect.left;
        }

        distance = currentX - initialX;

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
}();

let sortByCategory = function () {
    const categoryBtns = document.querySelectorAll(".meals__categories-button");
    const categoryItems = document.querySelectorAll(".meals__list");
    let prevActive;

    categoryBtns[0].classList.add("meals__categories-button--active");

    categoryBtns.forEach((item, index) => {
        item.addEventListener("click", filterItems);

        if (item.classList.contains("meals__categories-button--active")) {
            prevActive = item;
            categoryItems[index].classList.add("meals__list--match");

            filterItems.call(prevActive);
        }
    });

    function filterItems () {
        prevActive.classList.remove("meals__categories-button--active");
        this.classList.add("meals__categories-button--active");

        categoryItems.forEach(item => {
            if (item.classList.contains(this.getAttribute("data-filter"))) {
                item.classList.add("meals__list--match");
            } else {
                item.classList.remove("meals__list--match");
            }
        });

        prevActive = this;
    }
}();

let stickyHeader = function () {
    const header = document.querySelector(".header");
    let turnOnArea = 160;
    let turnOffArea = 20;
    let prevScroll;
    let currentScroll;
    let tabNavigate;
    let timer;

    document.addEventListener("keydown", (event) => {
        if (event.code === "Tab") {
            tabNavigate = true;
            
            positionToggle();

            clearTimeout(timer);

            timer = setTimeout(() => {
                tabNavigate = false;
            }, 100);
        }
    });

    window.addEventListener("scroll", checkScroll);

    window.addEventListener("resize", changeAreas);

    function checkScroll () {
        currentScroll = window.pageYOffset;

        positionToggle();
        
        if (!header.classList.contains("header--fixed")) return;

        if (currentScroll > prevScroll) {
            header.classList.add("header--hidden");
        } else {
            header.classList.remove("header--hidden");
        }

        prevScroll = currentScroll;
    }

    function changeAreas () {
        if (window.innerWidth < 1101) {
            turnOnArea = header.offsetHeight;
            turnOffArea = 0;
        }
    }

    changeAreas();

    function positionToggle () {
        if (currentScroll <= turnOffArea || tabNavigate) {
            header.classList.remove("header--fixed", "header--hidden");
            header.style = "";
        } else if (
            !header.classList.contains("header--fixed") &&
            currentScroll > turnOnArea
        ) {
            header.classList.add("header--fixed", "header--hidden");
            header.style = "opacity: 0";

            setTimeout(() => {
                header.style = "";    
            }, 400);
        }
    }
}();

let smoothAnchorScroll = function () {
    let anchorLinks = document.querySelectorAll("a[href^='#'");

    anchorLinks.forEach(item => {
        if (item.getAttribute("href").length < 2) return;

        item.addEventListener("click", function (event) {
            event.preventDefault();

            scrollToBlock.call(this);
        });
    });

    function scrollToBlock () {
        let elem = document.querySelector(this.getAttribute("href"));

        window.scrollTo({
            top: elem.offsetTop,
            behavior: "smooth"
        });
    }
}();

let menu = function () {
    const menuOpenBtn = document.querySelector(".open-btn");
    const menuCloseBtn = document.querySelector(".close-btn");
    const menuBlock = document.querySelector(".side-menu");
    const menuLinks = menuBlock.querySelectorAll(".menu__list-link");
    let lastLink = menuLinks[menuLinks.length - 1];

    menuOpenBtn.addEventListener("click", menuToggle);
    menuCloseBtn.addEventListener("click", menuToggle);
    frame.addEventListener("click", menuToggle);

    menuLinks.forEach(item => {
        item.addEventListener("click", menuToggle);
    });

    function menuToggle () {
        menuBlock.classList.toggle("side-menu--visible");
        document.body.classList.toggle("no-scroll");

        if (menuBlock.classList.contains("side-menu--visible")) {
            menuCloseBtn.focus();
        } else {
            menuOpenBtn.focus();
        }
    }

    menuCloseBtn.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.code === "Tab") {
            event.preventDefault();

            lastLink.focus();
        }
    });

    lastLink.addEventListener("keydown", (event) => {
        if (!event.shiftKey && event.code === "Tab") {
            event.preventDefault();

            menuCloseBtn.focus();
        }
    });
}();