let prevButton;
let nextButton;
let repeatButton; // Declare the repeat button
let repeatButtonPosition;
let nextButtonPosition;
let startColor; // Initial color
let endColor;
let sound; // Variable to hold the sound

let color1;
let color2;
let colorCounter = 1;

// variables-------------------------------------
let waitTime = "--"; // Duration of the timer in minutes
let percentage = 0; // This will hold the current percentage for the circle
let repeatAction = false; // Change this variable to control the visibility of the repeat button
let soundPlayed = false;
let recipeStep = "Start"
let bowl = "🔥️"
let currentStepIndex = 0; // Track the current step index in the recipe
let recipeSteps = []; // Store the recipe steps loaded from sessionStorage
let startTime; // Track the start time of the animation
//-----------------------------------------------

function preload() {
  // Load the sound file (ensure the sound file is in the correct path)
  // sound = loadSound('static/whoosh.mp3'); // Replace with the correct path to your sound file
}

function setup() {

  color1 = color('#E61A6F'); // pink 
  color2 = color('#1AE67F'); // green
  
  // Create a canvas that fills the entire window
  createCanvas(windowWidth, windowHeight);
  repeatButtonPosition = [width / 2 - 50, height / 2 + 80];
  nextButtonPosition =[width - 120, height - 50];

  // Retrieve recipe steps from sessionStorage
  const storedRecipeSteps = sessionStorage.getItem('recipeSteps');
  if (storedRecipeSteps) {
    recipeSteps = JSON.parse(storedRecipeSteps); // Parse and load the steps
  } else {
    alert('No recipe data found!');
    return;
  }

  // Initialize startTime to track when the animation starts
  startTime = millis();

  // Create the "Prev" button at the bottom left
  prevButton = createButton('Prev');
  prevButton.position(20, height - 50);  // Position at bottom left
  prevButton.addClass('button-54');
  prevButton.size(100, 40); // Set button size
  prevButton.mousePressed(prevAction); // Define the action when the button is pressed

  // Create the "Next" button at the bottom right
  nextButton = createButton('Next');
  nextButton.position(nextButtonPosition[0], nextButtonPosition[1]);  // Position at bottom right
  nextButton.addClass('button-54');
  nextButton.size(100, 40); // Set button size
  nextButton.mousePressed(nextAction); // Define the action when the button is pressed

  // Create the "Repeat" button below the timer (conditionally visible)
  repeatButton = createButton('Repeat');
  repeatButton.position(repeatButtonPosition[0], repeatButtonPosition[1]); // Position below the timer
  repeatButton.addClass('button-54');
  repeatButton.size(100, 40); // Set button size
  repeatButton.mousePressed(repeatActionPressed); // Define the action when the button is pressed

  // Hide the Repeat button initially if repeatAction is false
  toggleRepeatButton();
}

function draw() {
  let progress = map(percentage, 0, 100, 0, 1);  // Progress goes from 0 to 1

  if(colorCounter%2==0){
    startColor = color1; 
    endColor = color2;   
  }else{
    startColor = color2; 
    endColor = color1;   
  }

  // Interpolate between the start and end colors
  let r = lerp(red(startColor), red(endColor), progress);
  let g = lerp(green(startColor), green(endColor), progress);
  let b = lerp(blue(startColor), blue(endColor), progress);

  // Set the background color to the interpolated color
  background(r, g, b); // Background color

  // Calculate the percentage of completion based on the elapsed time
  let elapsedTime = ((millis() - startTime) / 1000) / 60; // Time in minutes
  if(waitTime=="--"||waitTime==0)
    percentage =  100
  else
    percentage = map(elapsedTime, 0, waitTime, 0, 100); // Map elapsed time to percentage
  
  // Stop the animation if percentage reaches 100
  if (percentage >= 100) {
    percentage = 100; // Ensure it doesn't go over 100
    /*
    if (!sound.isPlaying() && !soundPlayed) { // Check if the sound is not already playing
      sound.play(); // Play the sound
      soundPlayed = true;
    }
      */
  }

  // Example of drawing the throbbing circle
  drawThrobbingCircle(width / 2, height / 2, 400, percentage);

  // Draw the texts and the line at the center of the canvas
  let textOnly = false;
  if(waitTime=="--"||waitTime==0)
    textOnly = true;
  drawBoilAndTimerText(width / 2, height / 2, waitTime - int(elapsedTime),textOnly); // Show remaining time
}

// Function to draw the throbbing circle (progress circle)
function drawThrobbingCircle(x, y, radius, percentage) {
  let startAngle = -HALF_PI; // Start angle for progress (top of the circle)
  let endAngle = map(percentage, 0, 100, -HALF_PI, TWO_PI - HALF_PI); // Map percentage to an angle
  
  // Draw the circle background
  fill(0, 0, 0, 25);
  stroke(200);
  strokeWeight(0);
  ellipse(x, y, radius * 2, radius * 2);

  // Draw the progress (border throbber effect)
  noFill();
  strokeWeight(25);

  stroke(0, 0, 0);
  arc(x + 10, y + 10, radius * 2, radius * 2, startAngle, endAngle);

  stroke(255, 255, 255); // White color for the progress stroke
  arc(x, y, radius * 2, radius * 2, startAngle, endAngle);

  // Optional: Add a pulsing effect
  let pulse = sin(frameCount * 0.1) * 10; // Calculate pulse size based on sin for smooth animation
  strokeWeight(10 + pulse); // Make the border "throb" by changing its width slightly
  arc(x, y, radius * 2, radius * 2, startAngle, endAngle);
}

