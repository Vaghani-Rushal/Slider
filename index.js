document.addEventListener("DOMContentLoaded", function () {
  let sliders = [];
  let verticalLines = [];
  let container = document.getElementById("container");
  let tableBody = document.getElementById("tableBody");

  container.addEventListener("dblclick", function (event) {
    let sliderPosition =
      event.clientX - container.getBoundingClientRect().left - 8;
    createSlider(sliderPosition);
  });

  function createSlider(position) {
    let color = getRandomColor();
    let verticalLine = document.createElement("div");
    verticalLine.className = "verticalLine";
    verticalLine.style.left = position + "px";
    verticalLine.style.backgroundColor = color;

    let slider = document.createElement("div");
    slider.className = "slider";
    slider.style.left = position - 8 + "px";
    slider.style.borderBlockColor = color;

    container.appendChild(verticalLine);
    container.appendChild(slider);

    verticalLines.push(verticalLine);
    sliders.push(slider);

    updateTable();
    updateBackground();

    let isDragging = false;
    slider.addEventListener("mousedown", function (event) {
      isDragging = true;
      let offsetX = event.clientX - slider.getBoundingClientRect().left;

      function moveSlider(moveEvent) {
        if (isDragging) {
          let newPosition =
            moveEvent.clientX -
            container.getBoundingClientRect().left -
            offsetX;
          newPosition = Math.max(
            0,
            Math.min(container.clientWidth - slider.clientWidth, newPosition)
          );
          verticalLine.style.left = newPosition + "px";
          slider.style.left = newPosition - 8 + "px";
          updateTable();
          updateBackground();
        }
      }

      function stopMoving() {
        isDragging = false;
        document.removeEventListener("mousemove", moveSlider);
        document.removeEventListener("mouseup", stopMoving);
      }

      document.addEventListener("mousemove", moveSlider);
      document.addEventListener("mouseup", stopMoving);
    });
  }

  function deleteSlider(index) {
    let slider = sliders[index - 1];
    let verticalLine = verticalLines[index - 1];
    slider.remove();
    verticalLine.remove();
    sliders.splice(index - 1, 1);
    verticalLines.splice(index - 1, 1);
    updateTable();
    updateBackground();
  }

  function updateTable() {
    sliders.sort(
      (s1, s2) => parseFloat(s1.style.left) - parseFloat(s2.style.left)
    );
    verticalLines.sort(
      (v1, v2) => parseFloat(v1.style.left) - parseFloat(v2.style.left)
    );

    tableBody.innerHTML = "";
    sliders.forEach((slider, index) => {
      let newRow = tableBody.insertRow();
      let sliderCell = newRow.insertCell(0);
      sliderCell.textContent = index + 1;
      let xCoordinateCell = newRow.insertCell(1);
      xCoordinateCell.textContent = parseFloat(slider.style.left) + 8;
      let deleteCell = newRow.insertCell(2);
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "deleteButton";
      deleteButton.style.backgroundColor = slider.style.borderBlockColor;
      deleteButton.addEventListener("click", function () {
        deleteSlider(newRow.rowIndex);
      });
      deleteCell.appendChild(deleteButton);
    });
  }

  function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function updateBackground() {
    if (sliders.length === 0) {
      container.style.background = "black";
      return;
    }

    let gradientStops = [];

    sliders.forEach((slider, index) => {
      let stop = (parseFloat(slider.style.left) * 100) / 600;
      gradientStops.push(`${slider.style.borderBlockColor} ${stop}%`);
    });

    if (gradientStops.length === 1) {
      gradientStops.push(`white 100%`);
    }

    container.style.background = `linear-gradient(to right, ${gradientStops.join(
      ", "
    )})`;
  }
});
