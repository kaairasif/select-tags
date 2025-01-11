const selectedAll = document.querySelectorAll(".wrapper-dropdown");

selectedAll.forEach((selected) => {
  const optionsContainer = selected.children[2];
  const optionsList = selected.querySelectorAll("div.wrapper-dropdown li");

  selected.addEventListener("click", () => {
    let arrow = selected.children[1];

    if (selected.classList.contains("active")) {
      handleDropdown(selected, arrow, false);
    } else {
      let currentActive = document.querySelector(".wrapper-dropdown.active");

      if (currentActive) {
        let anotherArrow = currentActive.children[1];
        handleDropdown(currentActive, anotherArrow, false);
      }

      handleDropdown(selected, arrow, true);
    }
  });

  // update the display of the dropdown
  for (let o of optionsList) {
    o.addEventListener("click", () => {
      selected.querySelector(".selected-display").innerHTML = o.innerHTML;
    });
  }
});

// check if anything else ofther than the dropdown is clicked
window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdowns();
  }
});

// close all the dropdowns
function closeAllDropdowns() {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    const optionsContainer = selected.children[2];
    let arrow = selected.children[1];

    handleDropdown(selected, arrow, false);
  });
}

// open all the dropdowns
function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotated");
    dropdown.classList.add("active");
  } else {
    arrow.classList.remove("rotated");
    dropdown.classList.remove("active");
  }
}

// Tags manipulation from dropdown select
// =================================================================================================

const tags = [];
const allItems = document.querySelectorAll(".dropdown > li");
const tagsView = document.querySelector(".tags");
const clearAll = document.querySelector(".clear-all");
const countDisplay = document.querySelectorAll(".select__count");

clearAll.style.display = "none";

for (let el of allItems) {
  el.addEventListener("click", (e) => {
    let id = Number(e.target.dataset.id);
    let type = e.target.dataset.type;

    let index = tags.findIndex((i) => i.id === id);

    let data = {
      id: id,
      type: type,
      title: e.target.textContent,
    };
    if (index != -1) {
      tags.splice(index, 1);
      removeTagsDropdown(id);
    } else {
      tags.push(data);
      handleTags(data);
    }

    isClearVisible();

    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
    } else {
      e.target.classList.add("active");
    }

    let catCount = tags.filter((tags) => tags.type === type);

    if (catCount.length === 0) {
      e.target
        .closest(".select-wrapper")
        .querySelector(".select__count").style.display = "none";
    } else if (catCount.length > 0) {
      e.target
        .closest(".select-wrapper")
        .querySelector(".select__count").style.display = "inline-block";
      e.target
        .closest(".select-wrapper")
        .querySelector(".select__count span").innerHTML = catCount.length;
    }
  });
}

const isClearVisible = () => {
  if (tags.length > 0) {
    clearAll.style.display = "block";
  } else {
    clearAll.style.display = "none";
  }
};

const handleTags = (data) => {
  tagsView.innerHTML += `<span class="tags__item" data-tagid="${data.id}">${data.title} <span class="tags__remove"> X</span></span>`;
};

const visibleTags = () => {
  return [...document.querySelectorAll(".tags__item")];
};

const removeTagsDropdown = (id) => {
  for (let el of visibleTags()) {
    if (Number(el.dataset.tagid) === id) {
      el.remove();
    }
  }
};

const handleRemoveTagFromTags = () => {
  return document.querySelectorAll(".tags__remove");
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".tags__remove")) {
    let itemId = Number(e.target.closest(".tags__item").dataset.tagid);

    for (let el of handleRemoveTagFromTags()) {
      if (itemId === Number(el.closest(".tags__item").dataset.tagid)) {
        el.closest(".tags__item").remove();
        let index = tags.findIndex((i) => i.id === itemId);

        tags.splice(index, 1);

        for (let el of allItems) {
          console.log(el);

          if (Number(el.dataset.id) === itemId) {
            el.classList.remove("active");
            let len = tags.filter((tag) => tag.type === el.dataset.type).length;

            if (len === 0) {
              el
                .closest(".select-wrapper")
                .querySelector(".select__count").style.display = "none";
              el
                .closest(".select-wrapper")
                .querySelector(".select__count span").textContent = "";
            } else {
              el
                .closest(".select-wrapper")
                .querySelector(".select__count span").innerHTML = len;
            }
          }
        }
      }
    }

    isClearVisible();
  }
});

clearAll.addEventListener("click", () => {
  tags.length = 0;
  for (let el of visibleTags()) {
    el.remove();
  }
  isClearVisible();
  selectDropdownActiveRemove();

  for (let el of countDisplay) {
    el.querySelector("span").textContent = "";
    el.style.display = "none";
  }
});

const selectDropdownActiveRemove = () => {
  for (let el of allItems) {
    if (el.className == "item active") {
      el.classList.remove("active");
    }
  }
};
