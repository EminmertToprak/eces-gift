document.addEventListener('DOMContentLoaded', function () {
	console.log('Script is running after DOMContentLoaded.');

	const timeline = document.getElementById('timeline');
	const eventDescription = document.getElementById('event-description');
	const backButton = document.getElementById('back-button');
	const photoAlbum = document.getElementById('photo-album');

	console.log('Timeline:', timeline);
	console.log('Event Description:', eventDescription);
	console.log('Back Button:', backButton);
	console.log('Photo Album:', photoAlbum);

	// Add a global event listener for mousewheel to disable default scrolling
	document.addEventListener('wheel', function (e) {
		// Check if the mouse wheel event occurred over the timeline
		const isTimeline = e.target.closest('#timeline');

		if (isTimeline) {
			// Disable default top-to-bottom scrolling
			e.preventDefault();

			// Adjust the timeline's scrollLeft property based on the direction of the scroll
			timeline.scrollLeft += e.deltaY;
		}
	});

	// Function to fetch events from the server
	async function fetchEvents() {
		const response = await fetch('http://localhost:3000/events');
		const events = await response.json();
		renderTimeline(events);
	}

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
				photoAlbum.style.display = 'flex';

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

					// Insert the button as the first child of the visible photo album
					visiblePhotoAlbum.insertAdjacentElement('afterbegin', backButtonCopy);
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
			photoAlbum.style.display = 'none';
			console.log('back button clicked');

			// Remove the back button from the visible photo album
			const visiblePhotoAlbum = document.querySelector('.photo-album');
			if (
				visiblePhotoAlbum &&
				window.getComputedStyle(visiblePhotoAlbum).display === 'flex'
			) {
				// The photo album is visible
				// Your existing logic for handling the back button
			}
		}
	});

	// Fetch events when the page loads
	fetchEvents();
});
