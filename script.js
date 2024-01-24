document.addEventListener('DOMContentLoaded', function () {
	const timeline = document.getElementById('timeline');
	const eventDescription = document.getElementById('event-description');
	const photoAlbum = document.getElementById('photo-album');
	const backToTimelineButton = document.createElement('button');
	backToTimelineButton.id = 'back-to-timeline-button';
	backToTimelineButton.textContent = 'Back to Timeline';

	backToTimelineButton.addEventListener('click', function () {
		timeline.style.display = 'flex';
		eventDescription.style.display = 'none';
		photoAlbum.style.display = 'none';
		backToTimelineButton.style.display = 'none';
	});

	photoAlbum.style.display = 'none';

	document.addEventListener('wheel', function (event) {
		const scrollSpeed = 2;

		if (event.target.id !== 'photo-album') {
			timeline.scrollLeft += event.deltaY * scrollSpeed;
			event.preventDefault();
		} else {
			photoAlbum.scrollLeft += event.deltaY * scrollSpeed;
			event.preventDefault();
		}
	});

	const events = [
		{
			title: 'Baby Lamb',
			image: './images/baby_sheep.jpg',
			images: [
				'./images/baby_sheep/baby_1.jpg',
				'./images/baby_sheep/baby_2.jpg',
				'./images/baby_sheep/baby_3.jpg',
				'./images/baby_sheep/baby_4.jpg',
			],
			text: 'In this world, a lamb did appear,\nTiny feet strong, no need to fear.\nChildhood sweet, like strawberries dear,\nAn adorable journey, drawing near.',
		},
		{
			title: 'Child Lamb',
			image: './images/child_sheep.jpg',
			images: [
				'./images/child_sheep/child_1.jpg',
				'./images/child_sheep/child_2.jpg',
			],
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

	events.forEach((event) => {
		const eventElement = document.createElement('div');
		eventElement.classList.add('timeline-event');

		const imgElement = document.createElement('img');
		imgElement.src = event.image;
		imgElement.alt = event.title;
		eventElement.appendChild(imgElement);

		const titleElement = document.createElement('div');
		titleElement.classList.add('event-title');
		titleElement.textContent = event.title;
		eventElement.appendChild(titleElement);

		if (event.text) {
			const textElement = document.createElement('div');
			textElement.classList.add('event-text');
			textElement.textContent = event.text;
			eventElement.appendChild(textElement);
		}

		eventElement.addEventListener('click', function () {
			timeline.style.display = 'none';
			eventDescription.style.display = 'block';
			showEventDescription(event);
			photoAlbum.appendChild(backToTimelineButton);
		});

		timeline.appendChild(eventElement);
	});

	function showEventDescription(event) {
		// Clear previous content in the photo-album div
		const photoAlbum = document.getElementById('photo-album');
		photoAlbum.innerHTML = '';

		const albumImages = event.images || [];
		albumImages.forEach((imageSrc) => {
			const imgElement = document.createElement('img');
			imgElement.src = imageSrc;
			imgElement.alt = event.title + ' Album Image';
			imgElement.classList.add('album-image');
			photoAlbum.appendChild(imgElement);
		});

		timeline.style.display = 'none';
		eventDescription.style.display = 'none';
		photoAlbum.style.display = 'flex';
		backToTimelineButton.style.display = 'block';
	}
});
