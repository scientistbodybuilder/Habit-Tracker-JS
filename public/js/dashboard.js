const addHabits = document.querySelector(".add-habit");
const habitsList = document.querySelector(".habits");
const habits = [];
const modal=document.getElementById("modal");
const overlay = document.getElementById("overlay");
const editform = document.querySelector(".edit-habit");

//somehow get the ID of the USER
let changeHabitID;

//Habit Functionality

// Toggle If Complete  UPDATE
async function toggleCompleted(e) {
  try {
    if (!e.target.classList.contains("check")) return;
    const check = e.target;
    const habitId = check.dataset.habitid;

    const data = {
      habitId: habitId
    }
    const response = await fetch("/dashboard-toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
    window.location.href = "/dashboard"

    } catch(e){
      console.log('Error in toggle: ', e);
    }
  }

// Delete Habit  UPDATE
async function deleteHabit(e) {
  try{
    if (!e.target.classList.contains("delete")) return;

    const el = e.target;
    const habitId = el.dataset.habitid;
    const index = el.dataset.index;
    const id = el.id;
    //const habitId = el.dataset.habitId;
    const data = {
      habitId: habitId
    }
    const response = await fetch("/dashboard-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
    window.location.href = "/dashboard";
  } catch(e){
    console.log('Error in delete: ',e);
  }
}

//open edit window
function openModal (e){
  if (!e.target.classList.contains("edit")) return;
  modal.classList.add('active');
  overlay.classList.add('active');
  const element = e.target;
  changeHabitID = element.dataset.habitid;
  //why not toggle?
};

//make edit  UPDATE
async function makeedit(e) {
  try{
    const newreps = +document.getElementById("ereps").value;
    const newfrequency = document.getElementById("etimeframe").value;
    const data = {
      habitId: changeHabitID,
      newReps: newreps,
      newFrequency: newfrequency
    };
    await fetch("/dashboard-edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });    
  
    editform.reset();
    modal.classList.remove('active');
    overlay.classList.remove('active');
  } catch(e){
    console.log('Error: ',e);
  }

};

//close edit window
function closeModal(e){
  if (!e.target.classList.contains("close-button")) return;
  //clear the inputs
  editform.reset();
  modal.classList.remove('active');
  overlay.classList.remove('active');
};

editform.addEventListener("submit", makeedit);
habitsList.addEventListener("click", toggleCompleted);
habitsList.addEventListener("click", deleteHabit);
habitsList.addEventListener("click", openModal);
modal.addEventListener("click", closeModal);

//----------------------------------IMPLEMENT STREAK SYSTEM--------------------------------------------------------->