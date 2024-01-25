document.addEventListener('DOMContentLoaded', function () {
	console.log('Script is running after DOMContentLoaded.');

	const timeline = document.getElementById('timeline');
	const eventDescription = document.getElementById('event-description');
	const photoAlbum = document.getElementById('photo-album');
	const events = document.querySelectorAll('.timeline-event');

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
			if (photoAlbum.style.display === 'flex') return; // If photo album is displayed, do nothing

			// Calculate the target scroll position based on the direction of the scroll
			const delta = e.deltaY;
			const target = timeline.scrollLeft + delta;

			// Smoothly scroll to the target position
			smoothScrollTo(target, 65); // Adjust duration as needed

			// Prevent default scrolling behavior
			e.preventDefault();
		},
		{ passive: false }
	);

	// Fetch events when the page loads
	fetchEvents();
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
			}
		}
	});

	// Disable smooth scrolling for the timeline
	document.querySelector('.timeline').style.scrollBehavior = 'auto';

	// Fetch events when the page loads
	fetchEvents();
});
