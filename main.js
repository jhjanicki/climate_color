//Global variables

let yourBirthYear;
let yourDeathYear;
let yourAge;
let yourData;
let yourBirthYearTemp;
let yourDeathYearTemp;
let selecterPersonBirthYear;
let selecterPersonDeathYear;
let selecterPersonBirthYearTemp;
let selectedPersonData;
let selectedPerson;
let currentScenario;


// on input change or on click events

$("#bithyearInput").on("input", function() {
    yourBirthYear = +this.value;
    $("#birthyear").html(yourBirthYear);
    $("#birthyearMenu").html(yourBirthYear);
    yourAge = 2023 - yourBirthYear;
    yourDeathYear = yourBirthYear + 99;
    yourData = data.filter(d => d.Year >= yourBirthYear && d.Year <= yourDeathYear)
    updateIcon("#you", yourAge)
    yourBirthYearTemp = data.filter(d => d.Year == yourBirthYear)[0].historical.toFixed(2)
    $("#birthYearContainer").css("background", tempColorScale(yourBirthYearTemp))
    $("#birthYearContainer").css("border", "0px")
});

$(".celebrityWrapper").on("click", function() {
    selecterPersonBirthYear = +$(this).find(".personYear").text();
    selectedPerson = $(this).find(".person").text();
    selecterPersonDeathYear = selecterPersonBirthYear + 99;
    selectedPersonData = data.filter(d => d.Year >= selecterPersonBirthYear && d.Year <= selecterPersonDeathYear)

    // $("#celebrityBirthYear").html(`Compared to ${selectedPerson}, born in ${selecterPersonBirthYear}`);
    $("#celebrityMenu").html(`${selectedPerson}, born ${selecterPersonBirthYear}`);
    updateCelebrityIcon();
})

$(".scenario").on("click", function() {
    currentScenario = $(this).attr("id")
    // $("#scenarioSelected").html(currentScenario)
    $("#scenarioMenu").html(convertText(currentScenario))
    yourDeathYearTemp = data.filter(d => d.Year == yourDeathYear)[0][currentScenario].toFixed(2)
})

$("#start").on("click", function() {
    if (yourBirthYear && selecterPersonBirthYear && currentScenario) {
        svg.style("display", "block")
        svg2.style("display", "block")
        $("#conclusion").css("display", "block")
        if (yourDeathYearTemp === (-1.00)) {
            yourDeathYearTemp = "unsure (data not available after 2100)"
        }
        $("#tempLow").html(yourBirthYearTemp)
        $("#tempHigh").html(yourDeathYearTemp)
        $("#yearLow").html(yourBirthYear)
        $("#yearHigh").html(yourDeathYear)
        $("#ssp").html(currentScenario)
        updateRects();
        startTimeline();
        d3.select(".title2").text(`${selectedPerson}'s climate stripe`)

        if(selecterPersonBirthYear<=2023){
            selecterPersonBirthYearTemp = data.filter(d => d.Year == selecterPersonBirthYear)[0].historical.toFixed(2)
        }else{
            selecterPersonBirthYearTemp = data.filter(d => d.Year == selecterPersonBirthYear)[0][currentScenario].toFixed(2)
        }

        d3.select(".personBg1").attr("fill", tempColorScale(yourBirthYearTemp))
        d3.select(".personBg2").attr("class","personBg2").attr("fill", tempColorScale(selecterPersonBirthYearTemp))
    } else {
        $(".modal").css("display", "block")
    }
})

$("#closeModal").on("click", function() {
    $(".modal").css("display", "none")
})

$("#download").on('click', function() {
    captureScreenshot();
})

function convertText(text){
    const ssp = text.slice(0, 3).toUpperCase();
    const num = text.slice(3, 4);
    const ERF1 = text.slice(4,5);
    const ERF2 = text.slice(5);
    return `${ssp}${num}-${ERF1}.${ERF2}`;
}


//to create the 100 rects before the actual data from the user selection, as placeholder so later on can just update
let dummyData = data.filter(d => d.Year >= 1988 && d.Year <= 2087)

//vars + scales for svg
const margin = {
    top: 100,
    right: 0,
    bottom: 0,
    left: 0
};
const width = d3.select("#chart").node().getBoundingClientRect().width;
const height = 8000 - margin.top - margin.bottom;

