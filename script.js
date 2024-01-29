document.addEventListener('DOMContentLoaded', function () {
	const timeline = document.getElementById('timeline');
	const eventDescription = document.getElementById('event-description');
	let photoAlbum; // Declare photoAlbum variable
	let selectedEventTitle; // Variable to store the currently selected event title

	// Function to fetch events from the server
	async function fetchEvents() {
		const response = await fetch('http://localhost:3000/events');
		const events = await response.json();
		renderTimeline(events);
		// After rendering timeline, photo album is created
		photoAlbum = document.getElementById('photo-album');
		// Call createAddPhotoButton to append "Add Photo" button
		createAddPhotoButton();
	}

	// Function to create and append the add photo button
	function createAddPhotoButton() {
		if (photoAlbum) {
			// Create the add photo button
			console.log('Creating Add Photo Button');
			console.log('photoAlbum:', photoAlbum);
			const addPhotoButton = document.createElement('button');
			addPhotoButton.textContent = 'Add Photo';
			addPhotoButton.id = 'add-photo-button';

			// Add click event listener to the add photo button
			addPhotoButton.addEventListener('click', function () {
				// Trigger file picker dialog
				const input = document.createElement('input');
				input.type = 'file';
				input.multiple = true;
				input.accept = 'image/*';
				input.onchange = handleFileSelection;
				input.click();
			});

			// Append the button to the photo album
			photoAlbum.appendChild(addPhotoButton);
		}
	}

	// Function to handle file selection
	function handleFileSelection(event) {
		const files = event.target.files;
		if (files.length === 0) return;

		// Upload each selected file with the selected event title
		for (const file of files) {
			uploadFile(file, selectedEventTitle);
		}
	}

	// Function to upload file
	function uploadFile(file, eventTitle) {
		// Create FormData object to send file data
		const formData = new FormData();
		formData.append('image', file); // Use 'image' as the key for file upload
		formData.append('eventTitle', eventTitle); // Include the event title

		// Make a POST request to your server endpoint for file upload
		fetch('http://localhost:3000/upload', {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					return response.text(); // If successful, return response text
				}
				throw new Error('Network response was not ok.');
			})
			.then((data) => {
				console.log('File uploaded successfully:', data); // Log the uploaded file's response
				// Optionally, you can update the UI to indicate success
			})
			.catch((error) => {
				console.error('Error uploading file:', error); // Log any errors that occurred during upload
				// Optionally, you can update the UI to indicate failure
			});
	}

	// Function to smoothly scroll the timeline
	function smoothScrollTo(target, duration) {
		const start = timeline.scrollLeft;
		const distance = target - start;
		const startTime = performance.now();

		function scrollAnimation(currentTime) {
			const elapsedTime = currentTime - startTime;
			const scrollAmount = easeInOutQuad(
				elapsedTime,
				start,
				distance,
				duration
			);
			timeline.scrollLeft = scrollAmount;
			if (elapsedTime < duration) {
				requestAnimationFrame(scrollAnimation);
			}
		}

		// Easing function for smooth scrolling
		function easeInOutQuad(t, b, c, d) {
			t /= d / 2;
			if (t < 1) return (c / 2) * t * t + b;
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		}

		requestAnimationFrame(scrollAnimation);
	}

	// Add a global event listener for mousewheel to disable default scrolling
	document.addEventListener(
		'wheel',
		function (e) {
			// Check if the photo album is displayed
			if (photoAlbum && photoAlbum.style.display === 'flex') return; // If photo album is displayed, do nothing

			// Check if vertical scrollbar is visible
			if (timeline.scrollHeight > timeline.clientHeight) {
				// Prevent default scrolling behavior
				e.preventDefault();
			}

			// Calculate the target scroll position based on the direction of the scroll
			const delta = e.deltaY;
			const target = timeline.scrollLeft + delta;

			// Smoothly scroll to the target position
			smoothScrollTo(target, 65); // Adjust duration as needed
		},
		{ passive: false }
	);

	// Function to render the timeline based on events
	function renderTimeline(events) {
		// Clear existing timeline content
		timeline.innerHTML = '';

		// Dynamically create timeline events
		events.forEach((event) => {
			const eventElement = document.createElement('div');
			eventElement.classList.add('timeline-event');

			// Check if the event has a cover image before accessing it
			const coverImagePath = event.cover || '/uploads/covers/default_cover.jpg';

			// Create an img element for the event cover
			const imgElement = document.createElement('img');
			imgElement.src = coverImagePath;
			imgElement.alt = event.title;
			eventElement.appendChild(imgElement);

			// Create a title element for the event
			const titleElement = document.createElement('div');
			titleElement.classList.add('event-title');
			titleElement.textContent = event.title;
			eventElement.appendChild(titleElement);

			// Create a text element for the event (visible on hover)
			if (event.text) {
				const textElement = document.createElement('div');
				textElement.classList.add('event-text');
				textElement.textContent = event.text;
				eventElement.appendChild(textElement);
			}

			// Handle the click event
			eventElement.addEventListener('click', function () {
				// Show the timeline and hide the event description
				timeline.style.display = 'none';
				eventDescription.style.display = 'block';
				showEventDescription(event);

				// Show the photo album
				if (photoAlbum) {
					photoAlbum.style.display = 'flex';
				}

				// Append the button to the visible photo album
				const visiblePhotoAlbum = document.querySelector('.photo-album');
				if (
					visiblePhotoAlbum &&
					window.getComputedStyle(visiblePhotoAlbum).display === 'flex'
				) {
					// Remove existing back buttons
					document.querySelectorAll('#back-button').forEach((button) => {
						button.remove();
					});

					// Create a new back button
					const backButtonCopy = document.createElement('button');
					backButtonCopy.id = 'back-button';
					backButtonCopy.textContent = 'Back to Timeline';

					// Create a new add button
					const addButtonCopy = document.createElement('button');
					addButtonCopy.id = 'add-photo-button';
					addButtonCopy.textContent = 'Add Photo';

					// Add click event listener to the add photo button
					addButtonCopy.addEventListener('click', function () {
						// Trigger file picker dialog
						const input = document.createElement('input');
						input.type = 'file';
						input.multiple = true;
						input.accept = 'image/*';
						input.onchange = handleFileSelection;
						input.click();
					});

					// Insert the buttons as the first children of the visible photo album
					visiblePhotoAlbum.insertAdjacentElement('afterbegin', backButtonCopy);
					visiblePhotoAlbum.insertAdjacentElement('afterbegin', addButtonCopy);
				}
			});

			// Append the event to the timeline
			timeline.appendChild(eventElement);
		});
	}

	// Function to show event description
	function showEventDescription(event) {
		const photoAlbum = document.getElementById('photo-album');

		// Clear existing content in the photo album
		photoAlbum.innerHTML = '';

		// Populate the photo album with images from the selected event
		event.images.forEach((image) => {
			const imgElement = document.createElement('img');
			imgElement.src = image.path;
			imgElement.alt = image.alt;
			photoAlbum.appendChild(imgElement);
		});
	}

	// Add an event listener for clicks on the document
	document.addEventListener('click', function (e) {
		if (e.target.matches('#back-button')) {
			// Handle the click event for the back button
			// Show the timeline and hide the event description
			timeline.style.display = 'flex';
			eventDescription.style.display = 'none';
			if (photoAlbum) {
				photoAlbum.style.display = 'none';
			}

			// Remove the back button from the visible photo album
			const visiblePhotoAlbum = document.querySelector('.photo-album');
			if (
				visiblePhotoAlbum &&
				window.getComputedStyle(visiblePhotoAlbum).display === 'flex'
			) {
				document.getElementById('back-button').remove();
			}
		}
	});

	// Disable smooth scrolling for the timeline
	document.querySelector('.timeline').style.scrollBehavior = 'auto';

	// Fetch events when the page loads
	fetchEvents();
});