// Function to draw the "Boil" and timer text with a horizontal line between them
function drawBoilAndTimerText(x, y, remainingTime, textOnly) {
  if(bowl){
    // Draw a white circle with the number "1" inside it
    strokeWeight(0);
    fill(0); // White fill for the circle
    ellipse(x + 10 , y - 125 + 10, 50, 50); // Draw a circle at position (x, y-80) with radius 25
    fill(255); // White fill for the circle
    ellipse(x, y - 125, 50, 50); // Draw a circle at position (x, y-80) with radius 25

    // Draw the "1" text inside the circle
    textSize(30); // Text size for the "1"
    textAlign(CENTER, CENTER); // Align text in the center
    fill(0); // Black text color for contrast
    text(bowl , x, y - 125); // Position "1" inside the circle

  }
  // Draw recipe step text
  strokeWeight(0);
  textSize(50); // Text size for the recipe step
  textAlign(CENTER, CENTER); // Align text in the center
  fill(255); // White text color
  text(recipeStep, x, y - 40); // Position "Boil" above the line

  strokeWeight(1);
  // Draw the horizontal line between the two texts
  line(x - 100, y, x + 100, y); // Draw a horizontal line from x-100 to x+100

  // Draw the remaining time text below the line
  strokeWeight(0);
  fill(255); // White text color
  textSize(32); // Text size for remaining time
  if(!textOnly)
    remainingTime = max(0, remainingTime);
  else
    remainingTime = "--"
  text(remainingTime + " mins", x, y + 40); // Position the remaining time text below the line
}

// Action for the "Prev" button
function prevAction() {
    // Go to the previous recipe step
    currentStepIndex = (currentStepIndex - 1 + recipeSteps.length) % recipeSteps.length;
    updateStepVariables();
}

// Action for the "Next" button
function nextAction() {
  // Go to the next recipe step
  currentStepIndex = (currentStepIndex + 1) % recipeSteps.length;
  updateStepVariables();
}

// Action for the "Repeat" button
// Action for the "Repeat" button
function repeatActionPressed() {
  console.log("Repeat Button Pressed");

  let foundRepeatStep = false;
  let previousStepIndex = currentStepIndex - 1;

  // Traverse backwards to find a previous step whose action starts with "//"
  for (let i = previousStepIndex; i >= 0; i--) {
    const step = recipeSteps[i];
    if (step.action && step.action.startsWith("//")) {
      previousStepIndex = i;
      foundRepeatStep = true;
      break; // Exit the loop once the step is found
    }
  }

  // If no step was found with "//", go to the first step
  if (!foundRepeatStep) {
    previousStepIndex = 0;
  }

  // Update the current step index and variables
  currentStepIndex = previousStepIndex;
  updateStepVariables();
}


// Adjust the canvas size when the window is resized
/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reposition buttons after resizing the window
  prevButton.position(20, height - 50);  // Keep "Prev" button at bottom left
  
  // Check if repeatAction is true or false to set Next button's position
  if (repeatAction) {
    nextButton.position(width - 120, height - 50);  // Position Next button at bottom right
  } else {
    nextButton.position(width / 2 - 50, height / 2 + 80);  // Position Next button where Repeat was
  }
  
  repeatButton.position(width / 2 - 50, height / 2 + 80); // Position "Repeat" below the timer

  // Update button visibility and position based on repeatAction value
  toggleRepeatButton();
}
*/

// Function to toggle visibility of the Repeat button based on repeatAction
function toggleRepeatButton() {
  if (repeatAction) {
    repeatButton.show(); // Show the repeat button
    nextButton.position(nextButtonPosition[0],nextButtonPosition[1]);
  } else {
    repeatButton.hide(); // Hide the repeat button
    nextButton.position(repeatButtonPosition[0],repeatButtonPosition[1]);
  }
}

// Update step variables based on the current recipe step
function updateStepVariables() {
  colorCounter++;
  percentage = 0;
  const currentStep = recipeSteps[currentStepIndex];
  recipeStep = currentStep.action || "--"; // Set the current step action
  bowl = currentStep.bowl || "🔥️"; // Set the bowl for the step
  waitTime = currentStep.time || "--"; // Set the wait time for the step
  startTime = millis();
  repeatAction = recipeStep==="Repeat"; // Control visibility of the repeat button
  soundPlayed = false; // Reset sound played flag

  // Hide the Repeat button initially if repeatAction is false
  toggleRepeatButton();
}