const tempColorScale = d3
    .scaleThreshold()
    .domain([0, 0.4, 0.8, 1.2, 1.6, 2, 2.4, 2.8, 3.2, 3.6, 4, 4.4, 4.8])
    .range(["#213468", "#2171b5", "#6baed6", "#deebf7", "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);

const yScale = d3
    .scaleLinear()
    .domain([1, 100])
    .range([margin.top, height - margin.bottom]);

const numbers = Array.from({
    length: 100
}, (_, index) => index + 1);
const center = (width + margin.left + margin.right) / 2;
const imgDimension = 40;
const ageRectWidth = 80;
const tempTextOffsetX = 80;
const yearTextOffsetX = 10;
const yearTextOffsetY = 35;

//SVG set up
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(0," + margin.top + ")")
    .style("display", "none")

const bg = svg.append("g").attr("id", "background1").attr("transform", `translate(0,${margin.top})`);
const bg2 = svg.append("g").attr("id", "background2").attr("transform", `translate(${width/2},${margin.top})`);

bg.selectAll("bgRect1")
    .data(dummyData)
    .join("rect")
    .attr("class", "bgRect1")
    .attr("id", (d, i) => `bgRect1_${i+1}`)
    .attr("width", width / 2 - margin.left)
    .attr("height", yScale(1) - yScale(0) - 0.8) //-0.8 to have space to highlight rect stroke, b/c of this need to fill stroke color too. -0.8 isn't wide enough to show the whole bottom stroke but if too wide there's a gap. using .raise() on the rect messes up the order and data
    .attr("x", margin.left)
    .attr("y", (d) => yScale(d.Year - 1988) - margin.top)
    .attr("fill", "white")

bg2.selectAll("rect.bgRect2")
    .data(dummyData)
    .join("rect")
    .attr("class", "bgRect2")
    .attr("id", (d, i) => `bgRect2_${i+1}`)
    .attr("width", width / 2 - margin.left)
    .attr("height", yScale(1) - yScale(0) - 0.8)
    .attr("x", margin.left)
    .attr("y", (d) => yScale(d.Year - 1988) - margin.top)
    .attr("fill", "white")

bg.append("rect").attr("class","personBg1").attr("x", center-(yScale(1) - yScale(0) - 0.8))
.attr("y", -(yScale(1) - yScale(0) - 0.8)).attr("height", yScale(1) - yScale(0) - 0.8).attr("width", yScale(1) - yScale(0) - 0.8).attr("fill", "white").attr("rx",5).attr("ry",5)

bg2.append("rect").attr("class","personBg2").attr("x", 0)
.attr("y", -(yScale(1) - yScale(0) - 0.8)).attr("height", yScale(1) - yScale(0) - 0.8).attr("width", yScale(1) - yScale(0) - 0.8).attr("fill", "white").attr("rx",5).attr("ry",5)

svg.selectAll("text.year1")
    .data(numbers)
    .join("text")
    .attr("class", "year1")
    .attr("x", yearTextOffsetX)
    .attr("y", (d, i) => margin.top + i * (yScale(1) - yScale(0)) - yearTextOffsetY)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .style("font-size", 16)
    .style("text-align", "left")
    .text((d) => d);

svg.selectAll("text.year2")
    .data(numbers)
    .join("text")
    .attr("class", "year2")
    .attr("x", width - yearTextOffsetX)
    .attr("y", (d, i) => margin.top + i * (yScale(1) - yScale(0)) - yearTextOffsetY)
    .attr("fill", "black")
    .attr("text-anchor", "end")
    .style("font-size", 16)
    .style("text-align", "left")
    .text((d) => d);

svg.append("image")
    .attr("class", "you")
    .attr("width", imgDimension * 2)
    .attr("height", imgDimension * 2)
    .attr("x", center - imgDimension * 2)
    .attr("y", yScale(0))
    .attr("xlink:href", "./img/baby.png")

svg.append("image")
    .attr("class", "celebrity")
    .attr("width", imgDimension * 2)
    .attr("height", imgDimension * 2)
    .attr("x", center)
    .attr("y", yScale(0))
    .attr("xlink:href", "./img/baby.png")

svg.append("text")
    .attr("class", "temperature1")
    .attr("x", center - tempTextOffsetX)
    .attr("fill", "black")
    .style("font-size", 20)
    .style("font-weight", 300);

svg.append("text")
    .attr("class", "temperature2")
    .attr("x", center + tempTextOffsetX)
    .attr("fill", "black")
    .style("font-size", 20)
    .style("font-weight", 300);

svg.append("rect")
    .attr("class", "ageRect")
    .attr("x", center - ageRectWidth / 2)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("width", ageRectWidth)
    .attr("height", 30)
    .attr("fill", "rgba(255,255,255,0.5)")
    .style("opacity",0)

svg.append("text")
    .attr("class", "ageText")
    .attr("x", center)
    .attr("text-anchor", "middle")
    .style("font-size", 16)
    .style("font-weight", 300)
    .style("opacity",0)

svg.append("text")
    .attr("class", "title1")
    .attr("x", center/2)
    .attr("y", 15)
    .attr("fill", "black")
    .style("font-size", 20)
    .style("font-weight", 300)
    .attr("text-anchor","middle")
    .text("Your climate stripe")

svg.append("text")
    .attr("class", "title2")
    .attr("x", center + center/2)
    .attr("y", 15)
    .attr("fill", "black")
    .style("font-size", 20)
    .style("font-weight", 300)
    .attr("text-anchor","middle")
    .text("")


//SVG2 set up, for your climate color at the end

const height2 = 500;
const margin2 = {
    top: 50,
    bottom: 30
}
const svg2 = d3
    .select("#chart2")
    .append("svg")
    .attr("id", "svg2")
    .attr("width", width)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .style("display", "none")

const bg3 = svg2.append("g").attr("transform", "translate(0," + margin2.top + ")")

const xScale = d3
    .scaleLinear()
    .domain([1, 100])
    .range([0, width]);


bg3.selectAll("bgRect3")
    .data(dummyData)
    .join("rect")
    .attr("class", "bgRect3")
    .attr("id", (d, i) => `bgRect3_${i+1}`)
    .attr("width", xScale(2) - xScale(1) + 0.3)
    .attr("height", height2)
    .attr("x", d => xScale(d.Year - 1988))
    .attr("y", 0)

bg3.append("text").attr("id", "yourBirthYear").attr("x", 10).attr("y", -10).attr("fill", "black").text(1988)
bg3.append("text").attr("id", "yourDeathYear").attr("x", width - 40).attr("y", -10).attr("fill", "black").text(2087)

const texture = textures.circles()
    .size(20)
    .radius(1)
    .fill("white")
    .background("#bdbdbd")

svg.call(texture);

function updateRects() {
    d3.selectAll(".bgRect1").data(yourData).attr("fill", d => {
            if (d.historic === "no") {
                let rectTexture = textures.circles()
                    .size(20)
                    .radius(1)
                    .fill("black")
                    .background(tempColorScale(d[currentScenario]));
                svg.call(rectTexture);
                return rectTexture.url()
            } else if (d.historic === "NA") {
                return texture.url()
            } else {
                return tempColorScale(d[currentScenario])
            }
        })
        .attr("stroke", d => d.historic === "NA" ? "#bdbdbd" : tempColorScale(d[currentScenario]));

    d3.selectAll(".bgRect2").data(selectedPersonData).attr("fill", d => {
            if (d.historic === "no") {
                let rectTexture = textures.circles()
                    .size(20)
                    .radius(1)
                    .fill("black")
                    .background(tempColorScale(d[currentScenario]));
                svg.call(rectTexture);
                return rectTexture.url()
            } else if (d.historic === "NA") {
                return texture.url()
            } else {
                return tempColorScale(d[currentScenario])
            }
        })
        .attr("stroke", d => d.historic === "NA" ? "#bdbdbd" : tempColorScale(d[currentScenario]));

    d3.selectAll(".year1").data(yourData).text(d => d.Year)
    d3.selectAll(".year2").data(selectedPersonData).text(d => d.Year)

    //just to update the temp texts of the first rect when user clicks start, may not be necessary
    d3.select(".temperature1").data(yourData).text(d => d[currentScenario].toFixed(2) === "-1.00" ? "No data" : `${d[currentScenario].toFixed(2)>0?"+":""}${d[currentScenario].toFixed(2)}°C`)
    d3.select(".temperature2").data(selectedPersonData).text(d => d[currentScenario].toFixed(2) === "-1.00" ? "No data" : `${d[currentScenario].toFixed(2)>0?"+":""}${d[currentScenario].toFixed(2)}°C`)


    d3.selectAll(".bgRect3")
        .data(yourData)
        .attr("fill", d => d.historic === "NA" ? "#bdbdbd" : tempColorScale(d[currentScenario]))

    d3.select("#yourBirthYear").text(yourBirthYear)
    d3.select("#yourDeathYear").text(yourDeathYear)
}

let age = 0;

function startTimeline() {
    gsap.timeline({
        scrollTrigger: {
            trigger: "#svg",
            scrub: true,
            markers: false,
            start: "top top", //first trigger, second scroller
            end: "100% bottom",
            onUpdate({
                progress,
            }) {
                age = Math.round((progress * 100))
                updateIcon(".you", age) //update 'you' icon based on age

                if (age < 100) {
                    let temp1 = (yourData[age][currentScenario]).toFixed(2);
                    let temp2 = (selectedPersonData[age][currentScenario]).toFixed(2);

                    //update y poositions of icons and text
                    d3.select(".you").attr("y", yScale(Math.round(progress * 100)))
                    d3.select(".celebrity").attr("y", yScale(Math.round(progress * 100)))
                    d3.select(".ageRect").attr("y", yScale(Math.round(progress * 100)) + (yScale(1) - yScale(0))).style("opacity",1)
                    d3.select(".ageText").attr("y", yScale(Math.round(progress * 100)) + (yScale(1) - yScale(0)) + 20).text(`Age ${+age+1}`).style("opacity",1)


                    d3.select(".personBg1").attr("y", yScale(Math.round(progress * 100))- (yScale(1) - yScale(0))-22).attr("stroke", "#000").attr("stroke-width", "2px");
                    d3.select(".personBg2").attr("y", yScale(Math.round(progress * 100))- (yScale(1) - yScale(0))-22).attr("stroke", "#000").attr("stroke-width", "2px");



                    //highlight current rects and unhighlight the rest
                    d3.selectAll(".bgRect1").attr("stroke", d => d.historic === "NA" ? "#bdbdbd" : tempColorScale(d[currentScenario]));
                    d3.select(`#bgRect1_${age+1}`).attr("stroke", "#000").attr("stroke-width", "2px");

                    d3.selectAll(".bgRect2").attr("stroke", d => d.historic === "NA" ? "#bdbdbd" : tempColorScale(d[currentScenario]));
                    d3.select(`#bgRect2_${age+1}`).attr("stroke", "#000").attr("stroke-width", "2px");

                    d3.select(".temperature1").attr("y", yScale(Math.round(progress * 100)) + 46).text(temp1 === "-1.00" ? "No data" : `${temp1>0?"+":""}${temp1}°C`).attr("x", temp1 == "-1.00" ? (center - 150) : (center - 140)) //I used -1 to indicate no data
                    d3.select(".temperature2").attr("y", yScale(Math.round(progress * 100)) + 46).text(temp2 === "-1.00" ? "No data" : `${temp2>0?"+":""}${temp2}°C`)
                }
            }
        }
    })
}



  function captureScreenshot() {
    const divToCapture = document.getElementById('chart2');

    html2canvas(divToCapture).then(function (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'screenshot.png';
      link.click();
    });

  }


//Functions to update icons...

// icons are temporary so conoditions will change
function updateCelebrityIcon() {
    if (selectedPerson === "Bernie Sanders" || selectedPerson === "David Attenborough") {
        d3.select(".celebrity").attr("xlink:href", "./img/sanders.png")
    }

    if (selectedPerson === "Michael Jordan" || selectedPerson === "Rodger Federer") {
        d3.select(".celebrity").attr("xlink:href", "./img/federer.png")
    }

    if (selectedPerson === "Emma Watson") {
        d3.select(".celebrity").attr("xlink:href", "./img/watson.png")
    }

    if (selectedPerson === "Greta Thunberg") {
        d3.select(".celebrity").attr("xlink:href", "./img/thunberg.png")
    }

    if (selectedPerson === "8 billionth baby" || selectedPerson === "Future baby") {
        d3.select(".celebrity").attr("xlink:href", "./img/8thbillion.png")
    }
}

// will have more icons so conditions will change
function updateIcon(classOrID, age) {

    if (age >= 0 && age < 4) {
        d3.select(classOrID).attr("xlink:href", "./img/baby.png")
        $(classOrID).attr("src", "./img/baby.png");
    }
    if (age >= 4 && age < 11) {
        d3.select(classOrID).attr("xlink:href", "./img/kid.png")
        $(classOrID).attr("src", "./img/kid.png");
    }
    if (age >= 11 && age < 20) {
        d3.select(classOrID).attr("xlink:href", "./img/teen.png")
        $(classOrID).attr("src", "./img/teen.png");
    }
    if (age >= 20 && age < 60) {
        d3.select(classOrID).attr("xlink:href", "./img/adult.png")
        $(classOrID).attr("src", "./img/adult.png");
    }

    if (age >= 60 && age <= 100) {
        d3.select(classOrID).attr("xlink:href", "./img/old.png")
        $(classOrID).attr("src", "./img/old.png");
    }

}