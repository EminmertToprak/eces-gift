document.addEventListener('DOMContentLoaded', function () {
	const timeline = document.getElementById('timeline');
	const eventDescription = document.getElementById('event-description');
	const backButton = document.getElementById('back-button');

	const events = [
		{
			title: 'Baby Lamb',
			image: './images/baby_sheep.jpg',
			images: [
				'./images/baby_sheep/baby1.jpg',
				'./images/baby_sheep/baby2.jpg',
				'./images/baby_sheep/baby3.jpg',
			],
			text: 'In this world, a lamb did appear,\nTiny feet strong, no need to fear.\nChildhood sweet, like strawberries dear,\nAn adorable journey, drawing near.',
		},
		{
			title: 'Child Lamb',
			image: './images/young_sheep.jpg',
			images: ['image1.jpg', 'image2.jpg'],
			text: 'In a cradle of joy, a lamb so sweet,\nTiny hooves dancing to a playful beat.\nCurious eyes, exploring each street,\nA fluffy adventurer, in places to meet.',
		},
		{
			title: 'School Lamb',
			image: './images/teenage_sheep.jpg',
			images: ['image1.jpg', 'image2.jpg'],
			text: "School years unfold, my lamb in stride,\nIn Dad's shadow, a comforting guide.\nFamily ties strong, love as our pride,\nHumor, sharing, success side by side.",
		},
		{
			title: 'Dutch Lamb',
			image: './images/dutch_sheep.jpg',
			images: ['image1.jpg', 'image2.jpg'],
			text: "Guided by winds in Holland's embrace,\nSuccess in business, smiles light up the face.\nLove and career, a harmonious trace,\nA new chapter written in life's warm embrace.",
		},
		{
			title: 'Married Lamb',
			image: './images/married_sheep.jpg',
			images: ['image1.jpg', 'image2.jpg'],
			text: "Sloth watches, a friend keeping calm,\nMaster of laughter, chores in love's warm.\nA fairytale marriage, time won't harm,\nEvery moment adds value, love is our charm.",
		},
	];

	// Dynamically create timeline events
	events.forEach((event) => {
		const eventElement = document.createElement('div');
		eventElement.classList.add('timeline-event');

		// Create an img element for the event
		const imgElement = document.createElement('img');
		imgElement.src = event.image;
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
		});

		timeline.appendChild(eventElement);
	});

	// Handle scroll event to create a horizontal scrolling effect
	document.addEventListener('wheel', function (event) {
		// Adjust the scrolling speed by changing the multiplier (e.g., 2)
		const scrollSpeed = 2;
		timeline.scrollLeft += event.deltaY * scrollSpeed;

		// Prevent the default vertical scrolling behavior
		event.preventDefault();
	});

	// Add a custom back button to navigate to the timeline
	backButton.addEventListener('click', function () {
		// Show the timeline and hide the event description
		timeline.style.display = 'flex';
		eventDescription.style.display = 'none';

		// Go back in the browser history
		history.back();
	});

	// Function to display the event description
	function showEventDescription(event) {
		// Clear previous content
		eventDescription.innerHTML = '';

		// Handle the event data, e.g., display album images
		const albumImages = event.images || [];
		albumImages.forEach((imageSrc) => {
			console.log('Image Path:', imageSrc); // Log the image path
			const imgElement = document.createElement('img');
			imgElement.src = imageSrc; // Use relative path
			imgElement.alt = event.title + ' Album Image';
			imgElement.classList.add('album-image'); // Add a class for styling
			eventDescription.appendChild(imgElement);
		});

		// Show the event description and hide the timeline
		timeline.style.display = 'none';
		eventDescription.style.display = 'block';

		// Show the back button
		backButton.style.display = 'block';
	}
});
